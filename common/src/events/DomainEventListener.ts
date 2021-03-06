import { Message, Stan } from 'node-nats-streaming';
import { DomainEvent } from './types/DomainEvent';

export abstract class DomainEventListener<T extends DomainEvent> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    protected ackWait = 5 * 1000;

    constructor(protected readonly client: Stan) { }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);

            this.onMessage(parsedData, msg);
        });
    }

    private subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    private parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}

