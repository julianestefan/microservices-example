import nats, { Stan } from 'node-nats-streaming';
import { enviroment } from '../core/enviroment';
import { Subjects } from '@gearthlogic/common';

import { TicketCreatedListener } from './Listeners/TicketCreatedListener';
import { TicketUpdatedListener } from './Listeners/TicketUpdatedListener';

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
        new TicketCreatedListener(this.client).listen();
        new TicketUpdatedListener(this.client).listen();
        console.log("Listening for events");
    }

    publish(subject: Subjects, data: any) {
        return new Promise<void>((resolve, reject) => {
            this.client.publish(subject, JSON.stringify(data), (err) => {
                if (err) return reject(err);

                console.log("Event published to subject", subject);
                resolve();
            });
        });
    }
}

export const eventBusClient = new NatsEventBusClient()