import mongoose from 'mongoose';
import { OrderStatus } from '@gearthlogic/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order } from './Order';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build: (attrs: TicketAttrs) => TicketDoc
    findByVersion(data: {id:string, version: number}): Promise<TicketDoc>
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    versionKey: false
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({ ...attrs, _id: attrs.id });
};

ticketSchema.statics.findByVersion = async (data: {id:string, version: number}) => {
    return await Ticket.findOne({ 
        _id: data.id, 
        version: data.version - 1 
    });
};

ticketSchema.methods.isReserved = async function (attrs: TicketAttrs) {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $nin: [OrderStatus.Cancelled]
        }
    });

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };


