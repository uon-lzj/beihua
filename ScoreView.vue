<script setup>
import HeroPanel from '../components/HeroPanel.vue'
import PanelBlock from '../components/PanelBlock.vue'
import { scoreRows } from '../data/contestData'
</script>

<template>
  <div class="view-stack score-view">
    <HeroPanel tone="score" title="入围状态与总成绩" text="线上初赛成绩与入围队伍线下决赛成绩集中展示，入围队伍同步展示线下决赛成绩。" />
    <PanelBlock title="入围决赛队伍">
      <table class="score-table">
        <thead><tr><th>排名</th><th>队伍</th><th>初赛</th><th>决赛</th><th>综合</th></tr></thead>
        <tbody><tr v-for="row in scoreRows" :key="row[0]"><td><span class="rank blue">{{ row[0] }}</span></td><td><b>{{ row[1] }}</b></td><td>{{ row[2] }}</td><td>{{ row[3] }}</td><td class="mono"><b>{{ row[4] }}</b></td></tr></tbody>
      </table>
    </PanelBlock>
    <section class="certificate-strip"><div class="certificate-mark">证</div><div><h3>电子参赛证书</h3><p>赛事结束后可在此查看并下载电子版证书。</p></div><button class="btn primary" type="button">查看证书</button></section>
  </div>
</template>
