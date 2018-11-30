/* @flow */

import DomainEvent from './events/DomainEvent';

export default class EventSourcedAggregate {
    changes: Array<DomainEvent>;

    constructor() {
        this.changes = [];
    }

    apply(event: DomainEvent): void {
        throw new Error('Not Implemented');
    }

    causes(event: DomainEvent): void {
        this.changes.push(event);
        this.apply(event);
    }
}
