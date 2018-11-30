/* @flow */

import Price from './Price';

export default class Booking {
    id: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'CREATED';
    basePrice: Price;
    discount: ?Price;

    constructor(id: string, price: Price) {
        this.id = id;
        this.basePrice = price;
        this.status = 'CREATED';
    }

    confirm(): void {
        this.status = 'CONFIRMED'
    }

    cancel(): void {
        this.status = 'CANCELLED'
    }

    applyDiscount(percentage: number): void {
        if (percentage < 0 || percentage > 100) {
            throw new Error(`Invalid percentage value: ${percentage}`);
        }

        this.discount = new Price(this.basePrice.value * percentage / 100, this.basePrice.currency);
    }

    getPrice(): Price {
        if (!this.discount) return this.basePrice;

        return new Price(
            this.basePrice.value - this.discount.value,
            this.basePrice.currency
        );
    }
}
