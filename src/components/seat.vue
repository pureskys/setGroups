<template>
  <div class="seat">
    <!-- 禁用时的遮罩层 -->
    <div v-if="group_switch" class="disabled-overlay">
      <div></div>
      <div class="disabled-overlay-stuList">
        <el-scrollbar>
          <div style="height: 94vh">
            <VueDraggable
                v-model="stu_list_temp "
                :group="{name:'stu_temp', pull:'clone' ,put:false}"
                animation="150"
                class="disabled-overlay-stuList-drag"
                ghostClass="ghost">
              <div v-for="item in stu_list_temp" :key="item.id" class="disabled-overlay-stuList-drag-stuItem">
                <span>{{ item.姓名 }}</span>
              </div>
            </VueDraggable>
          </div>

        </el-scrollbar>
      </div>

    </div>

    <header class="seat-header">
      <h2 style="white-space: nowrap">座位布局</h2>
      <span class="seat-header-line"></span>
      <span>行:</span>
      <el-input v-model.number="row" class="seat-header-input" min="1" type="number"/>
      <span>列:</span>
      <el-input v-model.number="column" class="seat-header-input" min="1" type="number"/>
      <div class="seat-header-bnt">
        <el-button :icon="Grid" style="margin-top: 3.5px;margin-left: 5px" type="primary"
                   @click="randomSeat">
          <p>随机排座</p>
        </el-button>
        <el-button :icon="Promotion" style="margin-top: 3.5px" type="primary" @click="exportSeats">
          <p>导出座位</p>
        </el-button>
        <el-button :icon="DeleteFilled" style="margin-top: 3.5px" type="primary" @click="restStore">
          <p>清空数据</p>
        </el-button>
      </div>
    </header>
    <main class="seat-main">
      <div style="max-height: calc(100% - 100px)">
        <el-scrollbar class="seat-main-scrollbar">
          <div class="seat-main-scrollbar-drag">
            <VueDraggable
                v-for="(seat,index) in seat_list"
                v-model="seat_list[index]"
                animation="150"
                class="seat-main-scrollbar-drag-drag"
                ghostClass="ghost"
                group="stu">
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
import {computed, toRaw, watch} from "vue";
import {DeleteFilled, Grid, Promotion} from "@element-plus/icons-vue";
import {VueDraggable} from "vue-draggable-plus";
import {useAllData} from './../store/index.js'
import {storeToRefs} from 'pinia'
import {exportToWord} from './../utils/export-seats.js'

const allDataStore = useAllData()
const {
  stu_list,
  is_upload,
  seat_list,
  stu_list_length,
  row,
  column,
  group_switch,
  stu_list_temp
} = storeToRefs(allDataStore);  // 响应式解构数据
const row_column = computed(() => row.value * column.value)  // 座次数量

let is_seat = true  // 是否随机排座的标记
// 监听 row_column 变化，更新 seat_list
watch(
    () => row_column.value,
    (newVal, oldValue) => {
      if (newVal > oldValue) {
        const len = newVal - oldValue
        seat_list.value.push(...Array(len).fill([]))
      } else if (newVal < oldValue) {
        const len = newVal - oldValue  // 负数
        const len2 = oldValue - newVal  // 正数
        seat_list.value.splice(len, len2)
      } else {
        if (seat_list.value.length === 0) {
          seat_list.value = Array.from({length: newVal}, () => []);
        }
      }
    },
    {immediate: true}
);

const restStore = () => {
  allDataStore.$reset();
  row.value = 7;
  column.value = 6;
  is_seat = true
  setTimeout(() => {
    seat_list.value = Array.from({length: 42}, () => []);
    console.log('重置所有参数成功', row.value, column.value, seat_list.value.length)
  }, 500)
}
// 导出座位
const exportSeats = () => {
  if (seat_list.value.length > 0 && is_upload.value === false) {
    exportToWord(seat_list.value, row.value, column.value)
  }

}
// 随机排座方法
const randomSeat = () => {
  // 数组随机排序算法
  const setRandomSeat = () => {
    const seat_list_flat = toRaw(seat_list.value.flat())
    stu_list.value.push(...seat_list_flat)

    const arr = stu_list.value.map(item => [item])
    if (arr.length !== row_column.value && stu_list_length.value.length !== 0) {
      const len = row_column.value - arr.length
      arr.push(...Array(len).fill([]))
    }
    const len = arr.length;
    for (let ii = 0; ii < len - 1; ii++) {
      const index = parseInt(Math.random() * (len - ii));
      const temp = arr[index];
      arr[index] = arr[len - ii - 1];
      arr[len - ii - 1] = temp;
    }
    seat_list.value = arr
    stu_list.value.length = 0
  }
  if (stu_list_length.value !== 0 && is_seat === true) {
    row.value = Math.ceil(stu_list_length.value / column.value)
    is_seat = false
  }
  setTimeout(() => {
    setRandomSeat()
  }, 700)
}

</script>

<style lang="scss" scoped>
.disabled-overlay {
  display: grid;
  grid-template-columns: 2fr 1fr;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  backdrop-filter: blur(8px); /* 添加模糊效果 */
  -webkit-backdrop-filter: blur(5px); /* 为了兼容 Safari */
  z-index: 10;
  cursor: not-allowed;

  .disabled-overlay-stuList {
    height: 100%;
    min-width: 300px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 0 5px #d1d1d1;

    .disabled-overlay-stuList-drag {
      padding: 6px;
      display: grid;
      gap: 5px;
      grid-template-columns: repeat(3, 1fr);
    }

    .disabled-overlay-stuList-drag-stuItem {
      display: flex;
      margin: 3px;
      box-shadow: 0 0 5px #d1d1d1;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      height: 33px;
      cursor: pointer;
    }
  }
}

.seat {
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px #d1d1d1;
  border-radius: 8px;
  height: 95vh;
  width: 100%;
  @media (max-width: 600px) {
    width: 100vw;
    height: 100%;
    margin: 10px 0;
  }

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