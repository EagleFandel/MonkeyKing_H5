<template>
  <section>
    <PageHeader title="候选人详情" subtitle="查看完整履历与匹配信息" tone="default" />

    <StatusState
      v-if="pageState === 'loading'"
      state="loading"
      title="加载中"
      description="正在拉取候选人信息..."
    />

    <StatusState
      v-else-if="pageState === 'error'"
      state="error"
      title="加载失败"
      description="候选人信息暂时不可用。"
      action-text="重试"
      @action="loadDetail"
    />

    <article v-else-if="detail" class="section-card">
      <h3>{{ detail.name }}</h3>
      <p><strong>专业/组织：</strong>{{ detail.major }}</p>
      <p><strong>经验：</strong>{{ detail.experience }}</p>
      <p><strong>评分：</strong>{{ detail.rating.toFixed(1) }}</p>
      <p><strong>报价：</strong>{{ detail.price }}</p>
      <p><strong>匹配度：</strong>{{ detail.matchScore }}%</p>
      <div class="tag-list">
        <span v-for="tag in detail.tags" :key="tag">{{ tag }}</span>
      </div>
      <ul>
        <li v-for="highlight in detail.highlights ?? []" :key="highlight">{{ highlight }}</li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showFailToast } from 'vant'
import { useRoute } from 'vue-router'

import PageHeader from '@/components/common/PageHeader.vue'
import StatusState from '@/components/common/StatusState.vue'
import { platformApi } from '@/services/adapters/platformApi'
import type { MatchCandidate } from '@/types/domain'
import type { PageState } from '@/types/ui'

const route = useRoute()
const detail = ref<MatchCandidate | null>(null)
const pageState = ref<PageState>('default')

onMounted(() => {
  void loadDetail()
})

async function loadDetail() {
  pageState.value = 'loading'
  try {
    const id = String(route.params.id)
    detail.value = await platformApi.fetchProfile(id)
    pageState.value = 'success'
  } catch (error) {
    pageState.value = 'error'
    showFailToast((error as Error).message)
  }
}
</script>

<style scoped>
h3 {
  margin: 0 0 10px;
}

p {
  margin: 6px 0;
  color: var(--text-secondary);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-list span {
  background: #eef4ff;
  color: var(--brand-blue-700);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 12px;
}

ul {
  margin: 10px 0 0;
  padding-left: 20px;
  color: var(--text-secondary);
}
</style>

