import { z } from "zod";
import { getApi } from "../api";

function constructUrl(baseUrl: string, apiKey: string, request: GetTopArtistsRequest): URL {
	const { user, period, limit, page } = request;
	const url = new URL(baseUrl);
	url.searchParams.set(`method`, `user.gettopartists`);
	url.searchParams.set(`format`, `json`);
	url.searchParams.set(`api_key`, apiKey);
	url.searchParams.set(`user`, user);
	period !== undefined && url.searchParams.set(`period`, period);
	page !== undefined && url.searchParams.set(`page`, page.toString(10));
	limit !== undefined && url.searchParams.set(`limit`, limit.toString(10));
	url.searchParams.set(`extended`, '1');
	return url;
}
/**
 * Get top tracks of user.
 */
export async function getTopArtists(request: GetTopArtistsRequest): Promise<GetTopArtistsResponse> {
	const api = getApi();
	const url = constructUrl(api.baseUrl, api.apiKey, request);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return GetTopArtistsResponse.parse(data);
}


export type Period = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

const ImageSchema = z.object({
	'#text': z.string().url(),
	size: z.enum(['small', 'medium', 'large', 'extralarge']),
});

const ArtistSchema = z.object({
	name: z.string(),
	url: z.string().url(),
});
const TrackSchema = z.object({
	name: z.string(),
	playcount: z.string().transform(Number),
	mbid: z.string().optional(),
	url: z.string().url(),
	duration: z.string().transform(Number),
	artist: ArtistSchema,
	image: z.array(ImageSchema),
	'@attr': z.object({
		rank: z.string().transform(Number),
	}),
	streamable: z.object({
		'#text': z.string(),
		fulltrack: z.string(),
	}),
});



type GetTopArtistsRequest = {
	user: string;
	period?: Period;
	limit?: number;
	page?: number;
};

const GetTopArtistsResponse = z.object({
	topartists: z.object({
		artist: z.array(ArtistSchema),
		'@attr': z.object({
			user: z.string(),
			totalPages: z.string().transform(Number),
			page: z.string().transform(Number),
			perPage: z.string().transform(Number),
			total: z.string().transform(Number),
		}),
	}),
});
export type GetTopArtistsResponse = z.infer<typeof GetTopArtistsResponse>;
