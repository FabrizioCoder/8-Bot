import { Client, ParseClient } from 'seyfert';
import { BrawlStarsClient } from './package';
import { config } from 'dotenv';
config();

const client = new Client();
client.start().then(() => client.uploadCommands());

const api = new BrawlStarsClient();

client.api = api;

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> {}

  interface Client {
    api: BrawlStarsClient;
  }
}
