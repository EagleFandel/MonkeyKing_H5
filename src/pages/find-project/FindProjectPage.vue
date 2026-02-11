<template>
  <section>
    <PageHeader
      title="创业者找开发者"
      subtitle="填写项目需求 → 智能补全 → 报告生成 → 团队匹配 → 支付协作"
      tone="warm"
    />

    <article class="section-card">
      <SimpleField v-model="form.projectType" label="项目类型" placeholder="如：电商小程序" />
      <SimpleField
        v-model="form.techStackText"
        label="技术要求"
        placeholder="如：Vue3, Node.js, AI"
      />
      <div class="inline-grid">
        <SimpleField v-model="form.budgetMin" label="预算下限" type="number" />
        <SimpleField v-model="form.budgetMax" label="预算上限" type="number" />
      </div>
      <div class="inline-grid">
        <SimpleField v-model="form.startDate" label="开始时间" type="date" />
        <SimpleField v-model="form.endDate" label="结束时间" type="date" />
      </div>
      <SimpleField
        v-model="form.personalityText"
        label="团队性格偏好"
        placeholder="如：注重协作、责任心强"
      />
      <label class="textarea-wrap">
        <span>项目描述</span>
        <textarea v-model="form.description" rows="4" placeholder="描述核心目标、里程碑与交付边界" />
      </label>

      <div class="page-actions">
        <button class="btn-primary tap-feedback" type="button" @click="handleGenerateReport">
          生成项目报告
        </button>
        <button class="btn-secondary tap-feedback" type="button" @click="searchCandidates">
          智能匹配开发者
        </button>
      </div>
    </article>

    <DodoAssistantPanel
      v-model="assistantText"
      :result="extractResult"
      :state="assistantState"
      mode="floating"
      placeholder="例如：我想开发一个校园二手交易小程序，预算5000元，2个月完成。"
      @extract="extractByAgent"
    />

    <article v-if="report" class="section-card report-card">
      <h3>项目报告</h3>
      <p>{{ report.reportContent }}</p>
      <a :href="report.downloadUrl" target="_blank" rel="noreferrer">下载 PDF（Mock）</a>
    </article>

    <StatusState
      v-if="pageState === 'empty'"
      state="empty"
      title="暂无匹配结果"
      description="可以试试扩大预算范围或放宽技术标签。"
      action-text="重新匹配"
      @action="searchCandidates"
    />

    <StatusState
      v-else-if="pageState === 'error'"
      state="error"
      title="匹配失败"
      description="网络或服务异常，请稍后重试。"
      action-text="再次尝试"
      @action="searchCandidates"
    />

    <section v-else-if="candidates.length > 0" class="list-stack">
      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        variant="premium"
        motion-preset="fade-slide"
        @view="openDetail"
        @action="selectCandidate"
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
import type { ChatExtractResponse, GenerateReportResponse } from '@/types/dto'
import type { MatchCandidate } from '@/types/domain'
import type { PageState } from '@/types/ui'
import { projectRequirementSchema } from '@/utils/validators/schemas'

const router = useRouter()
const orderStore = useOrderStore()

const form = reactive({
  projectType: '',
  techStackText: '',
  budgetMin: 3000,
  budgetMax: 8000,
  startDate: '',
  endDate: '',
  personalityText: '',
  description: '',
})

const assistantText = ref('')
const extractResult = ref<ChatExtractResponse | null>(null)
const report = ref<GenerateReportResponse | null>(null)
const candidates = ref<MatchCandidate[]>([])
const pageState = ref<PageState>('default')
const assistantState = ref<PageState>('default')

function toPayload() {
  return {
    projectType: form.projectType,
    techStack: form.techStackText
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean),
    budgetMin: Number(form.budgetMin),
    budgetMax: Number(form.budgetMax),
    startDate: form.startDate,
    endDate: form.endDate,
    personalityTraits: form.personalityText
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean),
    description: form.description,
  }
}

async function extractByAgent(text: string) {
  assistantState.value = 'loading'
  try {
    const result = await platformApi.chatExtract({
      scene: 'project',
      text,
    })
    extractResult.value = result
    if (result.extracted.budget) {
      form.budgetMin = Math.max(1000, Number(result.extracted.budget) - 1000)
      form.budgetMax = Number(result.extracted.budget) + 1000
    }
    if (result.extracted.description) {
      form.description = result.extracted.description
    }
    assistantState.value = 'success'
  } catch (error) {
    assistantState.value = 'error'
    showFailToast((error as Error).message)
  }
}

async function handleGenerateReport() {
  if (!ensureVerified(router)) {
    return
  }

  const payload = toPayload()
  const validation = projectRequirementSchema.safeParse(payload)
  if (!validation.success) {
    showFailToast('请先完善项目需求，再生成报告')
    return
  }

  try {
    report.value = await platformApi.generateReport({
      scene: 'project',
      payload,
    })
    showSuccessToast('项目报告已生成')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

async function searchCandidates() {
  if (!ensureVerified(router)) {
    return
  }

  const payload = toPayload()
  const validation = projectRequirementSchema.safeParse(payload)
  if (!validation.success) {
    showFailToast('请先完善项目需求，再进行匹配')
    return
  }

  pageState.value = 'loading'
  try {
    candidates.value = await platformApi.searchMatches({
      scene: 'project',
      payload,
    })
    if (candidates.value.length === 0) {
      pageState.value = 'empty'
      return
    }

    pageState.value = 'success'
    showSuccessToast(`已匹配 ${candidates.value.length} 位开发者`)
  } catch (error) {
    pageState.value = 'error'
    showFailToast((error as Error).message)
  }
}

function openDetail(id: string) {
  void router.push(`/candidate/${id}`)
}

async function selectCandidate(id: string) {
  if (!ensureVerified(router)) {
    return
  }

  const selected = candidates.value.find((item) => item.id === id)
  if (!selected) {
    return
  }

  try {
    const order = await platformApi.createOrder({
      scene: 'project',
      targetId: id,
      amount: 299,
      channel: 'wechat',
    })
    orderStore.setCurrent(order)
    showSuccessToast(`已选择 ${selected.name}，请完成支付`)
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

.textarea-wrap {
  display: grid;
  gap: 6px;
}

.textarea-wrap span {
  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;
}

textarea {
  width: 100%;
  border-radius: var(--radius-input);
  border: 1px solid #dde5f1;
  padding: 10px;
  font-size: 14px;
  resize: vertical;
}

.report-card {
  margin-top: 12px;
}

.report-card h3 {
  margin: 0;
}

.report-card p {
  color: var(--text-secondary);
  margin: 8px 0;
}

.report-card a {
  color: var(--brand-blue-700);
  text-decoration: none;
  font-weight: 600;
}
</style>

