import type { $Fetch } from 'ofetch';
import type { RankingsPlayer } from '../../types/players';
import type { CountryCodes } from '../../types/rankings';

export class PlayerRankingsEndpoint {
  public constructor(private readonly $fetch: $Fetch) {
    this.$fetch = $fetch;
  }

  public async get(countryCode: CountryCodes, limit = 10) {
    return this.$fetch(`/rankings/${countryCode}/players`, {
      query: {
        limit,
      },
    }).then<RankingsPlayer[]>((res) => res.items);
  }
}
