<template>
  <section>
    <PageHeader title="实名认证" subtitle="使用核心功能前需完成实名校验" tone="default" />

    <article class="section-card">
      <label class="field-wrap">
        <span>用户角色</span>
        <select v-model="role">
          <option value="entrepreneur">创业者</option>
          <option value="parent">家长</option>
          <option value="student">大学生</option>
          <option value="coach">陪练</option>
        </select>
      </label>
      <SimpleField v-model="realName" label="真实姓名" placeholder="请输入真实姓名" />
      <SimpleField v-model="idNumber" label="身份证号" placeholder="请输入身份证号" />
      <SimpleField
        v-model="selfieToken"
        label="人脸识别令牌（Mock）"
        placeholder="例如：selfie-pass-token"
      />

      <div class="page-actions">
        <button class="btn-primary tap-feedback" type="button" :disabled="submitting" @click="submit">提交认证</button>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { useRoute, useRouter } from 'vue-router'

import PageHeader from '@/components/common/PageHeader.vue'
import SimpleField from '@/components/forms/SimpleField.vue'
import { canSubmitVerification } from '@/modules/auth/verification'
import { platformApi } from '@/services/adapters/platformApi'
import { useAuthStore } from '@/stores/auth.store'
import type { UserRole } from '@/types/domain'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const role = ref<UserRole>('student')
const realName = ref('')
const idNumber = ref('')
const selfieToken = ref('')
const submitting = ref(false)

async function submit() {
  if (submitting.value) {
    return
  }

  const payload = {
    role: role.value,
    realName: realName.value,
    idNumber: idNumber.value,
    selfieToken: selfieToken.value,
  }

  if (!canSubmitVerification(payload)) {
    showFailToast('请先完善认证信息')
    return
  }

  submitting.value = true
  try {
    const result = await platformApi.verify(payload)
    if (!result.verified) {
      showFailToast(result.reason ?? '认证失败')
      return
    }

    authStore.setRole(role.value)
    authStore.setVerified(realName.value)
    showSuccessToast('实名认证成功')
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      void router.push(redirect)
      return
    }

    void router.push('/profile')
  } catch (error) {
    showFailToast((error as Error).message)
  } finally {
    submitting.value = false
  }
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
.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.72;
  box-shadow: none;
}
</style>
