// @ts-check is better
const { config } = require('seyfert');
require('dotenv/config');

module.exports = config.bot({
  token: process.env.BOT_TOKEN || '',
  intents: [],
  locations: {
    base: 'src',
    output: 'dist',
    commands: 'commands',
    events: 'events',
  },
});
