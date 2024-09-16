import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import consts, { ROUTES } from '@/constants/consts'

const publicRoutes = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.CREATE, ROUTES.USER]

const convertRoutes = (route: string) => `/${route}`

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME,
      component: () => import('../pages/HomeView.vue'),
    },
    {
      path: convertRoutes(ROUTES.LOGIN),
      name: ROUTES.LOGIN,
      component: () => import('../pages/LoginView.vue'),
    },
    {
      path: convertRoutes(ROUTES.ABOUT),
      name: ROUTES.ABOUT,
      component: () => import('../pages/AboutView.vue'),
    },
    {
      path: convertRoutes(ROUTES.CREATE),
      name: ROUTES.CREATE,
      props: {
        isCreateUser: true,
      },
      component: () => import('../pages/LoginView.vue'),
    },
    {
      path: convertRoutes(ROUTES.USER),
      name: ROUTES.USER,
      component: () => import('../pages/UserView.vue'),
    },
    {
      path: convertRoutes(ROUTES.CHAT),
      name: ROUTES.CHAT,
      component: () => import('../pages/ChatView.vue'),
    },
  ],
})

router.beforeEach((to, form, next) => {
  const { isAuth } = useAuthStore()
  if (publicRoutes.includes(to.name as string) || isAuth) next()
  else next(convertRoutes(ROUTES.LOGIN))
})

export default router
