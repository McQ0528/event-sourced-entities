/* @flow */

export default class Price {
    currency: string;
    value: number;

    constructor(value: number, currency: string) {
        this.currency = currency;
        this.value = value;
    }
}
