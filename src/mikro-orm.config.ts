require('dotenv').config();

import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroORM } from '@mikro-orm/core';
import { User } from './database/entities/user.entity'

export default async function orm() {
  return await MikroORM.init({
    dbName: '8bot',
    driver: MongoDriver,
    clientUrl: process.env.DB_HOST!,
    entities: [User],
    allowGlobalContext: true,
    debug: false,
  });
}
