<template>
  <div class="group">
    <!-- 禁用时的遮罩层开始 -->
    <div v-if="!group_switch" class="disabled-overlay"></div>
    <!-- 禁用时的遮罩层结束-->
    <header class="group-header">
      <el-switch
        v-model="group_switch"
        :active-action-icon="Select"
        :inactive-action-icon="CloseBold"
        class="switch_bnt"
      />
      <h2 style="white-space: nowrap">学生分组</h2>
      <el-button
        :icon="Promotion"
        class="group-header-but"
        type="primary"
        @click="exportALLGroup"
      >
        <p>导出All分组</p>
      </el-button>
    </header>
    <main class="group-main">
      <div class="group-main-card relative">
        <!--    删除组件的遮罩层开始-->
        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="_isRemoveGroup"
            :class="{
              'border-red-500': enter_remove, // 红色边框
              'shadow-[0_0_10px_rgba(255,50,50,0.8)]': enter_remove, // 边框外发光
            }"
            class="absolute inset-[0px] z-3 flex items-center justify-center rounded-xl bg-white"
          >
            <div class="flex flex-col items-center justify-center">
              <el-icon
                :class="{
                  'drop-shadow-[0_0_12px_rgba(255,0,0,0.8)]': enter_remove,
                }"
                color="#ed3535"
                size="38"
              >
                <Delete />
              </el-icon>
              <div class="text-[15px] text-gray-500">拖动到此处删除</div>
            </div>
            <VueDraggable
              v-model="remove_group"
              animation="150"
              class="absolute inset-0 z-10 opacity-0"
              group="stu"
              @dragenter="
                () => {
                  enter_remove = false;
                }
              "
              @dragleave="
                () => {
                  enter_remove = true;
                }
              "
            >
            </VueDraggable>
          </div>
        </transition>
        <!--    删除组件的遮罩层结束-->
        <el-input v-model="group_name" clearable placeholder="分组名称" />
        <el-scrollbar style="width: 100%">
          <VueDraggable
            v-model="group_list"
            :group="{ name: 'stu_temp', pull: false, put: true }"
            animation="150"
            class="group-main-card-drag"
            ghostClass="ghost"
          >
            <div
              v-if="group_list.length === 0"
              class="group-main-card-drag-tip"
            >
              拖拽到此进行分组
            </div>

            <div v-for="item in group_list" class="group-main-card-drag-item">
              <el-tag closable @close="handleClose(item)">
                {{ item.姓名 }}
              </el-tag>
            </div>
          </VueDraggable>
        </el-scrollbar>
        <el-button
          :icon="Promotion"
          style="margin-top: 3.5px"
          type="primary"
          @click="creatGroup"
        >
          <p>创建分组</p>
        </el-button>
      </div>
    </main>
    <el-scrollbar>
      <div>
        <VueDraggable
          v-model="group_data"
          :group="{ name: 'stu', pull: true, put: false }"
          animation="150"
          class="group-foot min-h-30 min-w-30"
          ghostClass="ghost"
          @change="
            () => {
              enter_remove = false;
            }
          "
          @end="groupDragEnd"
          @start="groupDragStart('_is_put_no')"
        >
          <div v-for="item in group_data" class="group-foot-item">
            <div class="font-medium text-gray-700">
              {{ item.group_name }}
            </div>
            <VueDraggable
              v-model="item.group_list"
              :group="{ name: 'stu', pull: true, put: _is_put }"
              animation="150"
              class="grid min-h-20 min-w-20 grid-cols-3 grid-rows-3 gap-0.5"
              ghostClass="ghost"
              @change="
                () => {
                  enter_remove = false;
                }
              "
              @end="groupDragEnd"
              @start="groupDragStart"
            >
              <div v-for="item_item in item.group_list" class="m-1">
                <el-tag>
                  {{ item_item.姓名 }}
                </el-tag>
              </div>
            </VueDraggable>
            <transition>
              <div
                class="flex w-full items-center justify-center rounded-b-md bg-blue-400 opacity-0 transition-opacity duration-300 hover:opacity-100"
                @click="exportGroup(item)"
              >
                <span class="text-[14px] tracking-wider text-white"
                  >导出分组</span
                >
              </div>
            </transition>
          </div>
        </VueDraggable>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { CloseBold, Delete, Promotion, Select } from "@element-plus/icons-vue";
import { VueDraggable } from "vue-draggable-plus";
import { useAllData } from "../store/index.js";
import { storeToRefs } from "pinia";
import { exportGroupToWord } from "./../utils/export-group.js";
import { exportAllGroupsToWord } from "./../utils/exprot-all-group.js";
import { ref } from "vue";

const allDataStore = useAllData();
const { group_name, group_list, group_data, group_switch } =
  storeToRefs(allDataStore); // 响应式解构数据
const _isRemoveGroup = ref(false); // 是否展示删除组件
const enter_remove = ref(false); // 是否进入删除区域
const remove_group = []; // 将要移除的分组
const _is_put = ref(true);
// 分组开始拖拽方法
const groupDragStart = (key) => {
  if (key === "_is_put_no") {
    _is_put.value = false;
  }
  _isRemoveGroup.value = true;
};
// 分组结束拖拽方法
const groupDragEnd = () => {
  _isRemoveGroup.value = false;
  _is_put.value = true;
};
// 导出全部分组方法
const exportALLGroup = async () => {
  if (group_data.value.length !== 0) {
    try {
      await exportAllGroupsToWord(group_data.value);
    } catch (err) {
      console.log(err);
    }
  }
};

// 导出分组方法
const exportGroup = async (data) => {
  try {
    await exportGroupToWord(data);
  } catch (err) {
    console.log(err);
  }
};
// 创建分组方法
const creatGroup = () => {
  if (!group_name.value || !group_list.value.length) {
    return;
  }
  const group_temp = {
    group_name: group_name.value,
    group_list: group_list.value,
  };
  group_data.value.push(group_temp);
  group_name.value = null;
  group_list.value = [];
};

// 删除待分组标签方法
const handleClose = (tag) => {
  group_list.value.splice(group_list.value.indexOf(tag), 1);
};
</script>

<style lang="scss" scoped>
.disabled-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(200, 200, 200, 0.3);
  border-radius: 8px;
  z-index: 10;
  cursor: not-allowed;
}

.switch_bnt {
  pointer-events: auto;
  position: relative;
  z-index: 11;
}

.group {
  position: relative;
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
      @media (max-width: 1150px) {
        p {
          display: none;
        }
      }
    }
  }

  .group-main {
    display: flex;
    min-width: 379px;
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
      position: relative;
      min-height: 150px;
      min-width: 179px;
      user-select: none;
      margin: 4px 0;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 0 10px #d1d1d1;

      &:hover {
        .group-foot-item-closeIcon {
          opacity: 1;
        }
      }

      .group-foot-item-closeIcon {
        position: absolute;
        transition: all 0.5s ease;
        top: 5px;
        right: 5px;
        opacity: 0;
      }
    }
  }
}
</style>