<template>
  <section>
    <PageHeader title="投诉反馈" subtitle="上传证据，平台专人审核处理" tone="default" />

    <article class="section-card">
      <label class="field-wrap">
        <span>投诉场景</span>
        <select v-model="scene">
          <option value="project">项目合作</option>
          <option value="tutor">家教服务</option>
          <option value="sparring">陪练服务</option>
          <option value="job">兼职合作</option>
        </select>
      </label>

      <SimpleField v-model="againstId" label="被投诉对象 ID" placeholder="请输入对方 ID" />
      <SimpleField v-model="reason" label="投诉原因" placeholder="如：沟通失联、服务不达标" />

      <label class="textarea-wrap">
        <span>证据说明</span>
        <textarea v-model="evidence" rows="4" placeholder="请描述证据内容（聊天记录、截图编号等）" />
      </label>

      <div class="page-actions">
        <button class="btn-danger tap-feedback" type="button" @click="submit">提交投诉</button>
      </div>
    </article>

    <StatusState
      v-if="latestId"
      state="success"
      title="投诉已提交"
      :description="`投诉编号：${latestId}，处理进度将通过消息中心同步。`"
      action-text="前往消息中心"
      @action="goMessages"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRouter } from 'vue-router'

import PageHeader from '@/components/common/PageHeader.vue'
import StatusState from '@/components/common/StatusState.vue'
import SimpleField from '@/components/forms/SimpleField.vue'
import { ensureVerified } from '@/modules/auth/guards'
import { platformApi } from '@/services/adapters/platformApi'
import type { SceneType } from '@/types/domain'

const scene = ref<SceneType>('project')
const router = useRouter()
const againstId = ref('')
const reason = ref('')
const evidence = ref('')
const latestId = ref('')

async function submit() {
  if (!ensureVerified(router)) {
    return
  }

  if (!againstId.value || !reason.value || !evidence.value) {
    showFailToast('请先填写完整投诉信息')
    return
  }

  try {
    const result = await platformApi.submitComplaint({
      scene: scene.value,
      againstId: againstId.value,
      reason: reason.value,
      evidence: evidence.value,
    })
    latestId.value = result.id
    showSuccessToast('投诉已提交')
  } catch (error) {
    showFailToast((error as Error).message)
  }
}

function goMessages() {
  void router.push('/messages')
}
</script>

<style scoped>
.field-wrap {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}

.field-wrap span {
  font-size: 13px;
  font-weight: 600;
}

select {
  min-height: 44px;
  border-radius: var(--radius-input);
  border: 1px solid #dde5f1;
  padding: 0 10px;
}

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
</style>

