import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  Embed,
} from 'seyfert';
import { BABrawler } from '../../package';

const options = {
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
        .slice(0, 15)
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
  name: 'info',
  description: 'Get information about a single brawler by name.',
})
@Options(options)
export default class Info extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { name: id } = ctx.options;

    let brawler: BABrawler;
    try {
      brawler = await ctx.client.api.brawlers.get(parseInt(id));
    } catch (e) {
      return ctx.editOrReply({
        content: '⚠️ Brawler not found. Please check the name and try again.',
      });
    }

    const embed = new Embed()
      .setTitle(`${brawler.name} - ${brawler.class.name}`)
      .setURL(brawler.link)
      .setDescription(brawler.description)
      .setColor(parseInt(brawler.rarity.color.replace('#', ''), 16))
      .setThumbnail(brawler.imageUrl)
      .setFooter({
        text: `Rarity: ${brawler.rarity.name}`,
      })
      .setAuthor({
        name: 'Brawler Details',
        iconUrl: brawler.imageUrl3,
      })
      .addFields(
        {
          name: '> Star Powers',
          value: brawler.starPowers
            .map((sp) => `**${sp.name}** - ${sp.description}`)
            .join('\n'),
        },
        {
          name: '> Gadgets',
          value: brawler.gadgets
            .map((g) => `**${g.name}** - ${g.description}`)
            .join('\n'),
        }
      );

    await ctx.editOrReply({
      embeds: [embed],
    });
  }
}
