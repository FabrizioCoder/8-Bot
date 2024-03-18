import type { $Fetch } from "ofetch";
import type { Club, ClubGetMembersResponse } from "../types/clubs";
import { formatTag } from '../../functions';

export class ClubsApi {
	private readonly $fetch: $Fetch;

	public constructor($fetch: $Fetch) {
		this.$fetch = $fetch;
	}

	public async get(clubTag: string) {
		return this.$fetch<Club>(`/clubs/${encodeURIComponent(formatTag(clubTag))}`);
	}

	public async getMembers(clubTag: string) {
		const { items: members } = await this.$fetch<ClubGetMembersResponse>(
			`/clubs/${encodeURIComponent(formatTag(clubTag))}/members`
		);
		return members;
	}
}
