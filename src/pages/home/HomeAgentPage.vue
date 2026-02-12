<template>
  <section class="home-agent-page" data-testid="home-agent-page">
    <div class="bg-orb bg-orb-left" aria-hidden="true"></div>
    <div class="bg-orb bg-orb-right" aria-hidden="true"></div>

    <header class="agent-topbar">
      <button class="brand-btn tap-feedback" type="button" @click="goTo('/')">
        <SvgIcon name="brand-monkey" size="lg" tone="mixed" />
        <span>悟空哆哆</span>
      </button>
      <div class="topbar-actions">
        <button class="icon-btn tap-feedback" type="button" aria-label="快捷入口" @click="goTo('/find-project')">
          <SvgIcon name="match" size="lg" tone="mixed" />
        </button>
        <button class="icon-btn tap-feedback" type="button" aria-label="消息中心" @click="goTo('/messages')">
          <SvgIcon name="bell" size="lg" tone="blue" />
        </button>
      </div>
    </header>

    <main class="agent-content">
      <article class="welcome-card">
        <span class="assistant-avatar" aria-hidden="true">
          <SvgIcon name="assistant" size="xl" tone="mixed" />
        </span>
        <div class="welcome-copy">
          <p class="hello">Hi ~</p>
          <h1>我是您的专属 AI 助手，已为你准备以下服务</h1>
          <button class="mini-link tap-feedback" type="button" @click="goTo('/profile')">模型说明</button>
        </div>
      </article>

      <section class="service-row service-primary">
        <button
          v-for="item in primaryServices"
          :key="item.title"
          class="service-button tap-feedback"
          type="button"
          @click="goTo(item.path)"
        >
          <span class="service-icon primary">
            <SvgIcon :name="item.icon" size="lg" tone="mixed" />
          </span>
          <strong>{{ item.title }}</strong>
        </button>
      </section>

      <section class="service-row service-secondary">
        <button
          v-for="item in secondaryServices"
          :key="item.title"
          class="service-button tap-feedback"
          type="button"
          @click="goTo(item.path)"
        >
          <span class="service-icon secondary">
            <SvgIcon :name="item.icon" size="md" tone="blue" />
          </span>
          <small>{{ item.title }}</small>
        </button>
      </section>

      <section class="promo-grid">
        <button class="promo-card promo-green tap-feedback" type="button" @click="goTo('/find-project')">
          <h2>项目急速匹配</h2>
          <p>需求拆解、候选推荐、支付托管一站完成</p>
        </button>
        <button class="promo-card promo-blue tap-feedback" type="button" @click="goTo('/discover-jobs')">
          <h2>兼职公开课</h2>
          <p>优化画像，拿到更准确的岗位推荐</p>
        </button>
      </section>

      <button class="topic-banner tap-feedback" type="button" @click="goTo('/find-tutor')">
        <strong>本周专题</strong>
        <span>高效陪练与家教组合服务</span>
      </button>

      <section class="assistant-zone" data-testid="home-agent-assistant">
        <div class="assistant-title">
          <h3>智能体交互中心</h3>
          <p>当前识别场景：{{ sceneLabelMap[resolvedScene] }}</p>
        </div>

        <DodoAssistantPanel
          v-model="assistantText"
          :result="extractResult"
          mode="embedded"
          :state="assistantState"
          context-hint="支持项目、家教、陪练、兼职四类意图自动识别"
          placeholder="例如：我想找一位周末上门数学家教，预算每小时 120 元"
          @extract="extractByAgent"
        />
      </section>

      <section class="suggestion-zone">
        <h3>你可能要咨询</h3>
        <button
          v-for="item in suggestions"
          :key="item"
          class="suggest-chip tap-feedback"
          type="button"
          data-testid="home-agent-suggestion"
          @click="applySuggestion(item)"
        >
          # {{ item }}
        </button>
      </section>
    </main>

    <nav class="agent-bottom-nav" data-testid="home-agent-nav">
      <button
        v-for="item in bottomNavItems"
        :key="item.path"
        :class="['bottom-item', { active: isActive(item.path), center: item.path === '/home' }]"
        type="button"
        @click="goTo(item.path)"
      >
        <span class="nav-icon-wrap">
          <SvgIcon :name="item.icon" size="md" tone="mixed" />
        </span>
        <small>{{ item.title }}</small>
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast } from 'vant'
import { useRoute, useRouter } from 'vue-router'

