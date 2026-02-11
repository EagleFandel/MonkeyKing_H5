<template>
  <header class="page-header" :class="[`tone-${tone}`]">
    <div class="title-wrap">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <slot />
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    tone?: 'default' | 'warm' | 'cool'
  }>(),
  {
    subtitle: '',
    tone: 'default',
  },
)
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-12);
  margin-bottom: var(--space-16);
  padding: var(--space-12);
  border-radius: var(--radius-card);
  border: 1px solid rgb(255 255 255 / 75%);
  box-shadow: var(--shadow-surface-1);
  backdrop-filter: blur(4px);
}

.tone-default {
  background: linear-gradient(180deg, rgb(255 255 255 / 92%), rgb(255 255 255 / 72%));
}

.tone-warm {
  background:
    radial-gradient(circle at 8% -60%, rgb(255 146 46 / 28%) 0%, rgb(255 146 46 / 0%) 50%),
    linear-gradient(180deg, rgb(255 255 255 / 96%), rgb(255 248 240 / 86%));
}

.tone-cool {
  background:
    radial-gradient(circle at 92% -60%, rgb(128 192 255 / 28%) 0%, rgb(128 192 255 / 0%) 52%),
    linear-gradient(180deg, rgb(255 255 255 / 96%), rgb(241 247 255 / 88%));
}

.title-wrap h1 {
  margin: 0;
  font-size: 20px;
  line-height: 1.35;
  color: var(--text-main);
}

.title-wrap p {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}
</style>

