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
import { makeBrawlerImage } from '../../utils/images/brawler';

const options = {
  tag: createStringOption({
    description: 'Player tag',
    required: true,
    value(data, ok: OKFunction<string>) {
      return ok(data.value);
    },
  }),
  name: createStringOption({
    description: 'Brawler name',
    required: true,
    autocomplete: async (interaction) => {
      const input = interaction.options.getString('name')!;

      const allBrawlers = await interaction.client.api.brawlers.getAll();
      const choices = allBrawlers
        .filter((c) => {
          return c.name.toLowerCase().includes(input.toLowerCase());
        })
        .slice(0, 25)
        .sort((a, b) => {
          return (
            a.name.toLowerCase().indexOf(input.toLowerCase()) -
            b.name.toLowerCase().indexOf(input.toLowerCase())
          );
        });

      interaction.respond(
        choices.map((c) => ({
          name: c.name,
          value: c.id.toString(),
        }))
      );
    },
    value(data, ok: OKFunction<string>) {
      return ok(data.value);
    },
  }),
};

@Declare({
  name: 'brawler',
  description:
    'Get information about a brawler in a player profile by player tag.',
})
@Options(options)
export default class Brawler extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { tag, name } = ctx.options;

    let player: Player;
    try {
      player = await ctx.client.api.players.get(tag);
    } catch (e) {
      return ctx.editOrReply({
        content: '⚠️ Player not found. Please check the tag and try again.',
      });
    }

    const selectedBrawler = player.brawlers!.filter(
      (b) => b.id === parseInt(name)
    )[0];
    if (!selectedBrawler) {
      return ctx.editOrReply({
        content: '⚠️ Brawler not found in player profile.',
      });
    }

    const buffer = await makeBrawlerImage(selectedBrawler);

    await ctx.editOrReply({
      content: `${player.name} ([${
        player.tag
      }](https://brawlify.com/stats/profile/${formatTag(player.tag)}))`,
      files: [
        new AttachmentBuilder()
          .setFile('buffer', buffer)
          .setName('brawler-profile.png'),
      ],
    });
  }
}
