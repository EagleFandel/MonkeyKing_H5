<template>
  <section class="home-page">
    <article class="hero-card section-card anim-success-burst">
      <div class="hero-copy">
        <p class="eyebrow">发现大学生 · 连接机会</p>
        <h1>30 秒说清需求，3 分钟拿到候选建议</h1>
        <p class="subtitle">悟空哆哆帮你在创业、家教、陪练、兼职四大场景快速完成匹配。</p>
      </div>
      <div class="hero-actions">
        <button class="btn-primary tap-feedback" type="button" @click="goTo('/find-project')">
          开始匹配
        </button>
        <button class="btn-secondary tap-feedback" type="button" @click="toggleAssistant">
          马上描述需求
        </button>
      </div>
    </article>

    <article class="section-card role-strip">
      <h2>选择你的身份入口</h2>
      <div class="role-grid">
        <button class="role-chip tap-feedback" type="button" @click="goTo('/find-project')">我是创业者</button>
        <button class="role-chip tap-feedback" type="button" @click="goTo('/find-tutor')">我是家长</button>
        <button class="role-chip tap-feedback" type="button" @click="goTo('/find-sparring')">我有陪练需求</button>
        <button class="role-chip tap-feedback" type="button" @click="goTo('/discover-jobs')">我在找兼职</button>
      </div>
    </article>

    <article class="section-card assistant-entry">
      <div>
        <h2>哆哆智能助手</h2>
        <p>一句话描述需求，自动补全预算、时间、技能和偏好。</p>
      </div>
      <button class="btn-secondary tap-feedback" type="button" @click="toggleAssistant">
        {{ assistantExpanded ? '收起助手' : '唤起助手' }}
      </button>
    </article>

    <DodoAssistantPanel
      v-if="assistantExpanded"
      v-model="assistantText"
      :result="extractResult"
      mode="floating"
      :state="assistantState"
      context-hint="支持项目、家教、陪练、兼职四类意图识别"
      placeholder="例如：我想找一位初中数学家教，每周三次，预算120元/小时。"
      @extract="extractByAgent"
    />

    <section class="quick-entry list-stack">
      <button
        v-for="entry in quickEntries"
        :key="entry.path"
        class="entry-card tap-feedback"
        type="button"
        @click="goTo(entry.path)"
      >
        <span class="icon-box" aria-hidden="true">
          <SvgIcon :name="entry.icon" size="lg" tone="mixed" />
        </span>
        <div>
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.subtitle }}</p>
          <small>适合人群：{{ entry.suitableFor }} · 预计耗时：{{ entry.eta }} · 首个动作：{{ entry.firstAction }}</small>
        </div>
      </button>
    </section>

    <section class="section-card advantage-card">
      <h3>平台信任体系</h3>
      <ul>
        <li v-for="item in advantages" :key="item.title">
          <span class="adv-icon"><SvgIcon :name="item.icon" size="lg" tone="mixed" /></span>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="section-card realtime-card">
      <h3>实时数据与案例</h3>
      <div class="stats-grid">
        <div>
          <strong>1.2k+</strong>
          <p>本周匹配成功</p>
        </div>
        <div>
          <strong>93%</strong>
          <p>需求匹配满意度</p>
        </div>
        <div>
          <strong>8min</strong>
          <p>平均首次响应</p>
        </div>
      </div>
      <p class="case-note">最近案例：某创业团队 48 小时内组建 3 人开发小组并完成需求评审。</p>
    </section>

    <footer class="footer-note">
      <router-link to="/profile">客服入口</router-link>
      <span>·</span>
      <router-link to="/profile">隐私政策</router-link>
      <span>·</span>
      <router-link to="/profile">用户协议</router-link>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast } from 'vant'
import { useRouter } from 'vue-router'

import DodoAssistantPanel from '@/components/chat/DodoAssistantPanel.vue'
import SvgIcon from '@/components/icons/SvgIcon.vue'
import { platformApi } from '@/services/adapters/platformApi'
import type { IconName } from '@/components/icons/types'
import type { ChatExtractResponse } from '@/types/dto'
import type { AdvantageItem, PageState } from '@/types/ui'

type ScenarioQuickEntryWithMeta = {
  title: string
  subtitle: string
  path: string
  icon: IconName
  suitableFor: string
  eta: string
  firstAction: string
}

const router = useRouter()

