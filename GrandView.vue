<script setup>
import HeroPanel from '../components/HeroPanel.vue'
import PanelBlock from '../components/PanelBlock.vue'
import { setGrandTab, showToast, state } from '../stores/contestStore'
const processImage = './assets/grand-process-3d.jpg'
</script>

<template>
  <div class="view-stack grand-view">
    <HeroPanel tone="grand" title="现场实操、成果汇报与综合答辩" text="线下决赛采用现场比赛方式，包括现场实操、成果汇报和综合答辩三部分。" />
    <div class="tabs">
      <button class="tab" :class="{ active: state.grandTab === 'pre' }" type="button" @click="setGrandTab('pre')">赛前材料</button>
      <button class="tab" :class="{ active: state.grandTab === 'live' }" type="button" @click="setGrandTab('live')">现场实操</button>
    </div>

    <div v-if="state.grandTab === 'pre'" class="grid g2">
      <PanelBlock title="答辩 PPT 准备">
        <p class="compact-copy">提交线下决赛答辩材料，供评委现场审阅。</p>
        <button class="drop" type="button" @click="showToast('答辩材料已同步至演示队列')"><b>上传答辩 PPT</b><span>支持 PPT / PDF 演示文件</span></button>
      </PanelBlock>
      <PanelBlock title="汇报结构建议">
        <div class="taskbook-line"><span class="rank blue">1</span><div><b>实验方案</b><p>说明工况设计和数据获取逻辑。</p></div></div>
        <div class="taskbook-line"><span class="rank green">2</span><div><b>模型方法</b><p>说明特征工程、模型验证和误差分析。</p></div></div>
        <div class="taskbook-line"><span class="rank orange">3</span><div><b>工程价值</b><p>说明虚拟仪表在现场操作中的应用价值。</p></div></div>
      </PanelBlock>
    </div>

    <div v-else class="grid g2">
      <section class="panel experiment-card grand-sim-panel">
        <div class="workbench-head"><span class="tag green">现场任务</span><h3>决赛现场仿真实验</h3><p class="compact-copy">按现场指定工况完成实验并调用本队初赛模型。</p></div>
        <div class="experiment-meta"><div><b>实验目标</b><span>现场指定工况</span></div><div><b>数据来源</b><span>高精度仿真装置</span></div><div><b>输入文件</b><span>现场工况 CSV</span></div></div>
        <button class="btn primary" type="button" @click="showToast('已生成现场数据')">生成现场数据</button>
      </section>
      <PanelBlock title="可视化大屏">
        <div class="screen-lite"><img :src="processImage" alt="3D 工艺图"><div><b class="mono">NRMSE 0.0182</b><span>模型运行中</span></div></div>
      </PanelBlock>
    </div>
  </div>
</template>
