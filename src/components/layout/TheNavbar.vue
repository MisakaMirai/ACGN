<template>
  <div class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="navbar-logo mobile-only">
        <img class="navbar-logo-img" loading="lazy" :src="logoUrl" height="40" alt="ACGN" />
      </router-link>

      <div class="navbar-left">
        <NavbarMenuToggle />
        <router-link to="/announcements" class="navbar-announcement" rel="announcement">
          公告
        </router-link>
      </div>

      <div class="navbar-right">
        <NavbarHitokoto />
        <NavbarMobile />
      </div>
    </div>
  </div>
</template>

<script setup>
import logoUrl from '@/assets/images/20210727002253-59085.jpeg'
import NavbarMenuToggle from './NavbarMenuToggle.vue'
import NavbarHitokoto from './NavbarHitokoto.vue'
import NavbarMobile from './NavbarMobile.vue'
</script>

<style scoped>
/* 顶部导航栏 */
.navbar {
  background: var(--header-bg);
  position: sticky;
  top: 0;
  z-index: 1080;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s;
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 12px;
  gap: 8px;
}
.navbar-logo {
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.navbar-logo-img {
  max-height: 36px;
  width: auto;
  display: block;
}
.navbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.navbar-announcement {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text);
  text-decoration: none;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: normal;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease-in-out;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.navbar-announcement:hover {
  color: var(--primary);
}

@media (min-width: 768px) {
  .navbar-inner {
    height: 74px;
    padding: 0 16px;
  }
  .navbar-logo {
    display: none !important;
  }
  .navbar-logo-img {
    max-height: 40px;
  }
}
@media (max-width: 767px) {
  .navbar-inner {
    height: 56px;
    padding: 0 12px;
  }
  .navbar-logo.mobile-only {
    display: flex !important;
  }
  .navbar-logo-img {
    max-height: 32px;
  }
}

/* 桌面端 / 移动端可见性（通用规则，子组件根元素继承 scoped ID 可命中） */
@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
  .mobile-only {
    display: none;
  }
}
@media (max-width: 767px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }
}
</style>