import DodoAssistantPanel from '@/components/chat/DodoAssistantPanel.vue'
import SvgIcon from '@/components/icons/SvgIcon.vue'
import type { IconName } from '@/components/icons/types'
import { resolveSceneFromText } from '@/modules/chat-agent/sceneResolver'
import { platformApi } from '@/services/adapters/platformApi'
import type { SceneType } from '@/types/domain'
import type { ChatExtractResponse } from '@/types/dto'
import type { PageState } from '@/types/ui'

type ServiceItem = {
  title: string
  path: string
  icon: IconName
}

const router = useRouter()
const route = useRoute()

const assistantText = ref('')
const extractResult = ref<ChatExtractResponse | null>(null)
const assistantState = ref<PageState>('default')
const resolvedScene = ref<SceneType>('project')

const sceneLabelMap: Record<SceneType, string> = {
  project: '项目匹配',
  tutor: '家教匹配',
  sparring: '陪练匹配',
  job: '兼职推荐',
}

const primaryServices: ServiceItem[] = [
  { title: '项目问答', path: '/find-project', icon: 'project' },
  { title: '看报告', path: '/find-project', icon: 'match' },
  { title: '找陪练', path: '/find-sparring', icon: 'sparring' },
  { title: '找兼职', path: '/discover-jobs', icon: 'discover' },
]

const secondaryServices: ServiceItem[] = [
  { title: '去认证', path: '/auth', icon: 'shield' },
  { title: '消息中心', path: '/messages', icon: 'bell' },
  { title: '找项目', path: '/find-project', icon: 'project' },
  { title: '找家教', path: '/find-tutor', icon: 'tutor' },
  { title: '我的', path: '/profile', icon: 'profile' },
]

const suggestions = [
  '怎样快速发布项目需求？',
  '家教预算一般怎么定？',
  '我适合做什么兼职？',
  '陪练课程如何安排更高效？',
]

const bottomNavItems: ServiceItem[] = [
  { title: '首页', path: '/', icon: 'home' },
  { title: '兼职', path: '/discover-jobs', icon: 'discover' },
  { title: 'AI小云', path: '/home', icon: 'assistant' },
  { title: '项目', path: '/find-project', icon: 'project' },
  { title: '我的', path: '/profile', icon: 'profile' },
]

function goTo(path: string): void {
  void router.push(path)
}

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function applySuggestion(text: string): void {
  assistantText.value = text
  void extractByAgent(text)
}

async function extractByAgent(text: string): Promise<void> {
  const input = text.trim()
  if (!input) {
    showFailToast('请先输入需求描述')
    return
  }

  assistantState.value = 'loading'
  resolvedScene.value = resolveSceneFromText(input)

  try {
    extractResult.value = await platformApi.chatExtract({
      scene: resolvedScene.value,
      text: input,
    })
    assistantState.value = 'success'
  } catch (error) {
    assistantState.value = 'error'
    showFailToast((error as Error).message)
  }
}
</script>

<style scoped>
.home-agent-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #eff4f7 0%, #ebf1f5 65%, #e7edf1 100%);
  color: #203038;
  padding: 12px 14px calc(112px + env(safe-area-inset-bottom));
}

.bg-orb {
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(12px);
}

.bg-orb-left {
  width: 220px;
  height: 220px;
  background: rgb(153 235 210 / 36%);
  top: -120px;
  left: -88px;
}

.bg-orb-right {
  width: 240px;
  height: 240px;
  background: rgb(165 225 255 / 34%);
  top: -110px;
  right: -100px;
}

.agent-topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 2px 10px;
}

.brand-btn {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #1f2f37;
}

