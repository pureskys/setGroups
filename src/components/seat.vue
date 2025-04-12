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
        <el-button type="primary" :icon="Grid" @click="randomSeat" style="margin-top: 3.5px;margin-left: 5px">
          <p>随机排座</p>
        </el-button>
        <el-button type="primary" :icon="Promotion" style="margin-top: 3.5px">
          <p>导出座位</p>
        </el-button>
        <el-button type="primary" :icon="Checked" style="margin-top: 3.5px">
          <p>保存布局</p>
        </el-button>
        <el-button type="primary" :icon="DeleteFilled" style="margin-top: 3.5px">
          <p>清空数据</p>
        </el-button>
      </div>
    </header>
    <main class="seat-main">
      <div style="max-height: calc(100% - 100px)">
        <el-scrollbar class="seat-main-scrollbar">
          <div class="seat-main-scrollbar-drag">
            <VueDraggable
                class="seat-main-scrollbar-drag-drag"
                v-for="(seat,index) in stu_list_none"
                animation="150"
                group="stu"
                ghostClass="ghost"
                v-model="stu_list_none[index]">
              <div v-for="item in seat" class="seat-main-scrollbar-drag-card">
                <span>{{ item.姓名 }}</span>
              </div>
            </VueDraggable>
          </div>
        </el-scrollbar>
      </div>
      <h2 class="seat-main-podium">讲 台</h2>
    </main>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {Checked, DeleteFilled, Grid, Promotion} from "@element-plus/icons-vue";
import {VueDraggable} from "vue-draggable-plus";
import {useAllData} from './../store/index.js'
import {storeToRefs} from 'pinia'

const row = ref(6)  // 行数
const column = ref(6)  // 列数
const row_column = computed(() => row.value * column.value)  // 座次数量
const stu_list_none = ref()  // 座位占位数组
const {stu_list, is_upload} = storeToRefs(useAllData());  // 响应式解构数据
let is_seat = true

// 监听 row_column 变化，更新 stu_list_none
watch(
    () => row_column.value,
    (newVal, oldValue) => {
      if (newVal > oldValue) {
        const len = newVal - oldValue
        stu_list_none.value.push(...Array(len).fill([]))
      } else if (newVal < oldValue) {
        const len = newVal - oldValue  // 复负数
        const len2 = oldValue - newVal  // 正数
        stu_list_none.value.splice(len, len2)
      } else {
        stu_list_none.value = Array.from({length: newVal}, () => []);
      }
    },
    {immediate: true}
);

// 随机排座方法
const randomSeat = () => {
  const stu_list_length = stu_list.value.length  // 获取学生数量长度
  // 数组随机排序算法
  const setRandomSeat = () => {
    let fillerIndex = 0;

    // 直接修改 mainArray.value（Vue 3 会保持响应式）
    for (let i = 0; i < stu_list_none.value.length; i++) {
      if (Array.isArray(stu_list_none.value[i]) && stu_list_none.value[i].length === 0) {
        if (fillerIndex < stu_list.value.length) {
          stu_list_none.value[i] = [stu_list.value[fillerIndex++]];
        }
      }
    }

    const arr = stu_list_none.value
    const len = arr.length;
    for (let ii = 0; ii < len - 1; ii++) {
      const index = parseInt(Math.random() * (len - ii));
      const temp = arr[index];
      arr[index] = arr[len - ii - 1];
      arr[len - ii - 1] = temp;
    }
    stu_list.value.length = 0
  }
  if (stu_list_length !== 0 && is_seat === true) {
    row.value = Math.ceil(stu_list_length / column.value)
    is_seat = false
  }
  setTimeout(() => {
    setRandomSeat()
  }, 700)
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
    justify-content: center;
    width: 100%;
    height: calc(100% - 45.2px);

    .seat-main-scrollbar {
      width: 100%;

      .seat-main-scrollbar-drag {
        width: 100%;
        height: 100%;
        padding: 15px;
        gap: 5px;
        display: grid;
        grid-template-columns: repeat(v-bind(column), 1fr);

        .seat-main-scrollbar-drag-drag {
          border-radius: 10px;
          box-shadow: 0 0 10px #d1d1d1;
          min-height: 55px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .seat-main-scrollbar-drag-card {
            flex: 1;
            display: flex;
            font-size: 20px;
            user-select: none;
            justify-content: center;
            align-items: center;
            border-radius: 8px;
            box-shadow: 0 0 10px #d1d1d1;

          }
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