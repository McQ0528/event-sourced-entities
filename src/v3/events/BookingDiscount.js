import Price from '../Price';

export default class BookingDiscount {
    discount: Price;

    constructor(discount: Price) {
        this.discount = discount
    }
}
