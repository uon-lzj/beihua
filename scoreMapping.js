function assertFiniteNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} 必须是有限数字`)
  }
}

function roundTo(value, digits) {
  const factor = 10 ** digits
  return Math.round((value + Number.EPSILON) * factor) / factor
}

/**
 * 将 NRMSE 线性映射为竞赛得分。
 *
 * 规则：全局最小 NRMSE 得满分，全局最大 NRMSE 得最低分。
 * NRMSE 越接近，映射后的分数也越接近。
 *
 * @param {number} teamNrmse 当前队伍 NRMSE
 * @param {number} globalMinNrmse 所有队伍最小 NRMSE
 * @param {number} globalMaxNrmse 所有队伍最大 NRMSE
 * @param {{ maxScore?: number, minScore?: number, digits?: number, epsilon?: number }} [options]
 * @returns {number}
 */
export function nrmseToScore(teamNrmse, globalMinNrmse, globalMaxNrmse, options = {}) {
  const { maxScore = 45, minScore = 20, digits = 2, epsilon = 1e-12 } = options

  assertFiniteNumber(teamNrmse, '当前队伍 NRMSE')
  assertFiniteNumber(globalMinNrmse, '全局最小 NRMSE')
  assertFiniteNumber(globalMaxNrmse, '全局最大 NRMSE')
  assertFiniteNumber(maxScore, '最高分')
  assertFiniteNumber(minScore, '最低分')

  if (globalMinNrmse < 0 || globalMaxNrmse < 0 || teamNrmse < 0) {
    throw new Error('NRMSE 不能为负数')
  }

  if (globalMaxNrmse < globalMinNrmse) {
    throw new Error('全局最大 NRMSE 不能小于全局最小 NRMSE')
  }

  if (maxScore < minScore) {
    throw new Error('最高分不能小于最低分')
  }

  if (Math.abs(globalMaxNrmse - globalMinNrmse) < epsilon) {
    return roundTo(maxScore, digits)
  }

  const score =
    maxScore -
    ((teamNrmse - globalMinNrmse) * (maxScore - minScore)) / (globalMaxNrmse - globalMinNrmse)
  const clampedScore = Math.min(maxScore, Math.max(minScore, score))
  return roundTo(clampedScore, digits)
}

/**
 * 给一组队伍 NRMSE 批量换算得分，适合实时榜单或赛后 CSV 成绩汇总。
 *
 * @param {{ teamId?: string, teamName?: string, nrmse: number }[]} rows
 * @param {{ maxScore?: number, minScore?: number, digits?: number, epsilon?: number }} [options]
 * @returns {({ teamId?: string, teamName?: string, nrmse: number, score: number, rank: number })[]}
 */
export function mapNrmseRowsToScores(rows, options = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('队伍 NRMSE 列表不能为空')
  }

  rows.forEach((row, index) => {
    assertFiniteNumber(row.nrmse, `第 ${index + 1} 行 NRMSE`)
    if (row.nrmse < 0) throw new Error(`第 ${index + 1} 行 NRMSE 不能为负数`)
  })

  const values = rows.map((row) => row.nrmse)
  const globalMinNrmse = Math.min(...values)
  const globalMaxNrmse = Math.max(...values)
  const sortedValues = [...new Set(values)].sort((a, b) => a - b)

  return rows
    .map((row) => ({
      ...row,
      score: nrmseToScore(row.nrmse, globalMinNrmse, globalMaxNrmse, options),
      rank: sortedValues.indexOf(row.nrmse) + 1
    }))
    .sort((a, b) => a.rank - b.rank || a.score - b.score)
}
