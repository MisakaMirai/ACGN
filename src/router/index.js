import { createRouter, createWebHashHistory } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { scrollMainTo } from '@/composables/useMainScroll'
import { useContentPagesStore } from '@/stores/contentPages'
import { useAnnouncementsStore } from '@/stores/announcements'
import { useSitesStore } from '@/stores/sites'

const SUFFIX = ' | ACGN'
const HOME_TITLE = 'ACGN - ACG二次元导航盒子 | 动漫、漫画、游戏、资源导航'

const title = useTitle()

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
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/ContentView.vue'),
    meta: { pageKey: 'terms' },
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

// 统一页面标题：路由元信息 + store 查找，一处覆盖所有页面
router.afterEach((to) => {
  // 1. 静态 meta.title（投稿、公告列表、失效归档、404）
  if (to.meta.title) {
    title.value = to.meta.title + SUFFIX
    return
  }

  // 2. 内容页（关于/隐私/免责/协议汇总）
  if (to.meta.pageKey) {
    const page = useContentPagesStore().findByKey(to.meta.pageKey)
    if (page) {
      title.value = page.title + SUFFIX
      return
    }
  }

  // 3. 公告详情（动态标题取公告名）
  if (to.name === 'AnnouncementDetail' && to.query.id) {
    const ann = useAnnouncementsStore().findById(to.query.id)
    if (ann) {
      title.value = ann.title + SUFFIX
      return
    }
  }

  // 4. 站点详情（动态标题取站名）
  if (to.name === 'SiteDetail' && to.query.id) {
    const result = useSitesStore().findSiteById(to.query.id)
    if (result?.site) {
      title.value = result.site.name + SUFFIX
      return
    }
  }

  // 5. 首页 / 兜底
  title.value = HOME_TITLE
})

export default router
