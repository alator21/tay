import { test, describe, beforeAll } from "bun:test";
import { initializeLastFmApi } from "../../lastfm/api";
import { generateImageBanner } from "../image_banner_generator";
import { initializeMusicBrainzApi } from "../../musicbrainz/api";
import { getTopTracks } from "../../lastfm/user/getTopTracks";
import { ARTIST_IMAGE_CACHE, enrichTracks } from "../../extra-metadata/enrichTracks";

describe("image_banner_generator", () => {
	beforeAll(() => {
		initializeLastFmApi(process.env.API_KEY!);
		initializeMusicBrainzApi({
			appName: 'alator21-tay',
			appVersion: '0.0.1',
			appContactInfo: 'botazz133@gmail.com'
		})
	});

	test("creates simple banner", async () => {
		const tracks = await getMockTracks();
		// const tracks = await getRealTracks();
		const enrichedTracks = await enrichTracks(tracks);

		const banner = await generateImageBanner({ tracks: enrichedTracks, style: 'default', period: '7day' });
		Bun.write('top_tracks_banner.png', banner);
		// console.log(banner);
	});

	test.skip("creates experimental banner", async () => {
		const tracks = await Bun.file('src/banner/__tests__/mock-tracks.json').json();
		// const tracks = await getTopTracks({ user: 'alator21' });

		const banner = await generateImageBanner({ tracks: tracks.toptracks.track, period: '7day', style: 'experimental' });
		console.log(banner);
	});


	async function getRealTracks() {
		return (await getTopTracks({ user: 'alator21' })).toptracks.track.slice(0, 5);
	}

	async function getMockTracks() {
		ARTIST_IMAGE_CACHE.set('1882fe91-cdd9-49c9-9956-8e06a3810bd4', 'https://commons.wikimedia.org/wiki/Special:FilePath/Sabrina Carpenter @ Wiltern 10 15 2022 (52525895421) (cropped) (cropped).jpg');
		ARTIST_IMAGE_CACHE.set('6925db17-f35e-42f3-a4eb-84ee6bf5d4b0', 'https://commons.wikimedia.org/wiki/Special:FilePath/Olivia Rodrigo with Dr Fauci 1.png');
		ARTIST_IMAGE_CACHE.set('f59c5520-5f46-4d2c-b2c4-822eabf53419', 'https://commons.wikimedia.org/wiki/Special:FilePath/Linkin Park - From Zero Lead Press Photo - James Minchin III.jpg');
		ARTIST_IMAGE_CACHE.set('56a55378-f155-48de-80a5-d80104221267', 'https://commons.wikimedia.org/wiki/Special:FilePath/Chappell Roan @ Hollywood Palladium 11 18 2022 (53886572991).jpg');
		return (await Bun.file('src/test-data/user/getTopTracks.json').json()).toptracks.track.slice(0, 5);
	}
});

