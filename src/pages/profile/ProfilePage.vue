<template>
  <section>
    <PageHeader title="个人中心" subtitle="信息管理 · 记录查询 · 推荐返利" tone="default" />

    <article class="section-card user-card">
      <h3>{{ authStore.realName || '未实名认证用户' }}</h3>
      <p>角色：{{ roleLabelMap[authStore.role] }}</p>
      <p>实名认证：{{ authStore.verified ? '已通过' : '未完成' }}</p>
      <div class="page-actions">
        <button class="btn-secondary tap-feedback" type="button" @click="toAuth">去实名认证</button>
      </div>
    </article>

    <article class="section-card">
      <h3>我的返利</h3>
      <div class="stats-row">
        <StatPill label="累计返利" :value="`¥${ledger?.totalBonus ?? 0}`" />
        <StatPill label="待到账" :value="`¥${ledger?.pendingBonus ?? 0}`" />
        <StatPill label="可提现" :value="`¥${ledger?.withdrawableBonus ?? 0}`" />
      </div>

      <div class="page-actions action-row">
        <button class="btn-secondary tap-feedback" type="button" @click="refreshLedger">刷新返利</button>
        <button class="btn-primary tap-feedback" type="button" @click="withdraw">发起提现</button>
      </div>

      <ul class="ledger-list">
        <li v-for="record in ledger?.records ?? []" :key="record.id">
          <span>{{ record.invitee }} · {{ record.tradeType }}</span>
          <strong>+¥{{ record.bonus }}</strong>
        </li>
      </ul>
    </article>

    <article class="section-card">
      <h3>快捷入口</h3>
      <div class="quick-actions">
        <button class="btn-secondary tap-feedback" type="button" @click="go('/messages')">消息中心</button>
        <button class="btn-secondary tap-feedback" type="button" @click="go('/complaints')">投诉反馈</button>
        <button class="btn-secondary tap-feedback" type="button" @click="go('/payment')">支付记录</button>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

import PageHeader from '@/components/common/PageHeader.vue'
import StatPill from '@/components/common/StatPill.vue'
import { platformApi } from '@/services/adapters/platformApi'
import { useAuthStore } from '@/stores/auth.store'
import type { ReferralLedger, UserRole } from '@/types/domain'

const roleLabelMap: Record<UserRole, string> = {
  entrepreneur: '创业者',
  parent: '家长',
  student: '大学生',
  coach: '陪练',
}

const authStore = useAuthStore()
const router = useRouter()

const ledger = ref<ReferralLedger | null>(null)

onMounted(() => {
  void refreshLedger()
})

async function refreshLedger() {
  try {
    ledger.value = await platformApi.getReferralSummary()
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

async function withdraw() {
  if (!ledger.value || ledger.value.withdrawableBonus <= 0) {
    showFailToast('当前暂无可提现金额')
    return
  }

  try {
    await platformApi.withdrawReferral({
      amount: Math.min(100, ledger.value.withdrawableBonus),
      accountType: 'wechat',
      accountNo: 'wx-demo-account',
    })
    await refreshLedger()
    showSuccessToast('提现申请已提交')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

function go(path: string) {
  void router.push(path)
}

function toAuth() {
  void router.push('/auth')
}
</script>

<style scoped>
.user-card h3 {
  margin: 0;
}

.user-card p {
  margin: 6px 0;
  color: var(--text-secondary);
}

h3 {
  margin: 0 0 10px;
}

.stats-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ledger-list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.ledger-list li {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
}

.ledger-list strong {
  color: var(--brand-orange-700);
}

.quick-actions {
  display: grid;
  gap: 10px;
}
</style>

