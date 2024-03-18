import type { $Fetch } from 'ofetch';
import type { Battlelog, BattlelogsResponse } from '../types/battlelogs';
import type { Player } from '../types/players';
import { convertApiDate, formatTag } from '../../functions';

export class PlayersApi {
  private readonly $fetch: $Fetch;

  public constructor($fetch: $Fetch) {
    this.$fetch = $fetch;
  }

  public async get(tag: string) {
    return this.$fetch<Player>(
      `/players/${encodeURIComponent(formatTag(tag))}`
    );
  }

  public async getBattleLog(tag: string): Promise<Battlelog[]> {
    const { items } = await this.$fetch<BattlelogsResponse<string>>(
      `/players/${encodeURIComponent(formatTag(tag))}/battlelog`
    );
    return items.map((item) => ({
      ...item,
      battleTime: convertApiDate(item.battleTime),
    }));
  }
}
