import { z, type ZodTypeAny } from "zod";

type ResponseFormat = 'json' | 'xml';
type Period = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

const ImageSchema: ZodTypeAny = z.object({
	'#text': z.string().url(),
	size: z.enum(['small', 'medium', 'large', 'extralarge']),
});

const ArtistSchema: ZodTypeAny = z.object({
	name: z.string(),
	url: z.string().url(),
});
export const TrackSchema: ZodTypeAny = z.object({
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
export type TrackSchema = z.infer<typeof TrackSchema>;

const TopTracksResponseSchema = z.object({
	toptracks: z.object({
		track: z.array(TrackSchema),
		'@attr': z.object({
			user: z.string(),
			totalPages: z.string().transform(Number),
			page: z.string().transform(Number),
			perPage: z.string().transform(Number),
			total: z.string().transform(Number),
		}),
	}),
});

/**
 * This class provides functionality regarding communicating with Last.fm API and retrieving the top tracks of
 * a period.
 */
export class LastFmApi {
	private static readonly BASE_URL = `https://ws.audioscrobbler.com/2.0`;
	private static readonly RESPONSE_FORMAT: ResponseFormat = `json`;
	constructor(private readonly apiKey: string, private readonly user: string) { }


	async getTopTracks(period: Period = '7day'): Promise<Array<TrackSchema>> {
		const assembleUrl = (baseUrl: string, responseFormat: ResponseFormat, apiKey: string, user: string, period: string) => {
			const url = new URL(baseUrl);
			url.searchParams.set(`method`, `user.gettoptracks`);
			url.searchParams.set(`format`, responseFormat);
			url.searchParams.set(`api_key`, apiKey);
			url.searchParams.set(`user`, user);
			url.searchParams.set(`period`, period);
			url.searchParams.set(`extended`, '1');
			return url;
		};
		const url = assembleUrl(LastFmApi.BASE_URL, LastFmApi.RESPONSE_FORMAT, this.apiKey, this.user, period);
		console.log({ url });
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);
		const validatedData = TopTracksResponseSchema.parse(data);
		return validatedData.toptracks.track;
	}
}

