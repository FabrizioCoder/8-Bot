require('dotenv').config()

import { Client, ParseClient } from 'seyfert';
import { BrawlStarsClient } from './package';
import Database from './database'

const client = new Client();

client.start().then(() => client.uploadCommands());

client.api = new BrawlStarsClient();;
client.db = new Database();

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> {}

  interface Client {
    api: BrawlStarsClient;
    db: Database;
  }
}
