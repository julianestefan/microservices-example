 class EnviromentManager {
    private _enviroment ;

    constructor() {
          if (!process.env.NATS_URL) {
            throw new Error("Mongo URI not avaliable")
          }
      
          if (!process.env.NATS_CLUSTER_ID) {
            throw new Error("Mongo URI not avaliable")
          }
      
          if (!process.env.NATS_CLIENT_ID) {
            throw new Error("Mongo URI not avaliable")
          }

          this._enviroment =  {
            jwtSecret: process.env.JWT_SECRET,
            natsClientId: process.env.NATS_CLIENT_ID,
            natsClusterId: process.env.NATS_CLUSTER_ID,
            natsURL: process.env.NATS_URL,
            mongoURI: process.env.MONGO_URI,
          };
    }
   
    get enviroment() {
        return this._enviroment;
    }
}

export const enviroment = new EnviromentManager().enviroment;