<template>
  <svg
    :class="['svg-icon', `tone-${resolvedTone}`, { decorative }]"
    :width="pixelSize"
    :height="pixelSize"
    :viewBox="definition.viewBox ?? '0 0 24 24'"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :role="decorative ? 'presentation' : 'img'"
    :aria-hidden="decorative"
    :aria-label="decorative ? undefined : computedTitle"
  >
    <title v-if="!decorative && computedTitle">{{ computedTitle }}</title>

    <path
      v-for="(fillPath, index) in definition.fills ?? []"
      :key="`fill-${index}`"
      :d="fillPath.d"
      :class="['icon-fill', fillPath.tone === 'accent' ? 'icon-fill-accent' : 'icon-fill-soft']"
    />

    <path
      v-for="(strokePath, index) in definition.strokes"
      :key="`stroke-${index}`"
      :d="strokePath"
      class="icon-stroke"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { iconRegistry } from '@/components/icons/icons'
import type { IconName, IconSize, IconTone } from '@/components/icons/types'

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: IconSize
    tone?: IconTone
    decorative?: boolean
    title?: string
  }>(),
  {
    size: 'md',
    tone: undefined,
    decorative: true,
    title: '',
  },
)

const definition = computed(() => iconRegistry[props.name])

const resolvedTone = computed<IconTone>(() => props.tone ?? definition.value.defaultTone ?? 'blue')

const sizeMap: Record<Exclude<IconSize, number>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

const pixelSize = computed(() =>
  typeof props.size === 'number' ? props.size : sizeMap[props.size],
)

const computedTitle = computed(() => props.title || props.name)
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
}

.icon-stroke {
  stroke: var(--icon-stroke, var(--brand-blue-700));
  stroke-width: var(--icon-stroke-width);
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-fill {
  stroke: none;
}

.icon-fill-soft {
  fill: var(--icon-fill-soft, var(--brand-blue-100));
}

.icon-fill-accent {
  fill: var(--icon-fill-accent, var(--brand-orange-100));
}

.tone-blue {
  --icon-stroke: var(--brand-blue-700);
  --icon-fill-soft: var(--brand-blue-100);
  --icon-fill-accent: var(--brand-blue-500);
}

.tone-orange {
  --icon-stroke: var(--brand-orange-700);
  --icon-fill-soft: var(--brand-orange-100);
  --icon-fill-accent: var(--brand-orange-500);
}

.tone-mixed {
  --icon-stroke: var(--brand-blue-700);
  --icon-fill-soft: var(--brand-blue-100);
  --icon-fill-accent: var(--brand-orange-100);
}

.tone-neutral {
  --icon-stroke: var(--neutral-700);
  --icon-fill-soft: var(--neutral-100);
  --icon-fill-accent: var(--neutral-300);
}

.tone-success {
  --icon-stroke: var(--feedback-success);
  --icon-fill-soft: #eafcf0;
  --icon-fill-accent: #bbf7d0;
}

.tone-warning {
  --icon-stroke: var(--feedback-warning);
  --icon-fill-soft: #fff7e6;
  --icon-fill-accent: #fde68a;
}

.tone-error {
  --icon-stroke: var(--feedback-error);
  --icon-fill-soft: #fff1f1;
  --icon-fill-accent: #fecaca;
}
</style>

