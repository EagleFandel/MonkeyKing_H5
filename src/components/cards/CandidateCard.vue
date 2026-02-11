<template>
  <article :class="['candidate-card', `variant-${variant}`, `density-${density}`, motionClass]">
    <div class="head-row">
      <h3>{{ candidate.name }}</h3>
      <span class="score">匹配度 {{ candidate.matchScore }}%</span>
    </div>
    <p class="major">{{ candidate.major }}</p>
    <p class="experience">{{ candidate.experience }}</p>
    <div class="tags">
      <span v-for="tag in candidate.tags" :key="tag">{{ tag }}</span>
    </div>
    <div class="foot-row">
      <span class="rating">★ {{ candidate.rating.toFixed(1) }}</span>
      <strong>{{ candidate.price }}</strong>
    </div>
    <div class="actions">
      <button class="secondary tap-feedback" type="button" @click="$emit('view', candidate.id)">
        查看详情
      </button>
      <button class="primary tap-feedback" type="button" @click="$emit('action', candidate.id)">
        立即选择
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { MatchCandidate } from '@/types/domain'
import type { MotionPreset } from '@/types/ui'

const props = withDefaults(
  defineProps<{
    candidate: MatchCandidate
    variant?: 'default' | 'premium' | 'compact'
    density?: 'comfortable' | 'compact'
    motionPreset?: MotionPreset
  }>(),
  {
    variant: 'default',
    density: 'comfortable',
    motionPreset: 'lift',
  },
)

defineEmits<{
  view: [id: string]
  action: [id: string]
}>()

const motionClass = computed(() => `motion-${props.motionPreset}`)
</script>

<style scoped>
.candidate-card {
  background: linear-gradient(180deg, #fff, #fbfdff);
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: var(--radius-card);
  padding: 14px;
  box-shadow: var(--shadow-surface-1);
  transition:
    transform var(--motion-normal) var(--curve-standard),
    box-shadow var(--motion-normal) var(--curve-standard);
}

.motion-lift:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-surface-2);
}

.motion-fade-slide {
  animation: card-fade-slide var(--motion-slow) var(--curve-decelerate);
}

.motion-scale-pop {
  animation: card-pop var(--motion-normal) var(--curve-emphasized);
}

.head-row,
.foot-row,
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-main);
}

.score {
  color: var(--brand-orange-700);
  font-weight: 700;
  font-size: 13px;
}

.major,
.experience {
  margin: 8px 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.tags span {
  background: var(--brand-blue-100);
  color: var(--brand-blue-700);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 12px;
}

.rating {
  color: var(--warning);
}

.actions {
  margin-top: 12px;
}

button {
  min-height: 44px;
  border-radius: var(--radius-button);
  border: none;
  padding: 0 16px;
  font-weight: 600;
}

.primary {
  background: linear-gradient(140deg, var(--brand-orange-600), var(--brand-orange-500));
  color: #fff;
}

.secondary {
  background: #edf5ff;
  color: var(--brand-blue-700);
}

.variant-premium {
  border-color: rgb(255 122 0 / 22%);
  box-shadow: var(--shadow-surface-2);
}

.density-compact {
  padding: 10px;
}

@keyframes card-fade-slide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes card-pop {
  from {
    opacity: 0;
    transform: scale(0.98);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