.topbar-actions {
  display: inline-flex;
  gap: 10px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 50%;
  background: rgb(255 255 255 / 70%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgb(25 36 45 / 7%);
}

.agent-content {
  max-width: 480px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

.welcome-card {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  align-items: center;
}

.assistant-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 25%, #fff, #d8f0ea 55%, #bae4d9);
  border: 1px solid rgb(255 255 255 / 84%);
  box-shadow: 0 12px 22px rgb(20 34 44 / 12%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.welcome-copy h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.22;
  letter-spacing: 0.2px;
  color: #2e6a66;
}

.hello {
  margin: 0 0 4px;
  font-size: 22px;
  color: #2f7b71;
  font-weight: 700;
}

.mini-link {
  margin-top: 8px;
  border: 0;
  background: transparent;
  color: #3f5f6e;
  font-size: 13px;
  font-weight: 600;
  padding: 0;
}

.service-row {
  display: grid;
}

.service-primary {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.service-secondary {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.service-button {
  border: 0;
  background: transparent;
  display: grid;
  justify-items: center;
  gap: 6px;
  color: #29363d;
}

.service-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 80%);
}

.service-icon.primary {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  background: linear-gradient(145deg, #f8fdff, #eaf6ff);
  box-shadow: 0 8px 18px rgb(20 36 45 / 8%);
}

.service-icon.secondary {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(145deg, #f5fbff, #e7f6ff);
  box-shadow: 0 6px 14px rgb(20 36 45 / 6%);
}

.service-button strong {
  font-size: 14px;
}

.service-button small {
  font-size: 12px;
  color: #41555f;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.promo-card {
  min-height: 112px;
  border: 1px solid rgb(255 255 255 / 78%);
  border-radius: 16px;
  text-align: left;
  padding: 14px;
  color: #2f4351;
  box-shadow: 0 10px 20px rgb(22 34 43 / 8%);
}

.promo-card h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
}

.promo-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.35;
}

.promo-green {
  background:
    linear-gradient(0deg, rgb(124 234 180 / 13%) 0%, rgb(124 234 180 / 13%) 100%),
    linear-gradient(135deg, #e8fff2, #d9f9e9);
}

.promo-blue {
  background:
    linear-gradient(0deg, rgb(133 198 255 / 15%) 0%, rgb(133 198 255 / 15%) 100%),
    linear-gradient(135deg, #ebf5ff, #dceeff);
}

.topic-banner {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 16px;
  text-align: left;
  background: linear-gradient(128deg, #ece9ff, #e4e8ff);
  color: #3358a2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
}

.topic-banner strong {
  font-size: 24px;
}

.topic-banner span {
  font-size: 15px;
  color: #4f6ea8;
}

.assistant-zone {
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: 18px;
  padding: 14px;
  background: linear-gradient(160deg, rgb(255 255 255 / 82%), rgb(247 252 255 / 88%));
  box-shadow: 0 14px 28px rgb(21 34 43 / 8%);
}

.assistant-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}

.assistant-title h3,
.suggestion-zone h3 {
  margin: 0;
  color: #209572;
  font-size: 18px;
}

.assistant-title p {
  margin: 0;
  color: #5d6c73;
  font-size: 12px;
}

.suggestion-zone {
  display: grid;
  gap: 10px;
}

.suggest-chip {
  border: 1px solid rgb(255 255 255 / 78%);
  border-radius: 999px;
  min-height: 46px;
  padding: 0 16px;
  text-align: left;
  background: linear-gradient(120deg, #f8fffb, #f1fbf5);
  color: #3e515b;
  font-size: 19px;
}

.agent-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  height: calc(90px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid rgb(255 255 255 / 70%);
  background: rgb(255 255 255 / 90%);
  backdrop-filter: blur(10px);
}

.bottom-item {
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #617279;
}

.bottom-item.active {
  color: #20a57b;
}

.bottom-item.center {
  transform: translateY(-10px);
}

.bottom-item.center .nav-icon-wrap {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f8fffb, #e8faf2);
  border: 3px solid #fff;
  box-shadow: 0 10px 22px rgb(17 36 45 / 14%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.bottom-item small {
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 420px) {
  .welcome-copy h1 {
    font-size: 22px;
  }

  .promo-card h2,
  .topic-banner strong {
    font-size: 20px;
  }

  .suggest-chip {
    font-size: 17px;
  }
}
</style>
