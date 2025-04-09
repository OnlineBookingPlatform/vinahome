import { defineStore } from 'pinia';
import type { UserType } from '~/types/AccountType';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: null as UserType | null,
    }),
    actions: {
        loadUserData() {
            if (process.client) {
                const userDataStore = localStorage.getItem('userDataStore');
                if (userDataStore) {
                    this.userData = JSON.parse(userDataStore) as UserType;
                }
            }
        },


        setUserData(userData: UserType) {
            this.userData = userData;
            if (process.client) {
                localStorage.setItem('userDataStore', JSON.stringify(userData));
            }
        },

        clearUserData() {
            this.userData = null;
            if (process.client) {
                localStorage.removeItem("userDataStore");
            }
        },
    },
});
