<template>
  <div class="stat-pill">
    <span class="label">{{ label }}</span>
    <strong>{{ value }}</strong>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<style scoped>
.stat-pill {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgb(0 0 0 / 6%);
  min-width: 88px;
}

.label {
  color: var(--text-secondary);
  font-size: 12px;
}

strong {
  font-size: 16px;
  color: var(--text-main);
}
</style>

