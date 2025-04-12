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
import {cloneDeep} from 'lodash'

const row = ref(6)  // 行数
const column = ref(6)  // 列数
const row_column = computed(() => row.value * column.value)  // 座次数量
const stu_list_none = ref()  // 座位占位数组
const {stu_list} = storeToRefs(useAllData());  // 响应式解构数据
let stu_list_temp = []

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
    {immediate: true} // 启动时立即执行一次初始化
);
// 随机排座方法
const randomSeat = () => {
  const stu_list_length = stu_list.value.length  // 获取学生数量长度
  const seat_length = stu_list_none.value.length // 获取虚拟座位的长度
// 数组随机排序算法
  const setRandomSeat = (arr) => {
    const len = arr.length;
    if (stu_list_length >= seat_length) {
      for (let i = 0; i < arr.length; i++) {
        stu_list_none.value[i].push(stu_list.value[i]);
      }
    }
    for (let i = 0; i < len - 1; i++) {
      const index = parseInt(Math.random() * (len - i));
      const temp = arr[index];
      arr[index] = arr[len - i - 1];
      arr[len - i - 1] = temp;
    }
  }
  // 设置座位
  // const setSeat = () => {
  //   if (stu_list.value.length !== 0 && stu_list_length >= seat_length) {
  //     stu_list_temp = cloneDeep(stu_list.value);  // 缓存学生数据
  //   }
  //   console.log('缓存的数据', stu_list_temp);
  //   const random_stu_list = shuffle(stu_list_temp)
  //   const seat = cloneDeep(stu_list_none.value);
  //   for (let i = 0; i < random_stu_list.length; i++) {
  //     seat[i].push(random_stu_list[i]);
  //   }
  //   stu_list_none.value = seat;
  // }

  if (stu_list_length === 0) {
    setRandomSeat(stu_list.value);
  }
  stu_list_none.value.length = 0  // 清空已经排座位的学生
  if (stu_list_length >= seat_length) {
    row.value = Math.ceil(stu_list_length / column.value)
    setTimeout(() => {
      setRandomSeat(stu_list.value)
    }, 500)

  } else if (stu_list_length < seat_length) {

    setTimeout(() => {
      setRandomSeat(stu_list.value)
    }, 500)
  }

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