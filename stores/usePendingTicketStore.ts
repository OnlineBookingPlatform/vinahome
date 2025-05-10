import { defineStore } from "pinia";
import type { BookingData } from "~/types/PendingType";
import type { ConnectedTripType } from "~/types/TripType";

interface StoreState {
  pendingTicket: BookingData | null;
  connectedTrip: ConnectedTripType | null;
}

export const usePendingTicketStore = defineStore("pendingTicketStore", {
    state: (): StoreState => ({
      pendingTicket: null,
      connectedTrip: null,
    }),
    actions: {
      loadPendingTicket() {
        if (process.client) {
          const pendingTicketStore = localStorage.getItem("pendingTicketStore");
          if (pendingTicketStore) {
            try {
              const parsed = JSON.parse(pendingTicketStore);
              if (parsed && typeof parsed === 'object') {
                this.pendingTicket = parsed;
              } else {
                this.pendingTicket = null;
              }
            } catch (error) {
              console.error('Failed to parse pendingTicketStore:', error);
              this.pendingTicket = null;
            }
          }
          
          // Load connected trip data if exists
          const connectedTripStore = localStorage.getItem("connectedTripStore");
          if (connectedTripStore) {
            try {
              const parsed = JSON.parse(connectedTripStore);
              if (parsed && typeof parsed === 'object') {
                this.connectedTrip = parsed;
              } else {
                this.connectedTrip = null;
              }
            } catch (error) {
              console.error('Failed to parse connectedTripStore:', error);
              this.connectedTrip = null;
            }
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
      
      addConnectedTrip(connectedTrip: ConnectedTripType) {
        this.connectedTrip = connectedTrip;
        if (process.client) {
          localStorage.setItem(
            "connectedTripStore",
            JSON.stringify(connectedTrip)
          );
        }
      },
      
      clearPendingTicket() {
        this.pendingTicket = null;
        if (process.client) {
          localStorage.removeItem("pendingTicketStore");
        }
      },
      
      clearConnectedTrip() {
        this.connectedTrip = null;
        if (process.client) {
          localStorage.removeItem("connectedTripStore");
        }
      },
      
      clearAll() {
        this.clearPendingTicket();
        this.clearConnectedTrip();
      }
    },
    getters: {
      getPendingTicket(): BookingData | null {
        return this.pendingTicket;
      },
      
      getConnectedTrip(): ConnectedTripType | null {
        return this.connectedTrip;
      },
      
      hasConnectedTrip(): boolean {
        return this.connectedTrip !== null;
      }
    },
  });
