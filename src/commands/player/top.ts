import {
  type CommandContext,
  Declare,
  SubCommand,
  createStringOption,
  Options,
  AttachmentBuilder,
  OKFunction,
} from 'seyfert';
import { makeTopImage } from '../../utils/images/top';
import { CountryCodes } from '../../utils/constants';
import { CountryCodes as CC } from '../../package';

const options = {
  country: createStringOption({
    name: 'country',
    description: 'The country to get the top players from',
    required: false,
    autocomplete: async (interaction) => {
      const input = interaction.options.getString('country')!;

      const choices = Object.values(CountryCodes)
        .filter((key) => key.toLowerCase().startsWith(input.toLowerCase()))
        .slice(0, 25);

      await interaction.respond(
        choices.map((c) => ({
          name: c,
          value: c,
        }))
      );
    },
    value(data, ok: OKFunction<string>) {
      if (data.value === undefined) return ok('global');
      return ok(data.value ?? 'global');
    },
  }),
};

@Declare({
  name: 'top',
  description: 'Get the top players in the game',
})
@Options(options)
export default class Top extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    let c: string;
    const { country } = ctx.options;

    if (country) {
      c = Object.entries(CountryCodes).find(
        ([_, value]) => value.toLowerCase() === country.toLowerCase()
      )?.[0]!;
    } else {
      c = 'global';
    }

    const players = await ctx.client.api.rankings.players.get(
      (c as CC) ?? 'global'
    );
    const buffer = await makeTopImage(players, c, ctx.client);

    await ctx.editOrReply({
      content: `Here are the top players in ${country ?? 'the world'}`,
      files: [
        new AttachmentBuilder()
          .setFile('buffer', buffer)
          .setName('top-players.png'),
      ],
    });
  }
}
