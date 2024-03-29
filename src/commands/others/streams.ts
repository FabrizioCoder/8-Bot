import { Command, CommandContext, Declare, Embed } from 'seyfert';
import { HelixClient } from '@twitchapi/helix';
import { Colors } from '../../utils/constants';
@Declare({
  name: 'streams',
  description: 'Get the list of streams of brawl stars players',
})
export default class StreamsCommand extends Command {
  async run(ctx: CommandContext) {
    await ctx.deferReply();
    const opts = {
      clientID: 'dhfigae0swoqnkfm87tg2xxdlvcchy',
      clientSecret: 'kvn7gh5vib3d0hx7wqa8la1bvd7si4',
    };

    const appToken = await HelixClient.generateAppToken({
      ...opts,
      refresh: true,
    });

    const client = new HelixClient({ ...opts, appToken });

    const streams = await client.getStreams(
      { game_id: '497497', language: 'en' },
      { pages: 1, data_per_page: 6 }
    );

    const streamers = await Promise.all(
      streams.map(async (stream) => {
        const user = await client.getUser(stream.user_id);
        user.profile_image_url = user.profile_image_url
          .replace('{width}', '50')
          .replace('{height}', '50');

        return {
          title: stream.title,
          viewer_count: stream.viewer_count,
          user,
        };
      })
    );

    const embed = new Embed()
      .setTitle('Brawl Stars Streams')
      .setDescription(
        streamers
          .map((streamer) => {
            return `[👤 ${streamer.viewer_count}] [${streamer.user.display_name}](https://twitch.tv/${streamer.user.login}): ${streamer.title}`;
          })
          .join('\n')
      )
      .setColor(Colors.DodgerBlue);
    //   .addFields(
    //     streamers.map((streamer) => ({
    //       name: `${streamer.user.display_name}`,
    //       value: `[${streamer.title}](https://twitch.tv/${streamer.user.login})\n**Viewers**: ${streamer.viewer_count}`,
    //       inline: true,
    //     }))
    //   );

    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
