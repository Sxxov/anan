import { Factory, Item } from '../blocks/item.js';
import fetch from 'node-fetch';

export interface Urls {
	raw: string;
	full: string;
	regular: string;
	small: string;
	thumb: string;
}

export interface Links {
	self: string;
	html: string;
	download: string;
	download_location: string;
}

export interface Links2 {
	self: string;
	html: string;
	photos: string;
	likes: string;
	portfolio: string;
	following: string;
	followers: string;
}

export interface ProfileImage {
	small: string;
	medium: string;
	large: string;
}

export interface User {
	id: string;
	updated_at: Date;
	username: string;
	name: string;
	first_name: string;
	last_name: string;
	twitter_username?: any;
	portfolio_url: string;
	bio?: any;
	location?: any;
	links: Links2;
	profile_image: ProfileImage;
	instagram_username?: any;
	total_collections: number;
	total_likes: number;
	total_photos: number;
	accepted_tos: boolean;
	for_hire: boolean;
}

export interface Exif {
	make: string;
	model: string;
	exposure_time: string;
	aperture: string;
	focal_length: string;
	iso: number;
}

export interface Position {
	latitude: number;
	longitude: number;
}

export interface Location {
	title: string;
	name: string;
	city: string;
	country: string;
	position: Position;
}

export interface UnsplashImgResponse {
	id: string;
	created_at: Date;
	updated_at: Date;
	promoted_at: Date;
	width: number;
	height: number;
	color: string;
	blur_hash: string;
	description: string;
	alt_description: string;
	urls: Urls;
	links: Links;
	categories: any[];
	likes: number;
	liked_by_user: boolean;
	current_user_collections: any[];
	sponsorship?: any;
	user: User;
	exif: Exif;
	location: Location;
	views: number;
	downloads: number;
}

export class RandomImageItem extends Item {
	url!: UnsplashImgResponse['urls']['full'];
}

export class RandomImageItemFactory extends Factory<Item> {
	constructor(private unsplashAccessKey: string) {
		super();
	}

	public async create() {
		try {
			return RandomImageItem.from({
				url: (
					(
						await (
							await fetch(`https://api.unsplash.com/photos/random?client_id=${this.unsplashAccessKey}`)
						).json()
					) as UnsplashImgResponse
				)?.urls?.full,
			});
		} catch (_: unknown) {
			return RandomImageItem.from({
				url: 'null',
			});
		}
	}
}
