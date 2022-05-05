
import { eventBusClient } from './events/EventBusClient';

(async function main() {
  try {
    await eventBusClient.connect();
    eventBusClient.listen();
    console.log(process.env.APP_NAME + ' listening on port 3000');
  } catch (err) {
    console.error(err);
  }
})();

