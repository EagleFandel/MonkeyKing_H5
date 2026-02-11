<template>
  <section>
    <PageHeader
      title="家长找家教"
      subtitle="填写辅导需求 → 智能补全 → 匹配家教 → 付费获取联系方式"
      tone="cool"
    />

    <article class="section-card">
      <SimpleField v-model="form.grade" label="孩子年级" placeholder="如：初二" />
      <SimpleField
        v-model="form.subjectsText"
        label="辅导科目"
        placeholder="如：数学, 英语"
      />
      <SimpleField
        v-model="form.schedule"
        label="辅导时段"
        placeholder="如：每周一三五 18:00-20:00"
      />
      <div class="inline-grid">
        <label class="field-select">
          <span>辅导方式</span>
          <select v-model="form.mode">
            <option value="online">线上</option>
            <option value="offline">线下</option>
          </select>
        </label>
        <SimpleField v-model="form.budget" label="预算（可选）" type="number" />
      </div>
      <SimpleField v-model="form.location" label="辅导地点" placeholder="如：线上 / 徐汇区" />
      <label class="textarea-wrap">
        <span>个性化需求</span>
        <textarea v-model="form.customNeeds" rows="3" placeholder="如：需要注重口语训练和基础讲解" />
      </label>

      <div class="page-actions">
        <button class="btn-primary tap-feedback" type="button" @click="searchTutors">智能匹配家教</button>
      </div>
    </article>

    <DodoAssistantPanel
      v-model="assistantText"
      :result="extractResult"
      :state="assistantState"
      mode="floating"
      placeholder="例如：孩子初二，数学偏弱，每周三次，预算120元/小时，注重基础。"
      @extract="extractByAgent"
    />

    <StatusState
      v-if="pageState === 'empty'"
      state="empty"
      title="暂无可用家教"
      description="建议放宽时间或地点限制后重试。"
      action-text="重新匹配"
      @action="searchTutors"
    />

    <StatusState
      v-else-if="pageState === 'error'"
      state="error"
      title="匹配失败"
      description="服务暂时不可用，请稍后重试。"
      action-text="再次尝试"
      @action="searchTutors"
    />

    <section v-else-if="candidates.length > 0" class="list-stack">
      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        motion-preset="fade-slide"
        @view="openDetail"
        @action="payToGetContact"
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
import { tutorRequirementSchema } from '@/utils/validators/schemas'

const router = useRouter()
const orderStore = useOrderStore()

const form = reactive({
  grade: '',
  subjectsText: '',
  schedule: '',
  mode: 'online' as 'online' | 'offline',
  location: '',
  budget: 120,
  customNeeds: '',
})

const assistantText = ref('')
const extractResult = ref<ChatExtractResponse | null>(null)
const candidates = ref<MatchCandidate[]>([])
const pageState = ref<PageState>('default')
const assistantState = ref<PageState>('default')

function buildPayload() {
  return {
    grade: form.grade,
    subjects: form.subjectsText
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean),
    schedule: form.schedule,
    mode: form.mode,
    location: form.location,
    budget: Number(form.budget),
    customNeeds: form.customNeeds,
  }
}

async function extractByAgent(text: string) {
  assistantState.value = 'loading'
  try {
    const result = await platformApi.chatExtract({
      scene: 'tutor',
      text,
    })
    extractResult.value = result
    if (result.extracted.schedule) {
      form.schedule = String(result.extracted.schedule)
    }
    if (result.extracted.budget) {
      form.budget = Number(result.extracted.budget)
    }
    if (result.extracted.customNeeds) {
      form.customNeeds = String(result.extracted.customNeeds)
    }
    assistantState.value = 'success'
  } catch (error) {
    assistantState.value = 'error'
    showFailToast((error as Error).message)
  }
}

async function searchTutors() {
  if (!ensureVerified(router)) {
    return
  }

  const payload = buildPayload()
  const validation = tutorRequirementSchema.safeParse(payload)
  if (!validation.success) {
    showFailToast('请完善家教需求后再匹配')
    return
  }

  pageState.value = 'loading'
  try {
    candidates.value = await platformApi.searchMatches({
      scene: 'tutor',
      payload,
    })
    if (candidates.value.length === 0) {
      pageState.value = 'empty'
      return
    }

    pageState.value = 'success'
    showSuccessToast(`匹配到 ${candidates.value.length} 位家教`)
  } catch (error) {
    pageState.value = 'error'
    showFailToast((error as Error).message)
  }
}

function openDetail(id: string) {
  void router.push(`/candidate/${id}`)
}

async function payToGetContact(id: string) {
  if (!ensureVerified(router)) {
    return
  }

  try {
    const order = await platformApi.createOrder({
      scene: 'tutor',
      targetId: id,
      amount: 29,
      channel: 'wechat',
    })
    orderStore.setCurrent(order)
    showSuccessToast('已创建联系方式订单，请完成支付')
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

