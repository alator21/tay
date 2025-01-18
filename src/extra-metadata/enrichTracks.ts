import type { IRelation } from "musicbrainz-api";
import { getApi } from "../musicbrainz/api";
import { z } from "zod";
import type { GetTopTracksResponse } from "@alator21/lastfm";

// exported only for testing
export const ARTIST_IMAGE_CACHE: Map<string, string> = new Map();

export async function enrichTracks(tracks: GetTopTracksResponse['toptracks']['track']) {
	const enrichedTracks = [];
	for (const track of tracks) {
		let imageUrl = ARTIST_IMAGE_CACHE.get(track.artist.mbid);
		if (imageUrl === undefined) {
			imageUrl = await getArtistImageUrl(track.artist.mbid);
			if (imageUrl !== undefined) {
				ARTIST_IMAGE_CACHE.set(track.artist.mbid, imageUrl);
			}
		}
		enrichedTracks.push({
			name: track.name,
			playcount: track.playcount,
			artist: {
				name: track.artist.name,
				imageUrl
			}
		});
	}
	return enrichedTracks;
}

async function getArtistImageUrl(artistMbid: string): Promise<string | undefined> {
	const musicBrainzApi = getApi();
	const artist = await musicBrainzApi.lookup('artist', artistMbid, ['url-rels']);
	const relations = artist.relations;
	if (relations === undefined) {
		console.warn(`Could not find artist relations`);
		return undefined
	}
	const wikidataResourceId = getWikidataResourceId(relations);
	if (wikidataResourceId === undefined) {
		console.warn(`Could not find wikidata resource for artist ${artistMbid}`);
		return undefined;
	}
	const imageName = await getArtistImageName(wikidataResourceId);
	return `https://commons.wikimedia.org/wiki/Special:FilePath/${imageName}`
}

function getWikidataResourceId(relations: IRelation[]): string | undefined {
	for (const relation of relations) {
		if (relation.type !== 'wikidata') { continue; }
		const url = relation.url;
		if (url === undefined) { continue; }
		const wikidataId = url.resource.split('/').pop();
		if (wikidataId === undefined) {
			console.warn(`Could not find wikidataId`);
			return undefined;
		}
		return wikidataId;
	}
	return undefined;
}


async function getArtistImageName(wikidataResourceId: string): Promise<string | undefined> {
	function constructUrl(): URL {
		const url = new URL(`https://www.wikidata.org/w/api.php`);
		url.searchParams.set(`action`, `wbgetentities`);
		url.searchParams.set(`ids`, wikidataResourceId);
		url.searchParams.set(`format`, `json`);
		url.searchParams.set(`props`, `claims`);
		return url;
	}
	const response = await fetch(constructUrl());
	if (!response.ok) {
		throw new Error(`Could not find wikidata resource ${wikidataResourceId}`);
	}
	const data = await response.json();
	const parsed = WikidataImageSchema.parse(data);
	const imageName = parsed.entities[wikidataResourceId]?.claims.P18?.[0]?.mainsnak.datavalue.value;
	if (imageName === undefined) { throw new Error(`Could not find image`); }
	return imageName;
}

const WikidataImageSchema = z.object({
	entities: z.record(z.string(), z.object({
		claims: z.object({
			P18: z.array(z.object({
				mainsnak: z.object({
					snaktype: z.string(),
					property: z.string(),
					datavalue: z.object({
						value: z.string(),
						type: z.string(),
					}),
					datatype: z.string(),
				}),
				type: z.string(),
				id: z.string(),
				rank: z.string(),
			})).optional(),
		}),
	})),
});

type WikidataImageResponse = z.infer<typeof WikidataImageSchema>;
