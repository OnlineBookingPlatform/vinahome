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
            if (process.client) {
                const data = localStorage.getItem('tripPoints');
                if (data) {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed && typeof parsed === 'object') {
                            this.pointUp = parsed.up ?? null;
                            this.pointDown = parsed.down ?? null;
                        } else {
                            this.pointUp = null;
                            this.pointDown = null;
                        }
                    } catch (error) {
                        console.error('Failed to parse tripPoints:', error);
                        this.pointUp = null;
                        this.pointDown = null;
                    }
                }
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