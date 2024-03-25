import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  AttachmentBuilder,
} from 'seyfert';
import { formatTag } from '../../package/functions';
import { Player } from '../../package';
import { makeProfileImage } from '../../utils/images/profile';

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

    const buffer = await makeProfileImage(player);

    await ctx.editOrReply({
      content: `${player.name} ([${
        player.tag
      }](https://brawlify.com/stats/profile/${formatTag(player.tag)}))`,
      files: [
        new AttachmentBuilder()
          .setFile('buffer', buffer)
          .setName('player-profile.png'),
      ],
    });
  }
}
