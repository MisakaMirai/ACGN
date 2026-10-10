<template>
  <div class="url-card">
    <div class="url-body">
      <router-link
        :to="{ name: 'SiteDetail', params: { id: site.id } }"
        class="url-card-link"
        :title="site.description"
        rel="noopener noreferrer"
      >
        <div class="url-card-body">
          <div class="url-content">
            <div class="url-img">
              <img class="url-icon" loading="lazy" :src="iconUrl" @error="onImgError" />
            </div>
            <div class="url-info">
              <div class="url-name">
                <Badge v-if="isNewSite(site)" class="url-new" title="新">New</Badge>
                <strong>{{ site.name }}</strong>
              </div>
              <p class="url-desc">{{ site.description }}</p>
            </div>
          </div>
        </div>
      </router-link>
      <a
        :href="site.url"
        class="togo"
        target="_blank"
        :title="'直达 ' + site.name"
        rel="nofollow noopener noreferrer"
      >
        <img class="togo-arrow" :src="arrowRightIcon" alt="" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resolveIcon, handleIconError } from '@/utils/siteIcon'
import { isNewSite } from '@/utils/site'
import arrowRightIcon from '@/assets/icons/arrow-right.svg'
import Badge from './Badge.vue'

const props = defineProps({
  site: {
    type: Object,
    required: true,
  },
})

const iconUrl = computed(() => resolveIcon(props.site.icon))
const onImgError = handleIconError
</script>

<style scoped>
/* 卡片容器 —— 栅格列宽由父级 SiteRow 控制，这里只管卡片本体 */
.url-card {
  margin-bottom: 16px;
}
.url-body {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 16px);
  transform: translateY(0);
  transition: transform 0.3s;
  border-radius: 16px;
}
.url-body:hover {
  transform: translateY(-3px);
}
.url-body:active {
  transform: translateY(-2px);
}

.url-card-link {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  background: var(--card-bg);
  border-radius: 16px;
  color: var(--text);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.url-card-body {
  padding: 0.9375rem;
}
.url-content {
  display: flex;
  align-items: center;
}

.url-img {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  margin-right: 8px;
  background: rgba(128, 128, 128, 0.1);
  border-radius: 50%;
  overflow: hidden;
}
.url-icon {
  max-height: 100%;
  vertical-align: unset;
}

.url-info {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  padding-right: 8px;
}
.url-name {
  display: block;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.url-new {
  margin-right: 4px;
}
.url-desc {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.togo {
  position: absolute;
  top: 20px;
  right: 0;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: var(--text-muted);
  opacity: 0.2;
  transition: opacity 0.3s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.togo:hover {
  color: var(--primary);
}
.url-body:hover .togo {
  opacity: 1;
}
/* 触屏设备无 hover，直达按钮常显 */
@media (hover: none) {
  .togo {
    opacity: 1;
  }
}

/* 内容管理页（失效归档等）内禁用卡片 hover 抬升 */
.site-content .url-body:hover,
.site-content .url-body:active {
  transform: none;
}

.togo-arrow {
  width: 16px;
  height: 16px;
}
</style>
