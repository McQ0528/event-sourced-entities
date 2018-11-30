import EventSourcedBookingRepository from '../../src/v3/EventSourcedBookingRepository';
import Booking from '../../src/v3/Booking';
import Price from '../../src/v3/Price';

const bookingRepository = new EventSourcedBookingRepository();

test('EventSourcingRepository test', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    booking.applyDiscount(5);

    await bookingRepository.save(booking);

    const retrievedBooking = await bookingRepository.getById('123');
    expect(retrievedBooking.getPrice().value).toBe(booking.getPrice().value);
});
