import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home'
import Main from '@/views/Main'

import Callback from '@/views/Callback'
import ErrorPage from '@/views/Error'
import ApiViewer from '@/views/ApiViewer'

import { routeGuard } from '@/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Main,
    beforeEnter: routeGuard
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  },
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  },
  {
    path: '/api',
    name: 'ApiViewer',
    component: ApiViewer,
    beforeEnter: routeGuard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
