<script setup>
import PanelBlock from '../components/PanelBlock.vue'
import { state, showToast } from '../stores/contestStore'
</script>

<template>
  <div class="view-stack team-view">
    <div class="grid team-layout">
      <PanelBlock title="个人参赛信息">
        <div class="personal-dashboard">
          <div class="profile-head"><div class="profile-avatar">王</div><div><h3>王思琪</h3><p class="muted">队员 · 过程装备 - 大四</p></div></div>
          <div class="personal-stat"><span>最佳得分</span><b class="mono">{{ state.team.score.toFixed(2) }}</b></div>
          <div class="personal-stat"><span>总提交</span><b class="mono">{{ state.team.submit }} 次</b></div>
        </div>
        <div class="action-row"><button class="btn primary" type="button" @click="showToast('创建队伍表单将在下一阶段迁移')">创建队伍</button><button class="btn" type="button" @click="showToast('加入队伍池将在下一阶段迁移')">加入队伍</button></div>
      </PanelBlock>

      <PanelBlock title="当前团队">
        <div class="team-block-head"><div><span class="level-label">团队信息</span><h2 class="level-title">{{ state.team.name }}</h2><p class="level-subtitle">当前队伍 · C101 赛题</p></div></div>
        <div class="team-summary-strip"><div><span>团队最佳得分</span><b>{{ state.team.score.toFixed(2) }}</b></div><div><span>团队总提交</span><b>{{ state.team.submit }} 次</b></div><div><span>成员人数</span><b>{{ state.team.members.length }} 人</b></div><div><span>指导教师</span><b>{{ state.team.teachers.length }} 人</b></div></div>
        <div class="grid g2">
          <section class="mini-panel"><h3 class="section">队员列表</h3><div v-for="member in state.team.members" :key="member[0]" class="row"><span><b>{{ member[0] }}</b><br><span class="muted">{{ member[2] }}</span></span><span class="tag blue">{{ member[1] }}</span></div></section>
          <section class="mini-panel"><h3 class="section">指导教师列表</h3><div v-for="teacher in state.team.teachers" :key="teacher[0]" class="row"><span><b>{{ teacher[0] }}</b><br><span class="muted">{{ teacher[1] }}</span></span></div></section>
        </div>
      </PanelBlock>
    </div>
  </div>
</template>
