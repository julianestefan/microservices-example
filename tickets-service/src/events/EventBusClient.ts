import nats, { Stan } from 'node-nats-streaming';
import { enviroment } from '../core/enviroment';
import { Subjects } from '@gearthlogic/common';
import { OrderCancelledListener } from './Listeners/OrderCancelledListener';
import { OrderCreatedListener } from './Listeners/OrderCreatedListener';

class NatsEventBusClient {
    private readonly client: Stan;

    constructor() {
        this.client = nats.connect(
            enviroment.natsClusterId,
            enviroment.natsClientId,
            { url: enviroment.natsURL }
        );
    }

    connect() {
        return new Promise<void>(
            (resolve, reject) => {

                this.client.on('connect', () => {
                    console.log("Connected to event bus");
                    resolve();
                });

                this.client.on('close', () => {
                    console.log('NATS connection closed');
                    process.exit();
                });

                process.on('SIGINT', () => this.client.close());
                process.on('SIGTERM', () => this.client.close());

                this.client.on('error', err => {
                    reject(err)
                });
            }
        )
    }

    listen() {
        new OrderCancelledListener(this.client).listen();
        new OrderCreatedListener(this.client).listen();
        console.log("Listening for events");
    }

    publish(subject: Subjects, data: string) {
        return new Promise<void>((resolve, reject) => {
            this.client.publish(subject, data, (err) => {
                if (err) return reject(err);

                resolve();
            });
        });
    }
}

export const eventBusClient = new NatsEventBusClient()