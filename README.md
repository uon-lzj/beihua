# 化工 AI 大赛学生竞赛平台 Vue 版

这是从单文件离线 HTML 拆出的 Vue 版本，目标是保留当前视觉与学生端核心流程，同时让后续维护和多人协作更清楚。

## 本地运行

```bash
pnpm install
pnpm dev
```

如果团队使用 npm，也可以：

```bash
npm install
npm run dev
```

## 目录说明

- `src/components`：导航、顶部栏、弹窗、通用卡片等共享组件
- `src/views`：各业务页面
- `src/data`：赛程、培训、任务书、团队、成绩等配置数据
- `src/stores`：页面状态、localStorage 持久化和弹窗状态
- `public/assets`：沿用原型中的图片资源

## 迁移策略

当前版本先迁移学生端主流程。组委会端、评委端和更复杂的队伍审批逻辑建议继续按模块迁移到 `views/admin`、`views/judge` 和独立 store 中。

## 评分脚本

- `src/utils/nrmseScoring.js`：计算数组或 CSV 的 NRMSE，默认使用真实值均值绝对值作为归一化分母，也可传入 `normalizer: 'range'` 或 `normalizer: 'std'`。
- `src/utils/scoreMapping.js`：将队伍 NRMSE 线性换算为 20-45 分，最小 NRMSE 为 45 分，最大 NRMSE 为 20 分，默认保留两位小数。
