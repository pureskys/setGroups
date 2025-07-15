import { defineStore } from "pinia";

export const userInfo = defineStore("UserInfo", {
  state: () => {
    return {
      _id: null,
      username: null,
      email: null,
      nickname: null,
      seats: null,
      signature: null,
    };
  },
});
