import { defineStore } from "pinia";
import type { BookingData } from "~/types/PendingType";

export const usePendingTicketStore = defineStore("pendingTicketStore", {
    state: () => ({
      pendingTicket: null as BookingData | null,
    }),
    actions: {
      loadPendingTicket() {
        if (process.client) {
          const pendingTicketStore = localStorage.getItem("pendingTicketStore");
          if (pendingTicketStore) {
            this.pendingTicket = JSON.parse(pendingTicketStore) as BookingData;
          }
        }
      },
      setPendingTicket(pendingTicket: BookingData) {
        this.pendingTicket = pendingTicket;
        if (process.client) {
          localStorage.setItem(
            "pendingTicketStore",
            JSON.stringify(pendingTicket)
          );
        }
      },
      clearPendingTicket() {
        this.pendingTicket = null;
        if (process.client) {
          localStorage.removeItem("pendingTicketStore");
        }
      },
    },
    getters: {
      getPendingTicket(): BookingData | null {
        return this.pendingTicket;
      },
    },
  });
