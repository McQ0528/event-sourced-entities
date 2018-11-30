import EventSourcedBookingRepository from '../../src/v2/EventSourcedBookingRepository';
import Booking from '../../src/v2/Booking';
import Price from '../../src/v2/Price';

const bookingRepository = new EventSourcedBookingRepository();

test('EventSourcingRepository test', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    booking.applyDiscount(10);

    await bookingRepository.save(booking);

    const retrievedBooking = await bookingRepository.getById('123');
    expect(retrievedBooking.getPrice().value).toBe(booking.getPrice().value);
});
