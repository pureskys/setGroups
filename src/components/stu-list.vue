<template>
  <div class="stu-list" :style="{ height: stu_list_height }">
    <!-- 禁用时的遮罩层 -->
    <div v-if="group_switch" class="disabled-overlay"></div>

    <header class="stu-head">
      <h2 class="font-bold">学生名单</h2>
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
          <div
            :key="item.id"
            :style="{ backgroundColor: item.color || 'transparent' }"
            @contextmenu.prevent="(e) => menu.openMenu(e, item)"
            v-for="item in stu_list"
            class="stu"
          >
            <span>{{ item.姓名 }}</span>
          </div>
        </VueDraggable>
      </el-scrollbar>
    </div>
  </div>
  <!--  用户卡片-->
  <div
    ref="user_card"
    class="m-2.5 mt-2 flex flex-col rounded-xl p-2 shadow-[0_0_5px_#d1d1d1]"
    @click="dialogVisible = true"
  >
    <div class="flex-rows flex items-center gap-3">
      <div>
        <el-avatar :style="{ backgroundColor: avatarColor() }">
          {{ user_nickname.trim().charAt(0).toUpperCase() }}
        </el-avatar>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="font-semibold text-blue-400">{{ user_nickname }}</div>
        <div class="max-w-[118px] truncate text-xs text-gray-500">
          {{ user_signature }}
        </div>
      </div>
    </div>
  </div>
  <!-- 数据信息弹窗-->
  <data-info-dialog v-model="dialogVisible" />
  <!--  注册右键菜单-->
  <ColorContextMenu ref="menu" @color-selected="updateItemColor" />
</template>

<script setup>
import { VueDraggable } from "vue-draggable-plus";
import { useAllData } from "./../store/index.js";
import { storeToRefs } from "pinia";
import { UploadFilled } from "@element-plus/icons-vue";
import { readFile, sheetToJson } from "./../utils/xlsl-tools.js";
import { computed, onMounted, onUnmounted, ref } from "vue";
import DataInfoDialog from "./data-info-dialog.vue";
import { getToken } from "../utils/auth.js";
import { getUserInfo } from "../api/user.js";
import { userInfo } from "../store/userInfo.js";
import { ElMessage } from "element-plus";
import ColorContextMenu from "./ColorContextMenu.vue";
import dayjs from "dayjs";

const {
  stu_list,
  is_upload,
  update_time,
  stu_list_length,
  group_switch,
  stu_list_temp,
} = storeToRefs(useAllData()); // 响应式解构store数据
const dialogVisible = ref(false); // 定义弹窗的显示状态
const user_card = ref(null); // 定义用户卡片的ref
const user_card_height = ref(0); // 定义用户卡片的高度
const user_nickname = ref("未登录"); // 定义用户昵称
const user_signature = ref("和光同尘，与时舒卷"); // 定义用户签名
const menu = ref(null); // 定义右键菜单的ref

//计算组件高度
const stu_list_height = computed(() => {
  return `calc(100dvh - ${user_card_height.value}px)`;
});
const updateHeight = () => {
  if (user_card.value) {
    user_card_height.value = user_card.value.offsetHeight + 55;
  }
};
// 组件加载时监听
onMounted(() => {
  updateHeight();
  getAuthStatus();
  window.addEventListener("resize", updateHeight);
});
// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener("resize", updateHeight);
});
// 设置学生颜色
const updateItemColor = ({ color, item }) => {
  item.color = color;
  const target = stu_list_temp.value.find((i) => i.id === item.id);
  if (target) {
    target.color = color;
  }
  console.log(target);
};

// 根据首字符获取颜色
const avatarColor = () => {
  if (!user_nickname) return "#cccccc";
  const hue = (user_nickname.value.charCodeAt(0) * 20) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};
// 获取登录信息
const getAuthStatus = async () => {
  try {
    const token = getToken();
    if (token) {
      const response = await getUserInfo(token);
      Object.assign(userInfo(), response.user);
      user_nickname.value = userInfo().nickname;
      user_signature.value = userInfo().signature;
    } else {
      console.log("未登录");
      user_nickname.value = "未登录";
    }
  } catch (e) {
    console.log("获取登录信息失败", e.message);
  }
};
// 上传文件方法（其实是upload文件改变的方法）
const upload_file = async (file) => {
  const rawFile = file.raw;
  const data = await readFile(rawFile);
  try {
    const result = await sheetToJson(data);
    console.log("原始表格数据:", result);

    // 提取"姓名"列，生成[{姓名:值, id:递增数字, color:""}]格式
    const nameData = result
      .map((row, index) => {
        // 找到表头为"姓名"的列
        const nameKey = Object.keys(row).find((key) => key.trim() === "姓名");
        return nameKey
          ? {
              姓名: row[nameKey],
              id: index + 1, // 从1开始递增的ID
              color: "white", // 默认白色
            }
          : null;
      })
      .filter((item) => item && item.姓名); // 过滤掉无效项

    // 更新响应式数据
    stu_list.value = structuredClone(nameData);
    stu_list_temp.value = structuredClone(nameData);
    is_upload.value = false;
    stu_list_length.value = nameData.length;
    update_time.value = dayjs().format("YYYY-MM-DD HH:mm");
    console.log("处理后的姓名数据:", nameData);
  } catch (err) {
    is_upload.value = true;
    console.error("文件处理错误:", err);
    ElMessage.error("文件处理失败，请检查文件格式");
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
  height: 82vh;
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
      height: 100%;
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
