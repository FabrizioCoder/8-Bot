import type { $Fetch } from "ofetch";
import type { BrawlerListResponse, Brawler } from "../types/brawlers";

export class BrawlersApi {
	private readonly $fetch: $Fetch;

	public constructor($fetch: $Fetch) {
		this.$fetch = $fetch;
	}

	public async getAll(limit?: number) {
		const { items } = await this.$fetch<BrawlerListResponse>("/brawlers", {
			...(limit && { query: { limit } }),
		});
		return items;
	}

	public async get(id: number) {
		return this.$fetch<Brawler>(`/brawlers/${id}`);
	}
}
