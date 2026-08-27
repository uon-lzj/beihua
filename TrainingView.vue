<script setup>
import HeroPanel from '../components/HeroPanel.vue'
import PanelBlock from '../components/PanelBlock.vue'
import TagPill from '../components/TagPill.vue'
import { training } from '../data/contestData'
import { reserveSession, state, viewReservation } from '../stores/contestStore'
</script>

<template>
  <div class="view-stack training-view">
    <HeroPanel tone="green" :title="training.heroTitle" :text="training.heroText" />

    <h3 class="section section-inline">自学材料 <button class="btn material-more" type="button" @click="state.showMoreMaterials = !state.showMoreMaterials">{{ state.showMoreMaterials ? '收起' : '更多' }}</button></h3>
    <div class="grid g2 material-grid">
      <button v-for="(item, index) in training.materials" :key="item[0]" class="card material" type="button">
        <span class="rank" :class="index % 2 ? 'green' : 'blue'">{{ index + 1 }}</span>
        <span><b class="material-title">{{ item[0] }}</b><span class="muted material-meta">{{ item[1] }}</span></span>
        <TagPill :tone="item[3]">{{ item[2] }}</TagPill>
      </button>
    </div>

    <PanelBlock v-if="state.showMoreMaterials" title="更多自学材料">
      <button v-for="(item, index) in training.moreMaterials" :key="item[0]" class="row row-button material-list-item" type="button">
        <span class="rank blue">{{ index + 5 }}</span>
        <span><b>{{ item[0] }}</b><br><span class="muted">{{ item[1] }}</span></span>
      </button>
    </PanelBlock>

    <h3 class="section section-inline online-title">线上培训</h3>
    <PanelBlock title="">
      <div v-for="(item, index) in training.sessions" :key="item[2]" class="row session-row">
        <span class="course-date"><b>{{ item[0] }}</b><br>{{ item[1] }}</span>
        <span><b>{{ item[2] }}</b><br><span class="muted">{{ item[3] }}</span></span>
        <button
          class="btn green session"
          type="button"
          @click="state.reservedSessions.includes(index) ? viewReservation(index) : reserveSession(index)"
        >
          {{ state.reservedSessions.includes(index) ? '已预约' : '预约' }}
        </button>
      </div>
    </PanelBlock>
  </div>
</template>
