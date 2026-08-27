<script setup>
import HeroPanel from '../components/HeroPanel.vue'
import PanelBlock from '../components/PanelBlock.vue'
import TagPill from '../components/TagPill.vue'
import { taskbook } from '../data/contestData'
import { go } from '../stores/contestStore'
</script>

<template>
  <div class="view-stack taskbook-view">
    <HeroPanel tone="task" :title="taskbook.heroTitle" :text="taskbook.heroText" />

    <div class="taskbook-meta">
      <section v-for="item in taskbook.meta" :key="item[0]" class="mini-panel">
        <TagPill :tone="item[3]">{{ item[0] }}</TagPill>
        <h3>{{ item[1] }}</h3>
        <p class="muted">{{ item[2] }}</p>
      </section>
    </div>

    <div class="taskbook-strip">
      <div v-for="item in taskbook.strip" :key="item[0]">
        <b>{{ item[0] }}</b>
        <span class="muted">{{ item[1] }}</span>
      </div>
    </div>

    <div class="grid g2">
      <PanelBlock title="核心任务拆解">
        <div v-for="(item, index) in taskbook.tasks" :key="item[0]" class="taskbook-line">
          <span class="rank blue">{{ index + 1 }}</span>
          <div><b>{{ item[0] }}</b><p>{{ item[1] }}</p></div>
        </div>
      </PanelBlock>
      <PanelBlock title="线上初赛交付物">
        <table class="taskbook-table">
          <thead><tr><th>提交成果</th><th>分值</th><th>评价方式</th></tr></thead>
          <tbody>
            <tr v-for="row in taskbook.deliverables" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td>{{ row[2] }}</td></tr>
          </tbody>
        </table>
        <p class="taskbook-note">参赛队伍完成账号注册、队伍创建并有效提交三项成果后，视为报名参赛成功。</p>
      </PanelBlock>
    </div>

    <div class="grid g2">
      <PanelBlock title="时间与奖项">
        <table class="taskbook-table compact">
          <tbody><tr v-for="row in taskbook.schedule" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td></tr></tbody>
        </table>
      </PanelBlock>
      <PanelBlock title="纪律与资料边界">
        <div class="discipline-list">
          <div><span class="rank red">1</span><span>参赛成果须由本队成员独立完成，严禁代做、抄袭、冒用他人成果。</span></div>
          <div><span class="rank orange">2</span><span>优秀参赛成果可用于教学研究、赛事总结、案例汇编等用途。</span></div>
          <div><span class="rank blue">3</span><span>未经许可，不得将竞赛资料、高精度仿真装置及相关内容用于商业用途。</span></div>
        </div>
      </PanelBlock>
    </div>

    <PanelBlock title="读完任务书后的推荐路径">
      <div class="taskbook-actions">
        <button class="btn green" type="button" @click="go('training')">去看赛前培训</button>
        <button class="btn primary" type="button" @click="go('prelim')">进入初赛提交</button>
        <button class="btn" type="button" @click="go('grand')">了解线下决赛</button>
        <button class="btn" type="button" @click="go('team')">检查团队信息</button>
      </div>
    </PanelBlock>
  </div>
</template>
