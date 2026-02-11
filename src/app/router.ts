import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth.store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/home/HomePage.vue'),
        meta: {
          pageTone: 'warm',
          motionProfile: 'immersive',
        },
      },
      {
        path: 'find-project',
        name: 'find-project',
        component: () => import('@/pages/find-project/FindProjectPage.vue'),
        meta: {
          requiresVerified: true,
          pageTone: 'warm',
          motionProfile: 'immersive',
        },
      },
      {
        path: 'find-tutor',
        name: 'find-tutor',
        component: () => import('@/pages/find-tutor/FindTutorPage.vue'),
        meta: {
          requiresVerified: true,
          pageTone: 'cool',
          motionProfile: 'gentle',
        },
      },
      {
        path: 'find-sparring',
        name: 'find-sparring',
        component: () => import('@/pages/find-sparring/FindSparringPage.vue'),
        meta: {
          requiresVerified: true,
          pageTone: 'cool',
          motionProfile: 'immersive',
        },
      },
      {
        path: 'discover-jobs',
        name: 'discover-jobs',
        component: () => import('@/pages/discover-jobs/DiscoverJobsPage.vue'),
        meta: {
          requiresVerified: true,
          pageTone: 'neutral',
          motionProfile: 'gentle',
        },
      },
      {
        path: 'messages',
        name: 'messages',
        component: () => import('@/pages/messages/MessagesPage.vue'),
        meta: {
          pageTone: 'neutral',
          motionProfile: 'snappy',
        },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/pages/profile/ProfilePage.vue'),
        meta: {
          pageTone: 'neutral',
          motionProfile: 'gentle',
        },
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import('@/pages/auth/AuthPage.vue'),
        meta: {
          pageTone: 'neutral',
          motionProfile: 'snappy',
        },
      },
      {
        path: 'complaints',
        name: 'complaints',
        component: () => import('@/pages/complaints/ComplaintsPage.vue'),
        meta: {
          requiresVerified: true,
          pageTone: 'neutral',
          motionProfile: 'snappy',
        },
      },
      {
        path: 'payment',
        name: 'payment',
        component: () => import('@/pages/payment/PaymentPage.vue'),
        meta: {
          requiresVerified: true,
          pageTone: 'warm',
          motionProfile: 'immersive',
        },
      },
      {
        path: 'candidate/:id',
        name: 'candidate-detail',
        component: () => import('@/pages/common/CandidateDetailPage.vue'),
        meta: {
          pageTone: 'neutral',
          motionProfile: 'gentle',
        },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const requiresVerified = to.matched.some(
    (record) => record.meta.requiresVerified === true,
  )

  if (!requiresVerified) {
    return true
  }

  const authStore = useAuthStore()
  if (authStore.verified) {
    return true
  }

  return {
    path: '/auth',
    query: {
      redirect: to.fullPath,
    },
  }
})
