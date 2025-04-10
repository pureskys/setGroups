<template>
  <div class="stu-list">
    <header class="stu-head">
      <h2>学生名单</h2>
    </header>
    <div class="list">
      <el-scrollbar class="list-scrollbar">
        <VueDraggable animation="150"
                      ghostClass="ghost"
                      class="drag"
                      group="stu"
                      @update="onUpdate"
                      @add="onAdd"
                      @remove="remove"
                      v-model="stu_list ">
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

function onUpdate() {
  console.log('update')
}

function onAdd() {
  console.log('add')
}

function remove() {
  console.log('remove')
}
</script>

<style lang="scss" scoped>
.stu-list {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 5px #d1d1d1;
  padding: 8px 4px;
  height: 95vh;
  margin: 0 10px;
  min-width: 205px;
  border-radius: 8px;

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

    .list-scrollbar {
      width: 100%;
    }

    .drag {
      user-select: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-right: 12px;
      margin-left: 10px;
      height: 100%;

      .stu {
        display: flex;
        box-shadow: 0 0 5px #d1d1d1;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        height: 33px;
      }
    }

    span {
      font-size: 17px;
    }
  }


}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>