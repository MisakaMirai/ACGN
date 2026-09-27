<template>
  <PageContent>
    <BackBar v-if="backTo && backLabel" :to="backTo" :label="backLabel" />
    <Card>
      <h1 class="cp-title">{{ page.title }}</h1>
      <div class="cp-body">
        <section v-for="section in page.sections" :key="section.heading" class="cp-section">
          <h3 class="cp-heading">
            <!-- headingTo 存在时整条标题即入口（协议汇总目录页） -->
            <AppLink v-if="section.headingTo" :to="section.headingTo">
              {{ section.heading }}
            </AppLink>
            <template v-else>{{ section.heading }}</template>
          </h3>
          <!-- 段落 -->
          <template v-for="(blk, idx) in section.blocks" :key="idx">
            <p v-if="blk.type === 'p'" class="cp-paragraph">
              <InlineNodes :nodes="blk.nodes" />
            </p>
            <!-- 列表 -->
            <ul v-else-if="blk.type === 'list'" class="cp-list">
              <li v-for="(item, liIdx) in blk.items" :key="liIdx" class="cp-list-item">
                <InlineNodes :nodes="toNodes(item)" />
              </li>
            </ul>
            <!-- 小标题 -->
            <h6 v-else-if="blk.type === 'h6'" class="cp-subhead">{{ blk.text }}</h6>
          </template>
        </section>
        <p v-if="page.updatedAt" class="cp-updated">最后更新时间：{{ page.updatedAt }}</p>
      </div>
    </Card>
  </PageContent>
</template>

<script setup>
import Card from '@/components/Card.vue'
import PageContent from '@/components/PageContent.vue'
import AppLink from '@/components/AppLink.vue'
import InlineNodes from '@/components/InlineNodes.vue'
import BackBar from '@/components/BackBar.vue'

// 数据驱动的静态内容页：page 结构见 src/data/contentPages.json
// - section.blocks: { type: 'p' | 'list' | 'h6' }
// - nodes/列表项可为字符串、站内 { to }、外链 { href }、加粗 { strong }
// - 外链的 target/rel 已直接写在数据里，运行时不再做归一化
defineProps({
  page: {
    type: Object,
    required: true,
  },
  // 可选：在 PageContent 内部渲染返回按钮（用于子页面返回协议汇总）
  backTo: { type: [String, Object], default: '' },
  backLabel: { type: String, default: '' },
})

const toNodes = (item) => (Array.isArray(item) ? item : [item])
</script>

<style scoped>
/* BlockRenderer 原用 defineComponent 无法继承 scopeId，样式写在全局；
   现改为 template 分支可直接 scoped */
.cp-title {
  margin: 0 0 16px;
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--text-heading);
  line-height: 1.2;
}
.cp-section {
  margin-bottom: 16px;
}
.cp-heading {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-heading);
}
.cp-section > *:first-child {
  margin-top: 0;
}
.cp-paragraph {
  margin: 8px 0;
  white-space: pre-line;
}
.cp-list {
  margin: 8px 0;
  padding-left: 20px;
  color: var(--text);
}
.cp-list-item {
  margin-top: 4px;
}
.cp-subhead {
  margin: 12px 0 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-heading);
}
.cp-updated {
  margin: 0;
  color: var(--text-muted);
}
</style>
