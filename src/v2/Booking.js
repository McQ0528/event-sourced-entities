/* @flow */

import EventSourcedAggregate from './EventSourcedAggregate';
import Price from './Price';
import BookingConfirmed from './events/BookingConfirmed';
import BookingCancelled from './events/BookingCancelled';
import BookingDiscount from './events/BookingDiscount';
import DomainEvent from './events/DomainEvent';
import BookingCreated from './events/BookingCreated';


export default class Booking extends EventSourcedAggregate {
    id: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'CREATED';
    basePrice: Price;
    discount: ?Price;

    constructor(id: string, price: Price) {
        super();
        this.causes(new BookingCreated(id, price))
    }

    apply(event: DomainEvent): void {
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
        this.causes(new BookingConfirmed());
    }

    cancel() {
        this.causes(new BookingCancelled());
    }

    applyDiscount(percentage: number) {
        if (percentage < 0 || percentage > 100) {
            throw new Error(`Invalid percentage value: ${percentage}`);
        }

        const discount = new Price(
            this.basePrice.value * percentage / 100,
            this.basePrice.currency
        );
        this.causes(new BookingDiscount(discount));
    }

    getPrice(): Price {
        if (!this.discount) return this.basePrice;

        return new Price(
            this.basePrice.value - this.discount.value,
            this.basePrice.currency
        );
    }

}
