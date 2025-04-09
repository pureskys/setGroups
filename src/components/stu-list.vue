<template>
  <div class="stu-list">
    <header class="stu-head">
      <h2>学生名单</h2>
    </header>
    <div class="list">
      <el-scrollbar>
        <VueDraggable class="drag" v-model="stu_list">
          <div class="stu" v-for="item in stu_list"
               :key="item.id">
            <span>{{ item.name }}</span>
          </div>
        </VueDraggable>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import {VueDraggable} from "vue-draggable-plus";
import {useStuList} from "./../store/stuList.js";
import {storeToRefs} from "pinia";

const {stu_list} = storeToRefs(useStuList());
console.log(stu_list);
</script>

<style lang="scss" scoped>
.stu-list {
  display: flex;
  flex-direction: column;
  background-color: #f6f6f6;
  box-shadow: 0 0 10px #888888;
  padding: 8px 4px;
  height: 95vh;
  margin: 0 10px;
  min-width: 140px;
  border-radius: 8px;
  container-type: inline-size;

  .stu-head {
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    color: #373737;
  }

  .list {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 45.2px);

    .drag {
      user-select: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      .stu {
        display: flex;
        margin: 4px;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        box-shadow: 0 0 3px #888888;
        background-color: #f6f6f6;
        width: 80px;
        height: 33px;
        @container (max-width: 185px) {
          width: 100%;
        }
      }
    }

    span {
      font-size: 17px;
    }
  }


}
</style>