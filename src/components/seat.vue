<template>
  <div class="seat">
    <header class="seat-header">
      <h2 style="white-space: nowrap">座位布局</h2>
      <span class="seat-header-line"></span>
      <span>行:</span>
      <el-input v-model.number="row" type="number" class="seat-header-input"/>
      <span>列:</span>
      <el-input v-model.number="column" type="number" class="seat-header-input"/>
      <div class="seat-header-bnt">
        <Transition>
          <el-button type="primary" :icon="Grid" style="margin-top: 3.5px;margin-left: 5px">
            <p>随机排座</p>
          </el-button>
        </Transition>
        <el-button type="primary" :icon="Promotion" style="margin-top: 3.5px">
          <p>导出座位</p>
        </el-button>
        <el-button type="primary" :icon="DeleteFilled" style="margin-top: 3.5px">
          <p>保存布局</p>
        </el-button>
        <el-button type="primary" :icon="DeleteFilled" style="margin-top: 3.5px">
          <p>清空数据</p>
        </el-button>
      </div>
    </header>
    <main class="seat-main">

      <el-scrollbar class="seat-main-scrollbar">
        <VueDraggable
            ghostClass="ghost"
            class="seat-main-scrollbar-drag"
            group="stu"
            @Start="onStart"
            @End="onEnd"
            v-model="seat_list ">
          <div class="seat-main-scrollbar-drag-card" v-for="item in seat_list"
               :key="item.id">
            <span>{{ item.name }}</span>
          </div>
        </VueDraggable>
      </el-scrollbar>

      <h2 class="seat-main-podium">讲 台</h2>
    </main>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {DeleteFilled, Grid, Promotion} from "@element-plus/icons-vue";
import {VueDraggable} from "vue-draggable-plus";
import {useSeatList} from "./../store/seatList.js";
import {storeToRefs} from "pinia";

const row = ref(5)
const column = ref(5)
const {seat_list} = storeToRefs(useSeatList())
let seat_list_temp = []

// 拖拽事件处理
const onStart = () => {
  seat_list_temp = []
  seat_list_temp = (seat_list.value)
}
const onEnd = (event) => {
  const {oldIndex, newIndex} = event;
  [seat_list_temp[oldIndex], seat_list_temp[newIndex]] = [seat_list_temp[newIndex], seat_list_temp[oldIndex]]
  seat_list.value = seat_list_temp
}
</script>

<style lang="scss" scoped>
.seat {
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px #d1d1d1;
  border-radius: 8px;
  height: 95vh;
  width: 100%;

  .seat-header {
    padding-left: 16px;
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
      @media (max-width: 1150px) {
        p {
          display: none;
        }
      }
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
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 45.2px);

    .seat-main-scrollbar {
      width: 100%;
      height: 100%;

      .seat-main-scrollbar-drag {
        width: 100%;
        height: 100%;
        padding: 15px;
        gap: 5px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-auto-rows: 3rem;

        .seat-main-scrollbar-drag-card {
          display: flex;
          user-select: none;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          box-shadow: 0 0 10px #d1d1d1;

        }
      }

    }

    .seat-main-podium {
      display: flex;
      height: 5rem;
      border-radius: 10px;
      background-color: #e3e3e3;
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 10px;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>