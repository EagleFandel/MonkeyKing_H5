<template>
  <section :class="['assistant-panel', `mode-${mode}`, `state-${state}`]">
    <div class="assistant-head">
      <span class="avatar" aria-hidden="true">🤖</span>
      <div>
        <h4>哆哆智能助手</h4>
        <p>{{ contextHint || '用自然语言描述需求，我会自动提取关键信息并回填表单。' }}</p>
      </div>
    </div>

    <textarea
      v-model="innerText"
      :placeholder="placeholder"
      rows="4"
      @input="onInput"
    />

    <button class="extract-btn tap-feedback" type="button" @click="$emit('extract', innerText)">
      智能补全
    </button>

    <div v-if="state === 'loading'" class="result-block loading">正在分析你的描述...</div>

    <div v-else-if="result" class="result-block">
      <p><strong>识别意图：</strong>{{ result.intent }}</p>
      <p><strong>报告草稿：</strong>{{ result.reportDraft }}</p>
      <p v-if="result.followUpQuestion" class="follow-up">{{ result.followUpQuestion }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import type { ChatExtractResponse } from '@/types/dto'
import type { PageState } from '@/types/ui'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    result?: ChatExtractResponse | null
    mode?: 'embedded' | 'floating' | 'sheet'
    state?: PageState
    contextHint?: string
  }>(),
  {
    modelValue: '',
    placeholder: '请描述你的需求，比如预算、时间、地点和目标。',
    result: null,
    mode: 'embedded',
    state: 'default',
    contextHint: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  extract: [text: string]
}>()

const innerText = ref(props.modelValue)

watch(
  () => props.modelValue,
  (value) => {
    innerText.value = value
  },
)

function onInput() {
  emit('update:modelValue', innerText.value)
}
</script>

<style scoped>
.assistant-panel {
  margin-top: 16px;
  background: linear-gradient(180deg, #fff, #f7fbff);
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 12px;
  padding: 14px;
  box-shadow: var(--shadow-surface-1);
}

.mode-floating {
  box-shadow: var(--shadow-surface-2);
}

.assistant-head {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #fff, #dbeafe);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-surface-1);
}

h4 {
  margin: 0;
  font-size: 15px;
}

p {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #dbe3ef;
  padding: 10px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

textarea:focus-visible {
  border-color: var(--brand-blue-600);
  box-shadow: 0 0 0 3px rgb(91 168 255 / 18%);
}

.extract-btn {
  margin-top: 10px;
  width: 100%;
  min-height: 44px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(145deg, var(--brand-blue-600), var(--brand-blue-500));
  color: #fff;
  font-weight: 600;
}

.result-block {
  margin-top: 10px;
  background: #f7fbff;
  border-radius: 10px;
  padding: 10px;
}

.result-block p {
  margin: 4px 0;
  color: var(--text-main);
}

.loading {
  color: var(--brand-blue-700);
}

.follow-up {
  color: #b45309;
}

.state-error {
  border-color: rgb(239 68 68 / 28%);
}

.state-success {
  border-color: rgb(22 163 74 / 26%);
}
</style>

