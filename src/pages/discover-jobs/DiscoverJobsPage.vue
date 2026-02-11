<template>
  <section>
    <PageHeader
      title="大学生发现兼职"
      subtitle="技能填写 → 智能补全 → 人才画像 → 岗位推荐 → 申请沟通"
      tone="default"
    />

    <article class="section-card">
      <SimpleField
        v-model="form.skillsText"
        label="擅长领域"
        placeholder="如：平面设计, 视频剪辑, 编程"
      />
      <SimpleField
        v-model="form.skillLevel"
        label="技能熟练度"
        placeholder="如：中级"
      />
      <SimpleField
        v-model="form.availableTime"
        label="可工作时间"
        placeholder="如：每周 20 小时"
      />
      <SimpleField
        v-model="form.expectedPay"
        label="期望薪资"
        placeholder="如：30 元/小时"
      />
      <SimpleField
        v-model="form.interestsText"
        label="兴趣领域"
        placeholder="如：海报设计, 品牌视觉"
      />
      <label class="textarea-wrap">
        <span>个人介绍</span>
        <textarea v-model="form.intro" rows="3" placeholder="填写过往经验、项目成果与个人优势" />
      </label>

      <div class="page-actions">
        <button class="btn-primary tap-feedback" type="button" @click="generateProfile">
          生成人才画像
        </button>
        <button class="btn-secondary tap-feedback" type="button" @click="searchJobs">智能推荐岗位</button>
      </div>
    </article>

    <DodoAssistantPanel
      v-model="assistantText"
      :result="extractResult"
      :state="assistantState"
      mode="floating"
      placeholder="例如：我擅长PS设计，中级水平，每周可工作20小时，期望30元/小时。"
      @extract="extractByAgent"
    />

    <article v-if="profilePreview" class="section-card profile-card">
      <h3>人才画像预览</h3>
      <p><strong>技能：</strong>{{ profilePreview.skills.map((skill) => `${skill.name}(${skill.level})`).join('、') }}</p>
      <p><strong>时间：</strong>{{ profilePreview.availableTime }}</p>
      <p><strong>薪资：</strong>{{ profilePreview.expectedPay }}</p>
      <p><strong>兴趣：</strong>{{ profilePreview.interests.join('、') }}</p>
      <p><strong>介绍：</strong>{{ profilePreview.intro || '暂无' }}</p>
    </article>

    <StatusState
      v-if="pageState === 'empty'"
      state="empty"
      title="暂无匹配岗位"
      description="建议补充技能案例或调整期望薪资。"
      action-text="再次推荐"
      @action="searchJobs"
    />

    <StatusState
      v-else-if="pageState === 'error'"
      state="error"
      title="推荐失败"
      description="请稍后重试，或先完善画像信息。"
      action-text="重新尝试"
      @action="searchJobs"
    />

    <section v-else-if="candidates.length > 0" class="list-stack">
      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        variant="compact"
        density="compact"
        motion-preset="fade-slide"
        @view="openDetail"
        @action="applyJob"
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
import { useUserStore } from '@/stores/user.store'
import type { ChatExtractResponse } from '@/types/dto'
import type { MatchCandidate, TalentProfile } from '@/types/domain'
import type { PageState } from '@/types/ui'
import { talentProfileSchema } from '@/utils/validators/schemas'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  skillsText: '',
  skillLevel: 'intermediate',
  availableTime: '',
  expectedPay: '',
  interestsText: '',
  intro: '',
})

const assistantText = ref('')
const extractResult = ref<ChatExtractResponse | null>(null)
const profilePreview = ref<TalentProfile | null>(null)
const candidates = ref<MatchCandidate[]>([])
const pageState = ref<PageState>('default')
const assistantState = ref<PageState>('default')

function normalizeList(text: string): string[] {
  return text
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeLevel(levelText: string): 'beginner' | 'intermediate' | 'advanced' {
  const lower = levelText.trim().toLowerCase()
  if (lower.includes('初') || lower.includes('入门') || lower === 'beginner') {
    return 'beginner'
  }
  if (lower.includes('高') || lower.includes('advanced')) {
    return 'advanced'
  }
  if (lower.includes('中') || lower.includes('intermediate')) {
    return 'intermediate'
  }

  return 'intermediate'
}

function buildProfile(): TalentProfile {
  return {
    skills: normalizeList(form.skillsText).map((name) => ({
      name,
      level: normalizeLevel(form.skillLevel),
    })),
    availableTime: form.availableTime,
    expectedPay: form.expectedPay,
    interests: normalizeList(form.interestsText),
    intro: form.intro,
    personalityTags: ['主动', '协作'],
    workStyle: '结果导向',
  }
}

async function extractByAgent(text: string) {
  assistantState.value = 'loading'
  try {
    const result = await platformApi.chatExtract({
      scene: 'job',
      text,
    })
    extractResult.value = result
    if (result.extracted.budget) {
      form.expectedPay = `${result.extracted.budget} 元/小时`
    }
    if (result.extracted.description) {
      form.intro = String(result.extracted.description)
    }
    assistantState.value = 'success'
  } catch (error) {
    assistantState.value = 'error'
    showFailToast((error as Error).message)
  }
}

function generateProfile() {
  const profile = buildProfile()
  const validation = talentProfileSchema.safeParse(profile)
  if (!validation.success) {
    showFailToast('请完善技能画像信息')
    return
  }

  profilePreview.value = profile
  userStore.setTalentProfile(profilePreview.value)
  showSuccessToast('人才画像已生成')
}

async function searchJobs() {
  if (!ensureVerified(router)) {
    return
  }

  try {
    if (!profilePreview.value) {
      generateProfile()
    }

    if (!profilePreview.value) {
      return
    }

    pageState.value = 'loading'
    candidates.value = await platformApi.searchMatches({
      scene: 'job',
      payload: { profile: profilePreview.value },
    })
    if (candidates.value.length === 0) {
      pageState.value = 'empty'
      return
    }

    pageState.value = 'success'
    showSuccessToast(`推荐 ${candidates.value.length} 个兼职机会`)
  } catch (error) {
    pageState.value = 'error'
    showFailToast((error as Error).message)
  }
}

function openDetail(id: string) {
  void router.push(`/candidate/${id}`)
}

async function applyJob(id: string) {
  if (!ensureVerified(router)) {
    return
  }

  try {
    if (!profilePreview.value) {
      generateProfile()
    }

    if (!profilePreview.value) {
      return
    }

    const result = await platformApi.applyJob({
      candidateId: id,
      profile: profilePreview.value,
      note: '希望参与并长期合作',
    })

    if (result.accepted) {
      showSuccessToast('申请已提交，等待反馈')
      return
    }

    showFailToast(result.reason ?? '申请未通过')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}
</script>

<style scoped>
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

.profile-card h3 {
  margin: 0 0 8px;
}

.profile-card p {
  margin: 6px 0;
  color: var(--text-secondary);
}
</style>
