/* @flow */

import Booking from './Booking';
import BookingCancelled from './events/BookingCancelled';
import BookingConfirmed from './events/BookingConfirmed';
import BookingDiscount from './events/BookingDiscount';
import BookingCreated from './events/BookingCreated';

const eventFactory = {
    'BookingCancelled': BookingCancelled,
    'BookingConfirmed': BookingConfirmed,
    'BookingDiscount': BookingDiscount,
    'BookingCreated': BookingCreated,
};

function createBooking(bookingId: string, events: Array<DatabaseDomainEvent>): Booking {
    const booking = Object.create(Booking.prototype);
    booking.id = bookingId;

    events.forEach(storedEvent => {
        const domainEvent = new eventFactory[storedEvent.eventType]();
        Object.assign(domainEvent, storedEvent.payload);
        booking.apply(domainEvent);
    });
    return booking;
}

type DatabaseDomainEvent = {
    bookingId: string,
    eventType: string,
    createdWhen: number,
    payload?: Object
};


export default class EventSourcedBookingRepository {
    eventStore: Array<DatabaseDomainEvent>;

    constructor() {
        this.eventStore = [];
    }

    save(booking: Booking): Promise<Booking> {
        booking.changes.forEach(event => {
            this.eventStore.push({
                bookingId: booking.id,
                eventType: event.constructor.name,
                createdWhen: new Date().getTime(),
                payload: event
            });
        });

        return Promise.resolve(booking);
    }

    getById(id: string): Promise<Booking> {
        const events = this.eventStore.filter(event => event.bookingId === id);

        if (events.length === 0) {
            return Promise.reject(new Error('Booking does not exist'));
        }

        const booking = createBooking(id, events);
        return Promise.resolve(booking);
    }
}
