import {defineStore} from "pinia";

export const useAllData = defineStore('AllData', {
    state: () => ({
        stu_list: [],
        seat_list: [],
        is_upload: true,
        stu_list_length: 0,
    }),
    persist: true,
});