<template>
  <footer class="main-footer">
    <ScrollTopButton />

    <p class="footer-copyright">
      © {{ year }} ACGN
      <span class="footer-sep" aria-hidden="true">·</span>
      Powered by
      <AppLink
        href="https://github.com/MomokiShiran/ACGN"
        target="_blank"
        rel="noopener noreferrer"
      >
        <strong>ACGN</strong>
      </AppLink>
    </p>

    <nav class="footer-nav" aria-label="法律信息">
      <AppLink :to="pagesStore.termsLink.to" muted>{{ pagesStore.termsLink.label }}</AppLink>
    </nav>

    <p class="footer-note">
      <strong>联系方式：</strong>若有任何问题或合作，请发送邮件至
      <AppLink href="mailto:help@acgn-world.com" muted>help@acgn-world.com</AppLink>
    </p>
    <p class="footer-note">
      <strong>免责声明：</strong>本站仅提供网站链接导航服务，不存储、不制作、不传播任何内容。
      所有链接均指向第三方网站，本站对第三方网站内容不承担任何责任。如有侵权内容，请联系我们删除。
      本站仅供学习交流使用，请勿用于非法用途。
    </p>
  </footer>
</template>

<script setup>
import AppLink from '../AppLink.vue'
import ScrollTopButton from '../ScrollTopButton.vue'
import { useContentPagesStore } from '@/stores/contentPages'

const pagesStore = useContentPagesStore()
const year = new Date().getFullYear()
</script>

<style scoped>
.main-footer {
  /* flex column 容器中 margin-top:auto 保证短内容时页脚贴底 */
  margin: auto 2rem 1rem;
  padding: 1.25rem 1rem;
  background: var(--bg-surface);
  border-radius: 16px;
  text-align: center;
}
.footer-copyright {
  margin: 0 0 8px;
  line-height: 1.5;
}
.footer-sep {
  margin: 0 0.35em;
  color: var(--text-muted);
}
.footer-note {
  max-width: 800px;
  margin: 0 auto;
  font-size: 11px;
  line-height: 1.8;
  color: var(--text-muted);
}
.footer-note + .footer-note {
  margin-top: 4px;
}
</style>
