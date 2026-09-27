import { createRouter, createWebHashHistory } from 'vue-router'
import { scrollMainTo } from '@/composables/useMainScroll'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/ContentView.vue'),
    meta: { pageKey: 'about' },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/ContentView.vue'),
    meta: { pageKey: 'privacy' },
  },
  {
    path: '/disclaimer',
    name: 'Disclaimer',
    component: () => import('@/views/ContentView.vue'),
    meta: { pageKey: 'disclaimer' },
  },
  {
    path: '/postsite',
    name: 'PostSite',
    component: () => import('@/views/PostSiteView.vue'),
    meta: { title: '投稿&反馈' },
  },
  {
    path: '/announcements',
    name: 'Announcements',
    component: () => import('@/views/AnnouncementsListView.vue'),
    meta: { title: '公告' },
  },
  {
    path: '/announcements/:id',
    name: 'AnnouncementDetail',
    component: () => import('@/views/AnnouncementDetailView.vue'),
    meta: { title: '公告详情' },
  },
  {
    path: '/sites/detail',
    name: 'SiteDetail',
    component: () => import('@/views/SiteDetailView.vue'),
  },
  {
    path: '/sitetrash',
    name: 'SiteTrash',
    component: () => import('@/views/SiteTrashView.vue'),
    meta: { title: '失效归档' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面未找到' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    // 右侧内容区是独立滚动容器，窗口不滚动
    // 带 hash 的定位交给被命中的分类区块（自身 scrollIntoView），这里只重置其他情况
    if (!to.hash) scrollMainTo(0, 'auto')
    return false
  },
})

export default router
