import {defineStore} from "pinia";

export const useAllData = defineStore('SetSeatStore', {
    state: () => ({
        stu_list: [],
        seat_list: [],
        row:7,
        column:6,
        is_upload: true,
        stu_list_length: 0,
    }),
    persist: true,
});