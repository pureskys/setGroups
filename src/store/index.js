import {defineStore} from 'pinia'
import {ref} from "vue";

export const useAllData = defineStore('stuLists', () => {
    const stu_list = ref([])  // 学生的列表数据
    const seat_list = ref([])  // 座次数据（暂时还没用到）
    const is_upload = ref(true)  // 标记是否需要展示上传框
    const stu_list_length = ref(0)
    return {
        stu_list,
        seat_list,
        is_upload,
        stu_list_length
    }
})