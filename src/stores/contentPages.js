import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import contentPagesData from '@/data/contentPages.json'

// 法律文档 key 顺序即协议汇总页的目录顺序
const LEGAL_KEYS = ['about', 'disclaimer', 'privacy']
const TERMS_KEY = 'terms'

export const useContentPagesStore = defineStore('contentPages', () => {
  const pages = ref(contentPagesData.pages || [])

  // 协议汇总页只做目录：标题即入口，正文仍留在各自页面
  const termsPage = computed(() => ({
    key: TERMS_KEY,
    title: '协议汇总',
    sections: LEGAL_KEYS.map((key) => pages.value.find((p) => p.key === key))
      .filter(Boolean)
      .map((doc) => ({
        heading: doc.title,
        headingTo: `/${doc.key}`,
        blocks: [{ type: 'p', nodes: [`最后更新：${doc.updatedAt}`] }],
      })),
  }))

  const findByKey = (key) =>
    key === TERMS_KEY ? termsPage.value : pages.value.find((p) => p.key === key)

  // 页脚法律入口
  const termsLink = computed(() => ({
    value: `/${TERMS_KEY}`,
    to: `/${TERMS_KEY}`,
    label: termsPage.value.title,
  }))

  return { pages, findByKey, termsLink }
})
