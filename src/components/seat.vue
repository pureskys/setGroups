<template>
  <div class="seat">
    <header class="seat-header">
      <h2>座位布局</h2>
      <span class="seat-header-line"></span>
      <span>行:</span>
      <el-input v-model.number="row" type="number" class="seat-header-input"/>
      <span>列:</span>
      <el-input v-model.number="column" type="number" class="seat-header-input"/>
      <div class="seat-header-bnt">
        <el-button type="primary" :icon="Grid" style="margin-top: 3.5px;margin-left: 5px">随机排座</el-button>
        <el-button type="primary" :icon="Promotion" style="margin-top: 3.5px">导出座位</el-button>
        <el-button type="primary" :icon="DeleteFilled" style="margin-top: 3.5px">保存布局</el-button>
        <el-button type="primary" :icon="DeleteFilled" style="margin-top: 3.5px">清空数据</el-button>
      </div>


    </header>
    <main class="seat-main"></main>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {DeleteFilled, Grid, Promotion} from "@element-plus/icons-vue";

const row = ref(5)
const column = ref(5)
</script>

<style lang="scss" scoped>
.seat {
  display: flex;
  flex-direction: column;
  height: 95vh;
  width: 100%;
  border: 1px solid red;

  .seat-header {
    user-select: none;
    display: flex;
    align-items: center;
    margin: 6px;
    color: #373737;

    .seat-header-bnt {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
    }

    .seat-header-input {
      width: 55px;
      padding-top: 3.5px;
      margin: 0 5px;
    }

    .seat-header-line {
      background-color: #888888;
      width: 4px;
      height: 20px;
      margin-left: 8px;
      margin-right: 15px;
      border-radius: 99px;
    }

    span {
      font-weight: bold;
    }
  }

  .seat-main {
    width: 100%;
    height: 100%;
    border: 1px solid red;
  }
}
</style>