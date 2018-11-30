import Price from '../Price';

export default class BookingCreated {
    id: string;
    basePrice: Price;

    constructor(bookingId: string, price: Price) {
        this.id = bookingId;
        this.basePrice = price;
    }
}
