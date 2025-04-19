<template>
  <div class="group">
    <header class="group-header">
      <h2 style="white-space: nowrap">学生分组</h2>
      <el-button class="group-header-but" :icon="Promotion" type="primary">
        <p>导出All分组</p>
      </el-button>
      <el-button class="group-header-but" :icon="Promotion" type="primary">
        <p>清空分组</p>
      </el-button>
    </header>
    <main class="group-main">
      <div class="group-main-card">
        <el-input
            v-model="group_name"
            placeholder="分组名称"
            clearable
        />
        <el-scrollbar style="width: 100%;">
          <VueDraggable
              v-model="group_list"
              class="group-main-card-drag"
              animation="150"
              ghostClass="ghost"
              :group="{name:'stu',pull:false,put:true}">

            <div class="group-main-card-drag-tip" v-if="group_list.length === 0">拖拽到此进行分组
            </div>

            <div v-for="item in group_list" class="group-main-card-drag-item">
              <el-tag
                  closable
                  @close="handleClose(item)"
              >
                {{ item.姓名 }}
              </el-tag>
            </div>
          </VueDraggable>
        </el-scrollbar>
        <el-button :icon="Promotion" style="margin-top: 3.5px" type="primary">
          <p>创建分组</p>
        </el-button>
      </div>
    </main>
    <el-scrollbar>
      <div class="group-foot">
        <div v-for="i in 100" class="group-foot-item">
          <div>英语背书小组</div>
          <div class="group-foot-item-tag">
            <div v-for="i in 6">
              <el-tag>
                指数大
              </el-tag>
            </div>
          </div>
          <transition>
            <div class="export-btn">
              <span class="export-btn-text">导出分组</span>
            </div>
          </transition>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {Promotion} from "@element-plus/icons-vue";
import {VueDraggable} from "vue-draggable-plus";

const group_name = ref()  // 小组名称
const group_list = ref([])  // 小组数组

const handleClose = (tag) => {
  group_list.value.splice(group_list.value.indexOf(tag), 1)
}
</script>

<style lang="scss" scoped>
.group {
  display: flex;
  flex-direction: column;
  height: 95vh;
  box-shadow: 0 0 5px #d1d1d1;
  border-radius: 8px;
  margin: 10px;
  @media (max-width: 600px) {
    height: 100%;
    width: 100vw;
  }

  .group-header {
    padding: 6px;
    display: flex;
    gap: 10px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .group-header-but {
      margin: 0;
    }
  }

  .group-main {
    display: flex;
    margin: 15px 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .group-main-card {
      height: 33vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      width: calc(100% - 15px);
      box-shadow: 0 0 10px #d1d1d1;
      border-radius: 8px;

      .group-main-card-drag {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        border: 1px solid #d1d1d1;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        min-height: 130px;
        width: 100%;

        .group-main-card-drag-tip {
          color: var(--el-text-color-regular);
          font-size: 12px;
          margin-top: 7px;
        }

        .group-main-card-drag-item {
          display: flex;
        }
      }
    }
  }

  .group-foot {
    height: 100%;
    padding: 0 8px;
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(2, 1fr);

    .group-foot-item {
      min-height: 150px;
      user-select: none;
      margin: 4px 0;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 0 10px #d1d1d1;
      .export-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        width: 100%;
        background-color: #58d9e4;
        border-radius: 0 0 5px 5px;
        &:hover .export-btn-text {
          opacity: 1;
        }
        .export-btn-text{
          opacity: 0;
          font-size: 14px;
          color: white;
          transition: all 0.5s ease;
        }
      }

      .group-foot-item-tag {
        flex: 1;
        display: grid;
        padding: 4px;
        grid-template-columns: repeat(3, 1fr);;
        grid-template-rows: repeat(3, 1fr) ;
        gap: 2px;
      }
    }
  }
}

</style>