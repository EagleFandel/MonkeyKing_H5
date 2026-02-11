<template>
  <section class="status-state" :class="[`state-${state}`]" role="status" aria-live="polite">
    <div class="state-icon" :aria-hidden="true">{{ iconMap[state] }}</div>
    <h3>{{ title }}</h3>
    <p v-if="description">{{ description }}</p>
    <button
      v-if="actionText"
      type="button"
      class="btn-secondary tap-feedback"
      @click="$emit('action')"
    >
      {{ actionText }}
    </button>
  </section>
</template>

<script setup lang="ts">
import type { PageState } from '@/types/ui'

defineProps<{
  state: PageState
  title: string
  description?: string
  actionText?: string
}>()

defineEmits<{
  action: []
}>()

const iconMap: Record<PageState, string> = {
  default: '✨',
  loading: '⏳',
  empty: '📭',
  error: '⚠️',
  success: '✅',
}
</script>

<style scoped>
.status-state {
  display: grid;
  gap: var(--space-8);
  place-items: center;
  text-align: center;
  padding: var(--space-20) var(--space-12);
  border-radius: var(--radius-card);
  background: linear-gradient(180deg, #fff, #f8fbff);
  border: 1px solid rgb(255 255 255 / 80%);
  box-shadow: var(--shadow-surface-1);
}

.state-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-pill);
  display: grid;
  place-items: center;
  font-size: 26px;
  background: var(--brand-blue-100);
}

h3 {
  margin: 0;
  font-size: 17px;
}

p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.state-loading .state-icon {
  background: #fff5e6;
}

.state-error .state-icon {
  background: #fff1f1;
}

.state-success .state-icon {
  background: #eafcf0;
}
</style>

