/* @flow */

import Booking from './Booking';

export default class BookingRepository {
    map: Map<string, Booking>;

    constructor() {
        this.map = new Map();
    }

    save(booking: Booking): Promise<Booking> {
        this.map.set(booking.id, booking);
        return Promise.resolve(booking);
    }

    getById(id: string): Promise<Booking> {
        const booking = this.map.get(id);
        if (!booking) {
            return Promise.reject(new Error('Booking does not exist'));
        }
        return Promise.resolve(booking);
    }
}
