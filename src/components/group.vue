<template>
  <div class="group">
    <header class="group-header">
      <h2 style="white-space: nowrap">学生分组</h2>
    </header>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.group {
  height: 95vh;
  box-shadow: 0 0 5px #d1d1d1;
  border-radius: 8px;
  margin: 10px;
  @media (max-width: 600px) {
    height: 100%;
  }

  .group-header {
    padding: 10px;
  }
}
</style>