/* @flow */

import BookingConfirmed from './events/BookingConfirmed';
import BookingCancelled from './events/BookingCancelled';
import BookingDiscount from './events/BookingDiscount';
import BookingCreated from './events/BookingCreated';
import Price from './Price';


function causes(booking: Booking, event: Object) {
    booking.changes.push(event);
    booking.apply(event);
}

type BookingEvent = BookingConfirmed | BookingCancelled | BookingDiscount | BookingCreated;


export default class Booking {
    changes: Array<BookingEvent>;

    id: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'CREATED';
    basePrice: Price;
    discount: ?Price;

    constructor(id: string, price: Price) {
        this.changes = [];
        causes(this, new BookingCreated(id, price))
    }

    apply(event: BookingEvent): void {
        const eventType = event.constructor.name;
        switch (eventType) {
            case 'BookingCreated':
                const bookingCreatedEvent = (event: BookingCreated);
                this.status = 'CREATED';
                this.id = bookingCreatedEvent.id;
                this.basePrice = bookingCreatedEvent.basePrice;
                break;
            case 'BookingConfirmed':
                this.status = 'CONFIRMED';
                break;
            case 'BookingCancelled':
                this.status = 'CANCELLED';
                break;
            case 'BookingDiscount':
                const bookingDiscountEvent = (event: BookingDiscount);
                this.discount = bookingDiscountEvent.discount;
                break;
            default:
                throw new Error(`Unsupported event: ${eventType}`);
        }
    }

    confirm() {
        causes(this, new BookingConfirmed());
    }

    cancel() {
        causes(this, new BookingCancelled());
    }

    applyDiscount(percentage: number) {
        if (percentage < 0 || percentage > 100) {
            throw new Error(`Invalid percentage value: ${percentage}`);
        }

        const discount = new Price(
            this.basePrice.value * percentage / 100,
            this.basePrice.currency
        );
        causes(this, new BookingDiscount(discount));
    }

    getPrice(): Price {
        if (!this.discount) return this.basePrice;

        return new Price(
            this.basePrice.value - this.discount.value,
            this.basePrice.currency
        );
    }
}
