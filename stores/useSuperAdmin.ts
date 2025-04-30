import type { SuperAdminType } from "~/types/AccountType";
import { defineStore } from 'pinia';

export const useSuperAdminStore = defineStore('superAdminStore', {
    state: () => ({
        superAdminData: null as SuperAdminType | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.superAdminData,
    },
    actions: {
            loadData() {
                if (process.client) {
                    const userDataStore = localStorage.getItem('superAdminStore');
                    if (userDataStore) {
                        this.superAdminData = JSON.parse(userDataStore) as SuperAdminType;
                    }
                }
            },
    
    
            setData(data: SuperAdminType) {
                this.superAdminData = data;
                if (process.client) {
                    localStorage.setItem('superAdminStore', JSON.stringify(data));
                }
            },
    
            clearData() {
                this.superAdminData = null;
                if (process.client) {
                    localStorage.removeItem("superAdminStore");
                }
            },
        },
})