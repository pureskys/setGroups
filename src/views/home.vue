<template>
  <div class="home">
    <div style="flex: 1">
      <StuList></StuList>
    </div>
    <div style="flex: 5">
      <Seat></Seat>
    </div>
    <div style="flex: 2">
      <Group></Group>
    </div>
  </div>
</template>

<script setup>
import StuList from "./../components/stu-list.vue";
import Group from "./../components/group.vue";
import Seat from "./../components/seat.vue";
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

/* 移动设备样式 */
@media (max-width: 600px) {
  .home {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>
