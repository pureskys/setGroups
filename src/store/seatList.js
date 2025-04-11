import {defineStore} from 'pinia'
import {ref} from "vue";

export const useSeatList = defineStore('seatList', () => {
    const seat_list = ref([{
        name: '欧阳娜',
        id: '0',
        sex: '男'
    },
        {
            name: '欧阳娜',
            id: '1',
            sex: '男'
        },])

    return {
        seat_list,
    }
})