<template>
  <el-dialog v-model="props.dialogVisible" title="用户数据" width="700">
    <template #header="{ titleId, titleClass }">
      <div class="flex flex-row justify-between">
        <h4 :id="titleId" :class="titleClass">用户中心</h4>
        <div v-if="auth_succeed">
          <el-button>修改信息</el-button>
          <el-button @click="exit_login">退出登录</el-button>
        </div>
      </div>
    </template>
    <!--    登录成功展示-->
    <div v-if="auth_succeed">
      <div>
        <header class="font-bold">本地数据 :</header>
        <el-table :data="local_gridData">
          <el-table-column property="date" label="更新日期" width="200" />
          <el-table-column label="班级名称" width="250">
            <template #default="scope">
              <el-input v-model="class_name"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary">同步到云端</el-button>
            </template>
          </el-table-column>
        </el-table>
        <header class="font-bold">云端数据 :</header>
        <el-table :data="cloud_gridData">
          <el-table-column property="date" label="更新日期" width="200" />
          <el-table-column property="name" label="班级名称" width="250">
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary">同步到本地</el-button>
              <el-button type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--    未登录展示-->
    <div v-else class="flex flex-col items-center justify-center p-10">
      <div class="mb-5 text-xl font-bold">欢迎使用</div>
      <div class="mb-2 ml-4">
        <el-radio-group v-model="radio1">
          <el-radio value="1" size="large">登录</el-radio>
          <el-radio value="2" size="large">注册</el-radio>
        </el-radio-group>
      </div>
      <el-form
        :model="user_info_form"
        :rules="formRules"
        ref="registerForm"
        class="flex w-100 flex-col justify-center rounded p-5 shadow"
      >
        <div v-if="radio1 !== '1'">昵称</div>
        <el-form-item v-if="radio1 !== '1'" prop="nickname">
          <el-input
            placeholder="请输入昵称"
            clearable
            v-model="user_info_form.nickname"
          ></el-input>
        </el-form-item>
        <div>用户名</div>
        <el-form-item prop="user_name">
          <el-input
            placeholder="请输入用户名"
            clearable
            v-model="user_info_form.user_name"
          ></el-input>
        </el-form-item>
        <div>密码</div>
        <el-form-item prop="passwd">
          <el-input
            type="password"
            placeholder="请输入密码(至少6位)"
            show-password
            clearable
            v-model="user_info_form.passwd"
          ></el-input>
        </el-form-item>
        <div v-if="radio1 !== '1'">邮箱(可选)</div>
        <el-form-item v-if="radio1 !== '1'" prop="email">
          <el-input
            placeholder="请输入邮箱"
            clearable
            v-model="user_info_form.email"
          ></el-input>
        </el-form-item>
        <div class="mt-5 flex justify-around">
          <el-button
            v-if="radio1 === '2'"
            @click="runRegister"
            type="primary"
            class="w-full"
            >注册
          </el-button>
          <el-button
            @click="runLogin"
            v-if="radio1 === '1'"
            type="primary"
            class="w-full"
            >登录
          </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAllData } from "./../store/index.js";
import { login, register } from "./../api/user.js";
import { getToken, removeToken, saveToken } from "./../utils/auth";
import { ElMessage } from "element-plus";

onMounted(() => {
  checkAuthStatus();
});
// 接收父组件传递的props
const props = defineProps({
  dialogVisible: Boolean,
});
// 定义本地表格数据
const local_gridData = computed(() => {
  return [
    {
      date: update_time.value,
      name: class_name.value,
    },
  ];
});
// 定义云端表格数据
const cloud_gridData = ref([
  {
    date: "2024-01-01",
    name: "班级1",
  },
]);

const allDataStore = useAllData(); // 获取store
const { update_time, class_name } = storeToRefs(allDataStore); // 响应式解构数据
const registerForm = ref(null); // 注册表单的ref
const auth_succeed = ref(false); // 登录成功标志
const radio1 = ref("1"); //表单展示状态

// 表单验证规则
const formRules = {
  user_name: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 3, max: 25, message: "长度在3到25个字符", trigger: "blur" },
  ],
  passwd: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
  nickname: [
    { required: true, message: "昵称不能为空", trigger: "blur" },
    { min: 2, max: 10, message: "昵称长度在2到10个字符", trigger: "blur" },
  ],
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
};
// 表单数据
const user_info_form = reactive({
  user_name: "",
  passwd: "",
  email: "",
  nickname: "",
});

// 检查认证状态（包括 token 有效性）
const checkAuthStatus = () => {
  const token = getToken();
  if (!token) {
    auth_succeed.value = false;
    return;
  }
  auth_succeed.value = true;
};
// 退出登录方法
const exit_login = () => {
  removeToken();
  window.location.reload(); // 直接刷新页面
};
// 注册方法
const runRegister = async () => {
  try {
    // 验证表单
    await registerForm.value.validate();
    // 开始注册
    const data = {
      username: user_info_form.user_name,
      password: user_info_form.passwd,
      nickname: user_info_form.nickname,
    };
    if (user_info_form.email) {
      data.email = user_info_form.email;
    }
    const res = await register(data);
    saveToken(res.token); // 保存token到本地
    window.location.reload(); // 直接刷新页面
  } catch (e) {
    removeToken(); // 清除token
    window.location.reload(); // 直接刷新页面
    console.log(e);
  }
};

// 登录方法
const runLogin = async () => {
  try {
    await registerForm.value.validate();
    // 开始登录
    const data = {
      account: user_info_form.user_name,
      password: user_info_form.passwd,
    };
    const res = await login(data);
    saveToken(res.token); // 保存token到本地
    window.location.reload(); // 直接刷新页面
  } catch (e) {
    ElMessage.error("操作失败，账号或密码错误");
    console.log(e);
  }
};
</script>
