import mongoose from 'mongoose';

import {app} from './core/App';

 (async function main () {
 
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret not avaliable")
    }

    if (!process.env.MONGO_URI) {
      throw new Error("Mongo URI not avaliable")
    }
    
    const connection = await mongoose.connect(process.env.MONGO_URI, {});
    console.log( `Connected to ${connection.connections[0].name} database` );
    await app.listen(3000);
    console.log(process.env.APP_NAME + ' listening on port 3000');
  } catch (err) {
    console.error(err);
  }
})();

