<template>
  <section>
    <PageHeader title="消息中心" subtitle="系统通知 / 互动消息 / 返利通知" tone="default" />

    <div class="page-actions action-row">
      <button class="btn-secondary tap-feedback" type="button" @click="refreshMessages">刷新消息</button>
      <button class="btn-primary tap-feedback" type="button" @click="markAllRead">全部已读</button>
    </div>

    <StatusState
      v-if="list.length === 0"
      state="empty"
      title="暂无消息"
      description="当有订单进度、申请反馈或返利提醒时会显示在这里。"
      action-text="刷新"
      @action="refreshMessages"
    />

    <section v-else class="list-stack">
      <article v-for="message in list" :key="message.id" class="section-card message-card">
        <div class="line-1">
          <strong>{{ message.title }}</strong>
          <span v-if="!message.read" class="dot" aria-label="未读" />
        </div>
        <p>{{ message.content }}</p>
        <small>{{ formatDateTime(message.createdAt) }}</small>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'

import PageHeader from '@/components/common/PageHeader.vue'
import StatusState from '@/components/common/StatusState.vue'
import { platformApi } from '@/services/adapters/platformApi'
import { useMessageStore } from '@/stores/message.store'
import { formatDateTime } from '@/utils/formatters/time'

const messageStore = useMessageStore()

const list = computed(() => messageStore.list)

onMounted(() => {
  void refreshMessages()
})

async function refreshMessages() {
  try {
    const messages = await platformApi.getMessages()
    messageStore.setMessages(messages)
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

async function markAllRead() {
  const unreadIds = list.value.filter((item) => !item.read).map((item) => item.id)
  if (unreadIds.length === 0) {
    showSuccessToast('当前无未读消息')
    return
  }

  try {
    await platformApi.readMessages({ ids: unreadIds })
    messageStore.markRead(unreadIds)
    showSuccessToast('已全部标记为已读')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}
</script>

<style scoped>
.action-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.message-card {
  display: grid;
  gap: 8px;
}

.line-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

small {
  color: #9ca3af;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--danger);
}
</style>

