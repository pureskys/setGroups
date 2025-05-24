<template>
  <div class="stu-list">
    <!-- 禁用时的遮罩层 -->
    <div v-if="group_switch" class="disabled-overlay"></div>

    <header class="stu-head">
      <h2>学生名单</h2>
    </header>
    <div class="list">
      <el-scrollbar class="list-scrollbar">
        <div v-if="stu_list.length === 0 && is_upload === true">
          <el-upload
            :auto-upload="false"
            :drag="true"
            :on-change="upload_file"
            accept=".xlsx,.xls"
            class="upload-demo"
          >
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">
              <em>拖动文件到此导入</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                仅支持导入excel且至少有一列表头为“姓名”
                注意：不要有任何合并的单元格
              </div>
            </template>
          </el-upload>
        </div>
        <VueDraggable
          v-else
          v-model="stu_list"
          animation="150"
          class="drag"
          ghostClass="ghost"
          group="stu"
        >
          <div v-for="item in stu_list" class="stu">
            <span>{{ item.姓名 }}</span>
          </div>
        </VueDraggable>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { VueDraggable } from "vue-draggable-plus";
import { useAllData } from "./../store/index.js";
import { storeToRefs } from "pinia";
import { UploadFilled } from "@element-plus/icons-vue";
import { readFile, sheetToJson } from "./../utils/xlsl-tools.js";

const { stu_list, is_upload, stu_list_length, group_switch, stu_list_temp } =
  storeToRefs(useAllData()); // 响应式解构store数据

// 上传文件方法（其实是upload文件改变的方法）
const upload_file = async (file) => {
  // 获取excel的二进制数据
  const rawFile = file.raw;
  const data = await readFile(rawFile);
  try {
    const result = await sheetToJson(data);
    console.log("获取的sheet数据:", result);
    stu_list.value = structuredClone(result);
    stu_list_temp.value = structuredClone(result);
    is_upload.value = false;
    stu_list_length.value = result.length;
  } catch (err) {
    is_upload.value = true;
    console.error(err);
  }
};
</script>

<style lang="scss" scoped>
.disabled-overlay {
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
}

.stu-list {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 5px #d1d1d1;
  padding: 8px 4px;
  height: 95vh;
  margin: 0 10px;
  min-width: 205px;
  border-radius: 8px;
  @media (max-width: 600px) {
    height: 100%;
    width: 100vw;
  }

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
      padding-right: 10px;
      padding-left: 10px;
      grid-template-columns: repeat(2, 1fr);
      min-height: 140px;
      height: 100%;
      @media (max-width: 600px) {
        grid-template-rows: repeat(4, 1fr);
        grid-auto-flow: column;
        gap: 5px;
      }

      .stu {
        display: flex;
        margin: 3px;
        box-shadow: 0 0 5px #d1d1d1;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        height: 33px;
        @media (max-width: 600px) {
          width: 100px;
        }
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