import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  Embed,
  AttachmentBuilder,
} from 'seyfert';
import { Battlelog, GameModes } from '../../package';
import { makeBattleLogGraphic } from '../../utils/images/battlelog';
import { Colors, formattedGameModes } from '../../utils/constants';

const cmd = {
  name: 'battlelog',
  description: 'Get information about a player battle log by player tag.',
};

const options = {
  tag: createStringOption({
    description: 'Player tag',
    required: true,
    value(data, ok: OKFunction<string>) {
      return ok(data.value);
    },
  }),
};

type AverageData = {
  [k in GameModes]: number;
};

@Declare(cmd)
@Options(options)
export default class BattleLog extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();
    const { tag } = ctx.options;

    let logs: Battlelog[];
    try {
      logs = await ctx.client.api.players.getBattleLog(tag);
    } catch (e) {
      return ctx.editOrReply({
        content: 'Player not found. Please check the tag and try again.',
      });
    }

    const content = this.getContent(logs);
    const averages = this.getAverages(logs);
    const playerBuffer = await makeBattleLogGraphic(averages);

    const embed = new Embed()
      .setColor(Colors.DodgerBlue)
      .setImage('attachment://battlelog.png')
      // .setDescription(content)
      .setFooter({
        text: `The graph shows the time played in the last ${logs.length} games.`,
      });

    console.log(shard(content, 10));
    ctx.editOrReply({
      embeds: [embed],
      files: [
        new AttachmentBuilder()
          .setFile('buffer', playerBuffer)
          .setName('battlelog.png')
          .setDescription('Time Played graphic'),
      ],
    });
  }

  private getContent(logs: Battlelog[]): string[] {
    const content = <string[]>[];
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]!;
      // const map = log.event.map ? `- ${log.event.map}` : '';
      const result = log.battle.result ? `| ${log.battle.result}` : '';
      content.push(
        `<t:${log.battleTime.getTime() / 1000}:f> ${
          formattedGameModes[
            log.battle.mode as keyof typeof formattedGameModes
          ] ?? log.battle.mode
        } ${result}`
      );
    }

    return content;
  }

  private getAverages(logs: Battlelog<Date>[]): AverageData {
    const modeList = Array.from(new Set(logs.map((item) => item.battle.mode)));

    let averages: AverageData = {} as AverageData;
    modeList.forEach((mode) => {
      const battles = logs.filter(
        (log) => log.battle.mode === mode && log.battle.duration > 0
      );

      if (battles.length > 0) {
        averages[
          formattedGameModes[mode as keyof typeof formattedGameModes] ?? mode
        ] = Math.round(
          battles.reduce((sum, log) => sum + log.battle.duration / 60, 0)
        );
      }
    });

    return Object.fromEntries(
      Object.entries(averages).sort(([, a], [, b]) => a - b)
    ) as AverageData;
  }
}

function shard(array: string[], length: number): string[][] {
  if (!(array instanceof Array)) return array;
  const final: string[][] = [];
  let i = 0;
  for (const element of array) {
    if (!final[i]) final[i] = [];
    final[i]!.push(element);
    if (final[i]!.length >= length) ++i;
  }
  return final;
}
