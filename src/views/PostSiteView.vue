<template>
  <PageContent>
    <SectionTitle>投稿 & 反馈</SectionTitle>
    <Card>
      <p class="post-hint">感谢您的投稿！请通过邮件联系站长，或在 GitHub 上提交 Issue。</p>
      <p class="post-hint">
        <strong>联系方式：</strong>
        <AppLink :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</AppLink>
      </p>
      <p class="post-hint">
        <strong>GitHub：</strong>
        <AppLink :href="REPO_URL" target="_blank" rel="noopener noreferrer">ACGN 项目</AppLink>
      </p>
    </Card>
  </PageContent>
</template>

<script setup>
import SectionTitle from '@/components/SectionTitle.vue'
import PageContent from '@/components/PageContent.vue'
import Card from '@/components/Card.vue'
import AppLink from '@/components/AppLink.vue'
import { CONTACT_EMAIL, REPO_URL } from '@/config'
</script>

<style scoped>
.post-hint {
  margin: 0;
  color: var(--text-muted);
}
</style>
