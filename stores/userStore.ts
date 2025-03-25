import { defineStore } from "pinia";
import type { UserType } from "~/types/UserType";

type UserState = {
  userData?: UserType;
};

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
    userData: undefined,
  }),
  actions: {
    loadUserData() {
      if (import.meta.client) {
        const userDataStore = localStorage.getItem("userDataStore");
        if (userDataStore) {
          this.userData = JSON.parse(userDataStore);
        }
      }
    },

    setUserData(userData: UserType) {
      this.userData = userData;
      if (import.meta.client) {
        localStorage.setItem("userDataStore", JSON.stringify(userData));
      }
    },

    clearUserData() {
      this.userData = undefined;
      if (import.meta.client) {
        localStorage.clear();
      }
    },
  },
});
