import { defineStore } from 'pinia';
import type { TripPointType } from '~/types/PointType';
export const usePointStore = defineStore('point', {
    state: () => ({
        pointUp: null as TripPointType | null,
        pointDown: null as TripPointType | null
    }),

    actions: {
        savePoints() {
            localStorage.setItem('tripPoints', JSON.stringify({
                up: this.pointUp,
                down: this.pointDown
            }));
        },
        loadPoints() {
            const data = localStorage.getItem('tripPoints');
            if (data) {
                const { up, down } = JSON.parse(data);
                this.pointUp = up;
                this.pointDown = down;
            }
        },

        setPointUp(point: TripPointType | null) {
            this.pointUp = point;
            this.savePoints();
        },
        setPointDown(point: TripPointType | null) {
            this.pointDown = point;
            this.savePoints();
        },
        clearPoints() {
            this.pointUp = null;
            this.pointDown = null;
            localStorage.removeItem('tripPoints');
          },
    }
});