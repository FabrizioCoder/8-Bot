import {
  type CommandContext,
  Declare,
  SubCommand,
  Options,
  createStringOption,
  OKFunction,
  Embed,
} from 'seyfert';
import { BasicPlayer, Battlelog, Player } from '../../package';
import { Colors, formattedGameModes } from '../../utils/constants';
import { capitalizeString, getIcon, rawEmote } from '../../utils/functions';
import { formatTag } from '../../package/functions';

const cmd = {
  name: 'last',
  description: 'Get information about a player last battle log by player tag.',
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

    let player: Player;
    try {
      player = await ctx.client.api.players.get(tag);
    } catch (e) {
      return ctx.editOrReply({
        content: '⚠️ Player not found. Please check the tag and try again.',
      });
    }

    let logs: Battlelog[];
    try {
      logs = await ctx.client.api.players.getBattleLog(tag);
    } catch (e) {
      return ctx.editOrReply({
        content: '⚠️ This player has no battle logs.',
      });
    }

    const icon = getIcon(player.icon.id)!;

    const baseEmbed = new Embed()
      .setColor(Colors.DodgerBlue)
      .setImage('attachment://battlelog.png')
      .setAuthor({
        name: player.tag,
        url: `https://brawlify.com/stats/profile/${formatTag(player.tag)}`,
      })
      .setTitle(`Battle Log for ${player.name}`)
      .setThumbnail(icon.imageUrl);

    const selectLog = logs[0]!;
    // console.log(selectLog.battle.teams);
    const content = this.getContent(selectLog, player);

    baseEmbed
      .setTitle(`Last Battle for ${player.name}`)
      .setColor((this.isWinner(selectLog) ? 0x32cd32 : 0xf74545) ?? 0xff9900)
      .addFields(
        typeof content === 'string'
          ? [{ name: 'Players', value: content }]
          : [
              {
                name: '> Team 1',
                value: content.teamOne,
                inline: true,
              },
              {
                name: '> Team 2',
                value: content.teamTwo,
                inline: true,
              },
            ]
      )
      .setTitle(this.getTitle(selectLog))
      .setDescription(`<t:${selectLog.battleTime.getTime() / 1000}:f>`);

    return ctx.editOrReply({
      embeds: [baseEmbed],
    });
  }

  private getContent(log: Battlelog, selfPlayer: Player) {
    const { battle } = log;
    const teams = battle.teams!;
    const players = <BasicPlayer[]>[];

    if (!teams) {
      for (const player of battle.players!) {
        players.push(player);
      }

      return players
        .map((player, i) => {
          const isSelf = player.tag === selfPlayer.tag;
          const brawler = player.brawler!;
          const emoji = rawEmote(brawler.id.toString())!;
          const formattedBrawler = `${emoji} ${capitalizeString(
            brawler.name.toLowerCase()
          )}`;

          return `\`${rank[i+1]}.\` ${formattedBrawler} - ${
            isSelf ? `**${player.name}**` : `${player.name}`
          }`;
        })
        .join('\n');
    }

    let teamOne = [];
    let teamTwo = [];

    for (const shard of teams) {
      for (const player of shard) {
        if (teamOne.length < 3) {
          teamOne.push(player);
        } else {
          teamTwo.push(player);
        }
      }
    }

    const teamOneContent = teamOne
      .map((player) => {
        const isSelf = player.tag === selfPlayer.tag;
        const brawler = player.brawler!;
        const emoji = rawEmote(brawler.id.toString())!;
        const formattedBrawler = `${emoji} ${capitalizeString(
          brawler.name.toLowerCase()
        )}`;

        return `${formattedBrawler} - ${
          isSelf ? `**${player.name}**` : `${player.name}`
        }`;
      })
      .join('\n');

    const teamTwoContent = teamTwo
      .map((player) => {
        const isSelf = player.tag === selfPlayer.tag;
        const brawler = player.brawler!;
        const emoji = rawEmote(brawler.id.toString())!;
        const formattedBrawler = `${emoji} ${capitalizeString(
          brawler.name.toLowerCase()
        )}`;

        return `${formattedBrawler} - ${
          isSelf ? `**${player.name}**` : `${player.name}`
        }`;
      })
      .join('\n');

    return {
      teamOne: teamOneContent,
      teamTwo: teamTwoContent,
    };
  }

  private isWinner(log: Battlelog) {
    const { result } = log.battle;

    return result === 'victory' ? true : result === 'defeat' ? false : null;
  }

  private getTitle(log: Battlelog) {
    const { battle } = log;

    const result = battle.result
      ? battle.result === 'victory'
        ? 'Victory'
        : battle.result === 'defeat'
        ? 'Defeat'
        : 'Draw'
      : log.battle.rank
      ? `${rank[log.battle.rank.toString()!]}`
      : '🔹';

    const mode =
      formattedGameModes[log.battle.mode as keyof typeof formattedGameModes] ??
      log.battle.mode;

    const trophies = battle.trophyChange
      ? Math.sign(battle.trophyChange)
        ? ` (+${battle.trophyChange})`
        : ` (${battle.trophyChange})`
      : '';

    return `${result}${trophies} - ${mode} - ${capitalizeString(
      log.battle.type
    )}`;
  }
}
const rank: { [key: string]: string } = {
  1: 'Rank 1',
  2: 'Rank 2',
  3: 'Rank 3',
  4: 'Rank 4',
  5: 'Rank 5',
  6: 'Rank 6',
  7: 'Rank 7',
  8: 'Rank 8',
  9: 'Rank 9',
  10: 'Rank 10',
};