const quickEntries: ScenarioQuickEntryWithMeta[] = [
  {
    title: '创业者找开发者',
    subtitle: '需求提报、团队匹配、支付协作',
    path: '/find-project',
    icon: 'project',
    suitableFor: '创业团队',
    eta: '约 3-5 分钟',
    firstAction: '填写项目需求',
  },
  {
    title: '家长找家教',
    subtitle: '精准匹配家教，付费解锁联系方式',
    path: '/find-tutor',
    icon: 'tutor',
    suitableFor: '有辅导需求家庭',
    eta: '约 2-4 分钟',
    firstAction: '填写孩子学段科目',
  },
  {
    title: '找运动陪练',
    subtitle: '网球陪练与技巧指导一站式完成',
    path: '/find-sparring',
    icon: 'sparring',
    suitableFor: '运动提升用户',
    eta: '约 2-3 分钟',
    firstAction: '提交训练目标',
  },
  {
    title: '大学生找兼职',
    subtitle: '人才画像驱动岗位推荐与成长',
    path: '/discover-jobs',
    icon: 'discover',
    suitableFor: '技能型大学生',
    eta: '约 3-4 分钟',
    firstAction: '生成个人画像',
  },
]

const advantages: AdvantageItem[] = [
  {
    title: '智能精准匹配',
    description: '规则引擎抽取关键信息，推荐过程可解释。',
    icon: 'match',
  },
  {
    title: '实名认证保障',
    description: '核心功能前置认证，降低合作风险。',
    icon: 'shield',
  },
  {
    title: '推荐返利福利',
    description: '邀请好友完成首单，可获得返利收益。',
    icon: 'bonus',
  },
]

const assistantExpanded = ref(false)
const assistantText = ref('')
const extractResult = ref<ChatExtractResponse | null>(null)
const assistantState = ref<PageState>('default')

function goTo(path: string): void {
  void router.push(path)
}

function toggleAssistant(): void {
  assistantExpanded.value = !assistantExpanded.value
}

async function extractByAgent(text: string): Promise<void> {
  assistantState.value = 'loading'
  try {
    extractResult.value = await platformApi.chatExtract({
      scene: 'project',
      text,
    })
    assistantState.value = 'success'
  } catch (error) {
    assistantState.value = 'error'
    showFailToast((error as Error).message)
  }
}
</script>

<style scoped>
.home-page {
  display: grid;
  gap: 12px;
}

.hero-card {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 8% -45%, rgb(255 146 46 / 32%) 0%, rgb(255 146 46 / 0%) 52%),
    radial-gradient(circle at 95% -45%, rgb(128 192 255 / 30%) 0%, rgb(128 192 255 / 0%) 54%),
    linear-gradient(180deg, #fff 0%, #fff9f2 100%);
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  color: var(--brand-orange-700);
  font-weight: 700;
}

h1 {
  margin: 6px 0 0;
  font-size: 24px;
  line-height: 1.3;
}

.subtitle {
  margin: 8px 0 0;
  color: var(--text-secondary);
}

.hero-actions {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.role-strip h2,
.assistant-entry h2 {
  margin: 0;
  font-size: 16px;
}

.role-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.role-chip {
  min-height: 38px;
  border-radius: var(--radius-pill);
  border: 1px solid rgb(91 168 255 / 26%);
  background: #f3f9ff;
  color: var(--brand-blue-700);
  font-size: 12px;
  font-weight: 600;
}

.assistant-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.assistant-entry p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.entry-card {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 75%);
  text-align: left;
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  background: #fff;
  box-shadow: var(--shadow-surface-1);
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(145deg, #f2f8ff, #e6f1ff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-main);
}

.entry-card p {
  margin: 6px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.entry-card small {
  display: block;
  margin-top: 6px;
  color: var(--neutral-500);
  font-size: 11px;
}

.advantage-card h3,
.realtime-card h3 {
  margin: 0 0 10px;
}

.advantage-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.advantage-card li {
  display: flex;
  gap: 10px;
}

.adv-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f3f8ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.advantage-card p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stats-grid strong {
  font-size: 18px;
  color: var(--brand-orange-700);
}

.stats-grid p,
.case-note {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.case-note {
  margin-top: 10px;
}

.footer-note {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  padding: 6px 0 12px;
}

.footer-note a {
  color: var(--text-secondary);
  text-decoration: none;
}

.footer-note span {
  margin: 0 6px;
}
</style>

