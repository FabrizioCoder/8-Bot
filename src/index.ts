require('dotenv').config();

import { Client, ParseClient } from 'seyfert';
import { BrawlStarsClient } from './package';
import { MongoDriver } from '@mikro-orm/mongodb';
import orm from './mikro-orm.config'

const client = new Client();

(async () => {
  client.start().then(() => client.uploadCommands());

  client.api = new BrawlStarsClient();
  client.db = await (await orm()).connect();
})()

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> {}

  interface Client {
    api: BrawlStarsClient;
    db: MongoDriver;
  }
}
