import Price from '../Price';
import DomainEvent from './DomainEvent';

export default class BookingDiscount extends DomainEvent {
    discount: Price;

    constructor(discount: Price) {
        super();
        this.discount = discount
    }
}
