import type { StarPower, Gadget } from "./powers";

export interface Brawler {
	gadgets: Gadget[];
	id: number;
	name: string;
	starPowers: StarPower[];
}

export interface BasicBrawler {
	id: number;
	name: string;
	power: number;
	trophies: number;
}

export interface BrawlerListResponse {
	list: BABrawler[];
}

// Brawl API
export interface BABrawler {
	id: number
	avatarId: number
	name: string
	hash: string
	path: string
	released: boolean
	version: number
	link: string
	imageUrl: string
	imageUrl2: string
	imageUrl3: string
	class: Class
	rarity: Rarity
	unlock: any
	description: string
	starPowers: BAStarPower[]
	gadgets: BAGadget[]
	videos: Video[]
  }
  
  export interface Class {
	id: number
	name: string
  }
  
  export interface Rarity {
	id: number
	name: string
	color: string
  }
  
  export interface BAStarPower {
	id: number
	name: string
	path: string
	version: number
	description: string
	imageUrl: string
	released: boolean
  }
  
  export interface BAGadget {
	id: number
	name: string
	path: string
	version: number
	description: string
	imageUrl: string
	released: boolean
  }
  
  export interface Video {
	type: number
	name: string
	description: string
	duration: string
	videoUrl: string
	previewUrl: string
	uploadDate: string
  }
  