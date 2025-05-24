import { defineStore } from "pinia";

export const useAllData = defineStore("SetSeatStore", {
  state: () => ({
    stu_list: [], // 学生名单数组
    stu_list_temp: [], // 学生名单全额缓存
    seat_list: [], // 座位排列数组
    row: 7, // 定义行数
    column: 6, // 定义列数
    is_upload: true, // 是否显示上传控件的标记
    stu_list_length: 0, // 默认的学生名单长度
    group_name: null, // 小组名称
    group_list: [], // 待创建分组的数组
    group_data: [], // 完成分组的数据
    group_switch: false, // 是否开启分组功能
  }),
  persist: true,
});
