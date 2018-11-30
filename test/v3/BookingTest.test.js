import Booking from '../../src/v3/Booking';
import Price from '../../src/v3/Price';

test('Booking creation test', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    expect(booking.status).toBe('CREATED');
    expect(booking.getPrice().value).toBe(12);
});


test('Booking confirmation test', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    booking.confirm();

    expect(booking.status).toBe('CONFIRMED');
});


test('Booking cancellation test', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    booking.cancel();

    expect(booking.status).toBe('CANCELLED');
});


test('Booking valid discount test. ', async () => {
    const booking = new Booking('123', new Price(20, 'EUR'));
    booking.applyDiscount(25);

    expect(booking.discount.value).toBe(5);
    expect(booking.getPrice().value).toBe(15);
});

test('Booking negative discount test. ', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    expect(() => {
        booking.applyDiscount(-1);
    }).toThrow();
});

test('Booking invalid discount test. ', async () => {
    const booking = new Booking('123', new Price(12, 'EUR'));
    expect(() => {
        booking.applyDiscount(110);
    }).toThrow();
});
