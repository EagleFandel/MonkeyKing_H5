<template>
  <section>
    <PageHeader title="支付中心" subtitle="支持微信与支付宝（模拟支付状态机）" tone="warm" />

    <article v-if="order" class="section-card">
      <h3>当前订单</h3>
      <p><strong>订单号：</strong>{{ order.id }}</p>
      <p><strong>场景：</strong>{{ sceneLabelMap[order.scene] }}</p>
      <p><strong>金额：</strong>¥{{ order.amount }}</p>
      <p>
        <strong>状态：</strong>
        <span :class="['status', `status-${order.status}`]">{{ order.status }}</span>
      </p>
    </article>

    <StatusState
      v-else
      state="empty"
      title="暂无可支付订单"
      description="请先在业务场景中选择服务并创建订单。"
      action-text="返回首页"
      @action="goHome"
    />

    <PaymentSheet
      v-if="order && order.status === 'pending'"
      :amount="order.amount"
      :intent="order.scene"
      status-tone="warning"
      success-animation="pulse"
      @confirm="confirmPay"
      @cancel="cancelPay"
    />

    <StatusState
      v-if="order && order.status === 'paid'"
      state="success"
      title="支付成功"
      description="合作双方已收到通知，建议立即发起沟通。"
      action-text="前往消息中心"
      @action="goMessages"
    />

    <StatusState
      v-if="order && order.status === 'failed'"
      state="error"
      title="支付未完成"
      description="你可以重新支付或更换支付渠道。"
      action-text="刷新订单状态"
      @action="refreshCurrentOrder"
    />

    <article class="section-card">
      <h3>订单历史</h3>
      <ul class="order-list">
        <li v-for="item in orderStore.history" :key="item.id">
          <span>{{ item.id }} · ¥{{ item.amount }}</span>
          <strong :class="`status-${item.status}`">{{ item.status }}</strong>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

import PageHeader from '@/components/common/PageHeader.vue'
import StatusState from '@/components/common/StatusState.vue'
import PaymentSheet from '@/components/payment/PaymentSheet.vue'
import { transitOrderStatus } from '@/modules/payment/stateMachine'
import { platformApi } from '@/services/adapters/platformApi'
import { useOrderStore } from '@/stores/order.store'
import type { SceneType } from '@/types/domain'

const sceneLabelMap: Record<SceneType, string> = {
  project: '项目合作',
  tutor: '家教服务',
  sparring: '陪练服务',
  job: '兼职申请',
}

const router = useRouter()
const orderStore = useOrderStore()
const order = computed(() => orderStore.current)

async function confirmPay(channel: 'wechat' | 'alipay') {
  if (!order.value) {
    showFailToast('暂无可支付订单')
    return
  }

  if (order.value.status !== 'pending') {
    showFailToast('当前订单状态不可支付')
    return
  }

  try {
    transitOrderStatus(order.value.status, 'paid')
    const paid = await platformApi.payOrder({
      orderId: order.value.id,
      status: 'paid',
    })

    paid.channel = channel
    orderStore.setCurrent(paid)
    showSuccessToast('支付成功，已通知相关方')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

async function cancelPay() {
  if (!order.value) {
    return
  }

  if (order.value.status !== 'pending') {
    showFailToast('当前订单状态不可取消')
    return
  }

  try {
    transitOrderStatus(order.value.status, 'failed')
    const failed = await platformApi.payOrder({
      orderId: order.value.id,
      status: 'failed',
    })
    orderStore.setCurrent(failed)
    showSuccessToast('已取消支付')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

async function refreshCurrentOrder() {
  if (!order.value) {
    return
  }

  try {
    const latest = await platformApi.queryOrderStatus(order.value.id)
    orderStore.setCurrent(latest)
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

function goMessages() {
  void router.push('/messages')
}

function goHome() {
  void router.push('/')
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

.status {
  font-weight: 700;
}

.status-pending {
  color: var(--warning);
}

.status-paid {
  color: var(--success);
}

.status-failed,
.status-refunded {
  color: var(--danger);
}

.order-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.order-list li {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}
</style>

