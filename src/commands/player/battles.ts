import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  Embed,
} from 'seyfert';
import { Battlelog, GameModes } from '../../package';

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
  [ k in GameModes ]: number
}

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
    const embed = new Embed().setDescription(content);

    console.log(averages);
    ctx.editOrReply({ embeds: [embed] });
  }

  getContent(logs: Battlelog[]): string {
    let content = '';
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]!;
      const map = log.event.map ? `- ${log.event.map}` : '';
      const result = log.battle.result ? `| ${log.battle.result}` : '';
      content += `${
        log.battle.mode
      } ${map} | ${log.battleTime.toUTCString()} ${result}\n`;
    }

    return content
  }

  getAverages(logs: Battlelog[]): AverageData {
    const modeList = Array.from(new Set(logs.map((item) => item.battle.mode)));

    let averages: AverageData = {} as AverageData;
    modeList.forEach((mode) => {
      const battles = logs.filter(
        (log) => log.battle.mode === mode && log.battle.duration
      );

      if (battles.length > 0) {
        averages[mode] = Math.round(
          battles.reduce((sum, log) => sum + log.battle.duration!, 0) /
            battles.length
        );
      }
    });

    return averages;
  }
}
