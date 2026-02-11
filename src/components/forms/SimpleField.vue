<template>
  <label class="field-wrap" :class="[`state-${state}`]">
    <span>{{ label }}</span>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :aria-invalid="state === 'error'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="hint" class="hint">{{ hint }}</small>
    <small v-if="errorText" class="error">{{ errorText }}</small>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    modelValue: string | number
    placeholder?: string
    type?: 'text' | 'number' | 'date'
    state?: 'default' | 'error' | 'success'
    hint?: string
    errorText?: string
  }>(),
  {
    placeholder: '',
    type: 'text',
    state: 'default',
    hint: '',
    errorText: '',
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.field-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

span {
  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;
}

input {
  min-height: 44px;
  border-radius: var(--radius-input);
  border: 1px solid #dde5f1;
  padding: 0 12px;
  font-size: 14px;
  color: var(--text-main);
  transition:
    border-color var(--motion-fast) var(--curve-standard),
    box-shadow var(--motion-fast) var(--curve-standard);
}

input:focus-visible {
  border-color: var(--brand-blue-600);
  box-shadow: 0 0 0 3px rgb(91 168 255 / 18%);
}

.state-error input {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 12%);
}

.state-success input {
  border-color: var(--success);
}

.hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.error {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
}
</style>

