import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  Embed,
} from 'seyfert';
import { Battlelog } from '../../package';
import { getEvent } from '../../utils/functions';

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
    
    let content: string = "";
    let log: Battlelog<Date>;
    if (logs.length >= 20) {
      for (let i = 0; i < 20; i++) {
        log = logs[i]!;
        // id: 15000197
        let map = log.event.map ? `- ${log.event.map}` : '';
        let result = log.battle.result ? `| ${log.battle.result}` : '';
        content += `${log.battle.mode} ${map} | ${log.battleTime.toUTCString()} ${result}\n`;
      }

      let modeList: string[] = [...new Set(logs.map(item => item.battle.mode))];
      let averages: {[k: string]: number} = {};
      modeList.forEach(mode => {
        let counter: number = 0;
        let num: number = 0;

        logs.forEach(log => {
          /* showdown (soloShowdown, duoShowdown) no tiene battle.duration */
          if (log.battle.mode == mode && log.battle.duration) {
            counter++;
            num += log.battle.duration
          }
        })

        if (counter != 0) {
          averages[mode] = Math.round(num / counter);
        }
      })

      console.log(modeList)
      console.log(averages)
    }

    const embed = new Embed()
    .setDescription(content)

    ctx.editOrReply({ embeds: [embed] });
  }
}
