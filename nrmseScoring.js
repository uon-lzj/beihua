const DEFAULT_PREDICTION_COLUMNS = ['prediction', 'pred', 'y_pred', 'ypred', '预测值', '预测结果']
const DEFAULT_TRUE_COLUMNS = ['truth', 'true', 'y_true', 'ytrue', 'label', 'actual', '真实值', '真值', '对照值']

function assertFiniteNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} 必须是有限数字`)
  }
}

function mean(values) {
  return values.reduce((sum, item) => sum + item, 0) / values.length
}

function std(values) {
  const avg = mean(values)
  const variance = values.reduce((sum, item) => sum + (item - avg) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function getNormalizer(yTrue, method, customValue) {
  if (typeof method === 'number') return Math.abs(method)
  if (customValue !== undefined) return Math.abs(customValue)

  if (method === 'range') {
    return Math.max(...yTrue) - Math.min(...yTrue)
  }

  if (method === 'std') {
    return std(yTrue)
  }

  return Math.abs(mean(yTrue))
}

function normalizeHeader(header) {
  return String(header).trim().toLowerCase().replace(/\s+/g, '')
}

function parseCsvLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"' && inQuotes && next === '"') {
      current += '"'
      i += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  cells.push(current.trim())
  return cells
}

function parseCsv(csvText) {
  return String(csvText)
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCsvLine)
}

function findColumnIndex(headers, candidates, explicitName) {
  if (explicitName) {
    const index = headers.findIndex((header) => normalizeHeader(header) === normalizeHeader(explicitName))
    if (index === -1) throw new Error(`CSV 中未找到列：${explicitName}`)
    return index
  }

  const normalizedCandidates = candidates.map(normalizeHeader)
  return headers.findIndex((header) => normalizedCandidates.includes(normalizeHeader(header)))
}

function readNumericColumn(rows, columnIndex, label) {
  return rows.map((row, index) => {
    const value = Number(row[columnIndex])
    if (!Number.isFinite(value)) {
      throw new Error(`${label} 第 ${index + 2} 行不是有效数字`)
    }
    return value
  })
}

/**
 * 计算 NRMSE（归一化均方根误差）。
 *
 * 默认归一化分母为真实值均值的绝对值，适合塔底丙烷含量这类正值浓度指标。
 * 如赛题最终规定使用极差或标准差归一化，可将 normalizer 改为 'range' 或 'std'。
 *
 * @param {number[]} yPred 模型预测值数组
 * @param {number[]} yTrue 真实对照值数组
 * @param {{ normalizer?: 'mean' | 'range' | 'std' | number, epsilon?: number }} [options]
 * @returns {number}
 */
export function calcNRMSE(yPred, yTrue, options = {}) {
  const { normalizer = 'mean', epsilon = 1e-12 } = options

  if (!Array.isArray(yPred) || !Array.isArray(yTrue)) {
    throw new Error('预测值和真值必须是数组')
  }

  if (yPred.length !== yTrue.length) {
    throw new Error('预测数组与真值数组长度不一致')
  }

  if (yPred.length === 0) {
    throw new Error('数组不能为空')
  }

  let sumSquareError = 0
  for (let i = 0; i < yPred.length; i += 1) {
    assertFiniteNumber(yPred[i], `预测值第 ${i + 1} 项`)
    assertFiniteNumber(yTrue[i], `真值第 ${i + 1} 项`)

    const diff = yPred[i] - yTrue[i]
    sumSquareError += diff * diff
  }

  const rmse = Math.sqrt(sumSquareError / yPred.length)
  const denominator = getNormalizer(yTrue, normalizer)

  if (!Number.isFinite(denominator) || Math.abs(denominator) < epsilon) {
    throw new Error('NRMSE 归一化分母不能为 0，请检查真值数据或更换 normalizer')
  }

  return rmse / denominator
}

/**
 * 从提交 CSV 和对照 CSV 计算 NRMSE。
 * 两个文件默认按行对齐，提交文件读取 prediction/pred/y_pred/预测值等列，
 * 对照文件读取 truth/true/y_true/真实值/对照值等列。
 *
 * @param {string} predictionCsv 参赛队伍预测 CSV 文本
 * @param {string} truthCsv 真实对照 CSV 文本
 * @param {{ predictionColumn?: string, truthColumn?: string, normalizer?: 'mean' | 'range' | 'std' | number }} [options]
 * @returns {{ nrmse: number, count: number }}
 */
export function calcCsvNRMSE(predictionCsv, truthCsv, options = {}) {
  const predictionTable = parseCsv(predictionCsv)
  const truthTable = parseCsv(truthCsv)

  if (predictionTable.length < 2 || truthTable.length < 2) {
    throw new Error('CSV 至少需要包含表头和一行数据')
  }

  const predictionColumnIndex = findColumnIndex(
    predictionTable[0],
    DEFAULT_PREDICTION_COLUMNS,
    options.predictionColumn
  )
  const truthColumnIndex = findColumnIndex(truthTable[0], DEFAULT_TRUE_COLUMNS, options.truthColumn)

  if (predictionColumnIndex === -1) {
    throw new Error('提交 CSV 中未找到预测值列，请使用 prediction、pred、y_pred 或 预测值')
  }

  if (truthColumnIndex === -1) {
    throw new Error('对照 CSV 中未找到真值列，请使用 truth、true、y_true、真实值 或 对照值')
  }

  const yPred = readNumericColumn(predictionTable.slice(1), predictionColumnIndex, '预测 CSV')
  const yTrue = readNumericColumn(truthTable.slice(1), truthColumnIndex, '对照 CSV')

  return {
    nrmse: calcNRMSE(yPred, yTrue, options),
    count: yPred.length
  }
}
