<template>
  <section>
    <PageHeader
      title="大学生找网球陪练"
      subtitle="需求填写 → 智能补全 → 陪练匹配 → 沟通确认 → 预约支付"
      tone="cool"
    />

    <article class="section-card">
      <SimpleField v-model="form.sportType" label="运动类型" placeholder="默认网球，可改为羽毛球等" />
      <SimpleField
        v-model="form.timeSlots"
        label="可运动时间段"
        placeholder="如：每周六 14:00-16:00"
      />
      <SimpleField v-model="form.location" label="运动地点" placeholder="如：XX大学网球场" />
      <div class="inline-grid">
        <label class="field-select">
          <span>当前水平</span>
          <select v-model="form.currentLevel">
            <option value="beginner">入门</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </label>
        <SimpleField v-model="form.budget" label="预算" type="number" />
      </div>
      <label class="switch-line">
        <input v-model="form.needGuidance" type="checkbox" />
        <span>需要专业指导</span>
      </label>
      <label class="textarea-wrap">
        <span>提升方向</span>
        <textarea v-model="form.improvementGoals" rows="3" placeholder="如：提升发球、截击和实战能力" />
      </label>

      <div class="page-actions">
        <button class="btn-primary tap-feedback" type="button" @click="searchSparrings">智能匹配陪练</button>
      </div>
    </article>

    <DodoAssistantPanel
      v-model="assistantText"
      :result="extractResult"
      :state="assistantState"
      mode="floating"
      placeholder="例如：每周六下午在学校网球场，希望提升发球和截击，预算100元/小时。"
      @extract="extractByAgent"
    />

    <StatusState
      v-if="pageState === 'empty'"
      state="empty"
      title="暂无合适陪练"
      description="可以放宽时间段或调整预算再试一次。"
      action-text="重新匹配"
      @action="searchSparrings"
    />

    <StatusState
      v-else-if="pageState === 'error'"
      state="error"
      title="匹配失败"
      description="请检查网络后重试。"
      action-text="再次尝试"
      @action="searchSparrings"
    />

    <section v-else-if="candidates.length > 0" class="list-stack">
      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        motion-preset="fade-slide"
        @view="openDetail"
        @action="bookSparring"
      />
    </section>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

import CandidateCard from '@/components/cards/CandidateCard.vue'
import DodoAssistantPanel from '@/components/chat/DodoAssistantPanel.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatusState from '@/components/common/StatusState.vue'
import SimpleField from '@/components/forms/SimpleField.vue'
import { ensureVerified } from '@/modules/auth/guards'
import { platformApi } from '@/services/adapters/platformApi'
import { useOrderStore } from '@/stores/order.store'
import type { ChatExtractResponse } from '@/types/dto'
import type { MatchCandidate } from '@/types/domain'
import type { PageState } from '@/types/ui'
import { sparringRequirementSchema } from '@/utils/validators/schemas'

const router = useRouter()
const orderStore = useOrderStore()

const form = reactive({
  sportType: '网球',
  timeSlots: '',
  location: '',
  needGuidance: true,
  currentLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  improvementGoals: '',
  budget: 100,
})

const assistantText = ref('')
const extractResult = ref<ChatExtractResponse | null>(null)
const candidates = ref<MatchCandidate[]>([])
const pageState = ref<PageState>('default')
const assistantState = ref<PageState>('default')

function toPayload() {
  return {
    sportType: form.sportType,
    timeSlots: form.timeSlots,
    location: form.location,
    needGuidance: form.needGuidance,
    currentLevel: form.currentLevel,
    improvementGoals: form.improvementGoals,
    budget: Number(form.budget),
  }
}

async function extractByAgent(text: string) {
  assistantState.value = 'loading'
  try {
    const result = await platformApi.chatExtract({
      scene: 'sparring',
      text,
    })
    extractResult.value = result
    if (result.extracted.schedule) {
      form.timeSlots = String(result.extracted.schedule)
    }
    if (result.extracted.budget) {
      form.budget = Number(result.extracted.budget)
    }
    if (result.extracted.improvementGoals) {
      form.improvementGoals = String(result.extracted.improvementGoals)
    }
    assistantState.value = 'success'
  } catch (error) {
    assistantState.value = 'error'
    showFailToast((error as Error).message)
  }
}

async function searchSparrings() {
  if (!ensureVerified(router)) {
    return
  }

  const payload = toPayload()
  const validation = sparringRequirementSchema.safeParse(payload)
  if (!validation.success) {
    showFailToast('请完善陪练需求后再匹配')
    return
  }

  pageState.value = 'loading'
  try {
    candidates.value = await platformApi.searchMatches({
      scene: 'sparring',
      payload,
    })
    if (candidates.value.length === 0) {
      pageState.value = 'empty'
      return
    }

    pageState.value = 'success'
    showSuccessToast(`匹配到 ${candidates.value.length} 位陪练`)
  } catch (error) {
    pageState.value = 'error'
    showFailToast((error as Error).message)
  }
}

function openDetail(id: string) {
  void router.push(`/candidate/${id}`)
}

async function bookSparring(id: string) {
  if (!ensureVerified(router)) {
    return
  }

  try {
    const order = await platformApi.createOrder({
      scene: 'sparring',
      targetId: id,
      amount: Number(form.budget),
      channel: 'wechat',
    })
    orderStore.setCurrent(order)
    showSuccessToast('预约订单已创建，请完成支付')
    void router.push('/payment')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}
</script>

<style scoped>
.inline-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.field-select {
  display: grid;
  gap: 6px;
}

.field-select span {
  font-size: 13px;
  font-weight: 600;
}

select {
  min-height: 44px;
  border-radius: var(--radius-input);
  border: 1px solid #dde5f1;
  padding: 0 10px;
}

.switch-line {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
}

.textarea-wrap {
  display: grid;
  gap: 6px;
}

.textarea-wrap span {
  font-size: 13px;
  font-weight: 600;
}

textarea {
  width: 100%;
  border-radius: var(--radius-input);
  border: 1px solid #dde5f1;
  padding: 10px;
  resize: vertical;
}
</style>

