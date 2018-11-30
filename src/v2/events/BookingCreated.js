import DomainEvent from './DomainEvent';
import Price from '../Price';

export default class BookingCreated extends DomainEvent {
    id: string;
    basePrice: Price;

    constructor(bookingId: string, price: Price) {
        super();
        this.id = bookingId;
        this.basePrice = price;
    }
}
