import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  Embed,
} from 'seyfert';
import { getIcon } from '../../utils/functions';
import { formatTag } from '../../package/functions';
import { Player } from '../../package';

const options = {
  tag: createStringOption({
    description: 'Player tag',
    required: true,
    value(data, ok: OKFunction<string>) {
      return ok(data.value);
    },
  }),
};

@Declare({
  name: 'profile',
  description: 'Get information about a single player by player tag.',
})
@Options(options)
export default class Profile extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { tag } = ctx.options;

    let player: Player;
    try {
      player = await ctx.client.api.players.get(tag);
    } catch (e) {
      return ctx.editOrReply({
        content: '⚠️ Player not found. Please check the tag and try again.',
      });
    }

    const icon = getIcon(player.icon.id)!;

    // console.log(player);
    const embed = new Embed()
      .setAuthor({
        name: `${player.name} (${player.tag})`,
        url: `https://brawlify.com/stats/profile/${formatTag(player.tag)}`,
      })
      .setThumbnail(icon.imageUrl);

    ctx.editOrReply({ embeds: [embed] });
  }
}
