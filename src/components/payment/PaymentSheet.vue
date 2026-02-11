<template>
  <section class="payment-sheet" :class="[`tone-${statusTone}`]">
    <h3>支付确认</h3>
    <p>
      订单金额：<strong>¥{{ amount }}</strong>
    </p>

    <div v-if="intent" class="intent-pill">场景：{{ intentLabel[intent] }}</div>

    <div class="channel-list" role="radiogroup" aria-label="支付渠道">
      <label :class="['channel', { active: channel === 'wechat' }]">
        <input v-model="channel" type="radio" value="wechat" />
        微信支付
      </label>
      <label :class="['channel', { active: channel === 'alipay' }]">
        <input v-model="channel" type="radio" value="alipay" />
        支付宝
      </label>
    </div>

    <div class="actions">
      <button type="button" class="secondary tap-feedback" @click="$emit('cancel')">取消</button>
      <button type="button" class="primary tap-feedback" @click="$emit('confirm', channel)">
        立即支付
      </button>
    </div>

    <div v-if="successAnimation !== 'none'" :class="['anim-hint', `anim-${successAnimation}`]">
      支付成功后将自动通知对方并进入下一步
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    amount: number
    intent?: 'project' | 'tutor' | 'sparring' | 'job'
    statusTone?: 'neutral' | 'warning' | 'success' | 'error'
    successAnimation?: 'pulse' | 'burst' | 'none'
  }>(),
  {
    intent: 'project',
    statusTone: 'neutral',
    successAnimation: 'pulse',
  },
)

void props

const channel = ref<'wechat' | 'alipay'>('wechat')

defineEmits<{
  confirm: [channel: 'wechat' | 'alipay']
  cancel: []
}>()

const intentLabel: Record<'project' | 'tutor' | 'sparring' | 'job', string> = {
  project: '项目合作',
  tutor: '家教联系',
  sparring: '陪练预约',
  job: '兼职申请',
}
</script>

<style scoped>
.payment-sheet {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: var(--shadow-surface-2);
  border: 1px solid rgb(255 255 255 / 80%);
}

h3 {
  margin: 0 0 8px;
  color: var(--text-main);
}

p {
  margin: 0 0 10px;
  color: var(--text-secondary);
}

strong {
  color: var(--brand-orange-700);
}

.intent-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  margin-bottom: 10px;
  background: var(--brand-blue-100);
  color: var(--brand-blue-700);
}

.channel-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.channel {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  transition:
    border-color var(--motion-fast) var(--curve-standard),
    box-shadow var(--motion-fast) var(--curve-standard);
}

.channel.active {
  border-color: var(--brand-blue-600);
  box-shadow: 0 0 0 3px rgb(91 168 255 / 14%);
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  flex: 1;
  min-height: 44px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}

.primary {
  background: linear-gradient(145deg, var(--brand-orange-600), var(--brand-orange-500));
  color: #fff;
}

.secondary {
  background: #edf5ff;
  color: var(--brand-blue-700);
}

.anim-hint {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}

.anim-pulse {
  animation: subtle-pulse 1.2s var(--curve-standard) infinite;
}

.anim-burst {
  animation: success-burst 680ms var(--curve-emphasized);
}

.tone-warning {
  border-color: rgb(245 158 11 / 25%);
}

.tone-success {
  border-color: rgb(22 163 74 / 24%);
}

.tone-error {
  border-color: rgb(239 68 68 / 24%);
}

@keyframes subtle-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.72;
  }
}
</style>

