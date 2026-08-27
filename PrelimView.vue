<script setup>
import PanelBlock from '../components/PanelBlock.vue'
import TagPill from '../components/TagPill.vue'
import { prelim } from '../data/contestData'
import { openModal, setPrelimTab, showToast, state } from '../stores/contestStore'

function submit(type) {
  showToast(type + ' 已进入本地演示提交队列')
}
</script>

<template>
  <div class="view-stack prelim-view">
    <div class="tabs">
      <button class="tab" :class="{ active: state.prelimTab === 'workbench' }" type="button" @click="setPrelimTab('workbench')">预测提交</button>
      <button class="tab" :class="{ active: state.prelimTab === 'model' }" type="button" @click="setPrelimTab('model')">模型与报告</button>
      <button class="tab" :class="{ active: state.prelimTab === 'total' }" type="button" @click="setPrelimTab('total')">初赛总成绩</button>
    </div>

    <template v-if="state.prelimTab === 'workbench'">
      <div class="grid g2 workbench-grid">
        <section class="panel experiment-card codex-prelim-final-sim">
          <div class="workbench-head">
            <span class="tag blue">仿真实验</span>
            <h3>高精度仿真装置实验</h3>
            <p class="compact-copy">根据 C101 脱丙烷塔工况任务开展实验，获取温度、压力、流量、液位等过程数据。</p>
          </div>
          <div class="experiment-meta">
            <div v-for="item in prelim.meta" :key="item[0]"><b>{{ item[0] }}</b><span>{{ item[1] }}</span></div>
          </div>
          <div class="experiment-actions">
            <button class="btn primary" type="button" @click="showToast('已生成本次实验数据')">生成实验数据</button>
            <span class="experiment-status">最近实验：2 小时前</span>
          </div>
        </section>

        <section class="panel prediction-card">
          <div class="workbench-head">
            <h3 class="section">提交测试集预测结果</h3>
            <p class="compact-copy">上传预测 CSV 后系统进行实时评分，每队每日最多提交 10 次。</p>
          </div>
          <button class="drop" type="button" @click="submit('预测 CSV')"><b>上传 prediction.csv</b><span>用于实时 NRMSE 评分，客观评分 45 分</span></button>
          <div class="file-actions"><button class="btn" type="button">下载模板</button><button class="btn primary" type="button" @click="submit('预测 CSV')">提交预测结果</button></div>
        </section>
      </div>

      <PanelBlock title="提交记录">
        <table>
          <thead><tr><th>时间</th><th>文件</th><th>得分</th></tr></thead>
          <tbody><tr v-for="row in prelim.submissions" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td class="mono"><b>{{ row[2] }}</b></td></tr></tbody>
        </table>
      </PanelBlock>
    </template>

    <template v-else-if="state.prelimTab === 'model'">
      <div class="grid g2">
        <PanelBlock title="提交 Docker 封装模型">
          <div class="code">docker build -t virtual-instrument:prelim .<br>docker save virtual-instrument:prelim -o model.tar</div>
          <button class="drop" type="button" @click="submit('Docker 模型')"><b>上传 model.tar 镜像文件</b><span>用于统一新工况数据运行测试，客观评分 45 分</span></button>
          <button class="drop" type="button" @click="submit('实施方案报告')"><b>上传实施方案报告 PDF</b><span>包含工业问题理解、实验设计、数据处理、模型构建与评估</span></button>
          <div class="file-actions"><button class="btn violet" type="button" @click="submit('模型与报告')">提交模型与报告</button></div>
        </PanelBlock>
        <PanelBlock title="统一评测状态">
          <div class="step-list">
            <div><span class="rank green">1</span><b>材料已接收</b></div>
            <div><span class="rank blue">2</span><b>等待截止后统一评测</b></div>
            <div><span class="rank">3</span><b>公布 Docker 与报告成绩</b></div>
          </div>
          <p class="taskbook-note">原则上，线上初赛总分排名前 12 名的队伍进入线下决赛。</p>
        </PanelBlock>
      </div>
    </template>

    <template v-else>
      <PanelBlock title="初赛总成绩">
        <div class="score-summary"><span>预测 CSV</span><b>92.34</b><span>Docker 模型</span><b>待公布</b><span>报告</span><b>待公布</b></div>
        <button class="btn primary" type="button" @click="openModal('初赛总成绩说明', 'Docker 与报告成绩会在提交截止后约一周统一公布。')">查看说明</button>
      </PanelBlock>
    </template>
  </div>
</template>
