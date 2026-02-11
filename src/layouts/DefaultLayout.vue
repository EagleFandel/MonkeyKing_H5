<template>
  <div :class="['layout-shell', `surface-${pageTone}`]">
    <header class="top-nav">
      <button type="button" class="logo-btn tap-feedback" aria-label="返回首页" @click="goHome">
        <SvgIcon name="brand-monkey" size="lg" tone="mixed" :decorative="false" title="悟空哆哆" />
        <span>悟空哆哆</span>
      </button>
      <button type="button" class="msg-btn tap-feedback" aria-label="消息中心" @click="toMessages">
        <SvgIcon name="bell" size="lg" tone="blue" />
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>
    </header>

    <main class="page-container">
      <RouterView v-slot="{ Component, route: innerRoute }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="innerRoute.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <nav class="bottom-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        type="button"
        :class="['nav-item', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        <SvgIcon :name="item.icon" size="md" tone="mixed" />
        <small>{{ item.title }}</small>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import SvgIcon from '@/components/icons/SvgIcon.vue'
import { platformApi } from '@/services/adapters/platformApi'
import { useMessageStore } from '@/stores/message.store'
import type { NavItem } from '@/types/ui'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()

const unreadCount = computed(() => messageStore.unreadCount)

const pageTone = computed(() => {
  const tone = route.meta.pageTone
  return tone === 'warm' || tone === 'cool' || tone === 'neutral' ? tone : 'neutral'
})

const transitionName = computed(() => {
  const profile = route.meta.motionProfile
  if (profile === 'immersive') {
    return 'motion-immersive'
  }
  if (profile === 'snappy') {
    return 'motion-snappy'
  }
  return 'motion-gentle'
})

onMounted(async () => {
  if (messageStore.list.length > 0) {
    return
  }

  try {
    const messages = await platformApi.getMessages()
    messageStore.setMessages(messages)
  } catch (error) {
    console.error('Failed to load messages on layout init', error)
  }
})

const navItems: NavItem[] = [
  { title: '首页', path: '/', icon: 'home' },
  { title: '发现兼职', path: '/discover-jobs', icon: 'discover' },
  { title: '找项目', path: '/find-project', icon: 'project' },
  { title: '找家教', path: '/find-tutor', icon: 'tutor' },
  { title: '我的', path: '/profile', icon: 'profile' },
]

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

function navigate(path: string): void {
  void router.push(path)
}

function toMessages(): void {
  void router.push('/messages')
}

function goHome(): void {
  void router.push('/')
}
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  padding: var(--top-nav-height) 0 calc(var(--bottom-nav-height) + var(--space-8));
  transition: background var(--motion-slow) var(--curve-standard);
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--top-nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-12);
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-surface-1);
  border-bottom: 1px solid rgb(255 255 255 / 60%);
  z-index: 20;
}

.logo-btn,
.msg-btn {
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.logo-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-8);
}

.msg-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.page-container {
  padding: var(--space-12);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: rgb(255 255 255 / 90%);
  backdrop-filter: blur(12px);
  box-shadow: 0 -8px 18px rgb(17 24 39 / 8%);
  border-top: 1px solid rgb(255 255 255 / 60%);
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  z-index: 20;
}

.nav-item {
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-secondary);
  transition:
    color var(--motion-normal) var(--curve-standard),
    transform var(--motion-normal) var(--curve-standard);
}

.nav-item.active {
  color: var(--brand-primary);
  font-weight: 700;
  transform: translateY(-2px);
}

.nav-item small {
  font-size: 11px;
}
</style>

