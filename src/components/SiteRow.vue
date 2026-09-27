<template>
  <div class="site-row"><slot /></div>
</template>

<style scoped>
/* 弹性栅格容器 —— 负责负 margin 出血 + 子项响应式列宽 */
.site-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: calc(-1 * 16px);
  margin-left: calc(-1 * 16px);
}
@media (min-width: 768px) {
  .site-row {
    margin-right: -0.75rem;
    margin-left: -0.75rem;
  }
}
@media (max-width: 767px) {
  .site-row {
    margin-right: 0;
    margin-left: 0;
  }
}

/* 子项栅格列宽：默认移动端 2 列，随断点递增 */
.site-row > * {
  box-sizing: border-box;
  flex: 0 0 50%;
  min-width: 0;
  padding: 0 8px;
}
@media (min-width: 576px) {
  .site-row > * {
    flex: 0 0 33.333333%;
  }
}
@media (min-width: 768px) {
  .site-row > * {
    flex: 0 0 25%;
    padding: 0 16px;
  }
}
@media (min-width: 1200px) {
  .site-row > * {
    flex: 0 0 16.666667%;
  }
}
</style>
