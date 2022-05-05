import mongoose from 'mongoose';

import { app } from './core/App';
import { enviroment } from './core/enviroment'
import { eventBusClient } from './events/EventBusClient';

(async function main() {
  try {
    await eventBusClient.connect();
    eventBusClient.listen();
    const connection = await mongoose.connect(enviroment.mongoURI, {});
    console.log(`Connected to ${connection.connections[0].name} database`);
    await app.listen(3000);
    console.log(process.env.APP_NAME + ' listening on port 3000');
  } catch (err) {
    console.error(err);
  }
})();

