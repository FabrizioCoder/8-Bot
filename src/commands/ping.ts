import { Command, CommandContext, Declare } from 'seyfert';

@Declare({
  name: 'ping',
  description: 'Show the ping with discord',
})
export default class PingCommand extends Command {
  async run(ctx: CommandContext) {
    const shardPing = ctx.client.gateway.get(ctx.shardId)?.latency ?? 0;

    return await ctx.editOrReply({
      content: `Pong! (gateway#${ctx.shardId}: ${shardPing}ms)`,
    });
  }
}
