import type { $Fetch } from 'ofetch';
import type { BrawlerListResponse, BABrawler } from '../types/brawlers';

export class BrawlersApi {
  private readonly $fetch: $Fetch;

  public constructor($fetch: $Fetch) {
    this.$fetch = $fetch;
  }

  public async getAll(limit?: number) {
    const { list } = await this.$fetch<BrawlerListResponse>('/brawlers', {
      baseURL: 'https://api.brawlapi.com/v1',
      ...(limit && { query: { limit } }),
    });
    return list;
  }

  public async get(id: number) {
    return this.$fetch<BABrawler>(`/brawlers/${id}`, {
      baseURL: 'https://api.brawlapi.com/v1',
    });
  }
}
