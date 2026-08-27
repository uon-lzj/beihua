<script setup>
import StatCard from '../components/StatCard.vue'
import PanelBlock from '../components/PanelBlock.vue'
import { announcements, timeline } from '../data/contestData'
import { go, state } from '../stores/contestStore'
</script>

<template>
  <div class="view-stack">
    <section class="hero hero-blue dashboard-hero">
      <div class="hero-copy">
        <h2>欢迎回来，催化先锋</h2>
        <p>北京化工大学校内赛围绕 C101 脱丙烷塔塔底丙烷含量虚拟仪表构建展开。请按赛程完成培训学习、仿真实验设计、预测结果、Docker 模型和实施方案报告提交。</p>
      </div>
      <button class="btn primary" type="button" @click="go('prelim')">进入线上初赛</button>
    </section>

    <div class="grid g4">
      <StatCard title="当前预测得分" :value="state.team.score.toFixed(2)" note="测试集预测结果 · NRMSE 评分" tone="blue" />
      <StatCard title="实时排名" value="#12 / 86" note="前 12 名入围线下决赛" />
      <StatCard title="今日剩余提交" value="7 / 10" note="每日提交次数限制" />
      <StatCard title="线上初赛构成" value="45+45+10" note="预测 CSV / Docker / 报告" tone="orange" />
    </div>

    <PanelBlock title="赛程总览">
      <div class="timeline">
        <div v-for="(item, index) in timeline" :key="item[0]" class="tl" :class="item[3]">
          <div class="bubble">{{ item[3] === 'done' ? '✓' : index + 1 }}</div>
          <b>{{ item[0] }}</b>
          <span class="muted">{{ item[1] }}</span>
          <p class="muted">{{ item[2] }}</p>
        </div>
      </div>
    </PanelBlock>

    <PanelBlock title="公告 & 提醒">
      <button v-for="item in announcements" :key="item[0]" class="row row-button" type="button">
        <span class="dot" :class="item[2]" />
        <span><b>{{ item[0] }}</b><br><span class="muted">{{ item[1] }}</span></span>
        <span class="muted">查看</span>
      </button>
    </PanelBlock>
  </div>
</template>
