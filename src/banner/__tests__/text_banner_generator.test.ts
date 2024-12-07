import { test, describe, beforeAll } from "bun:test";
import { initializeLastFmApi } from "../../lastfm/api";
import { generateTextBanner } from "../text_banner_generator";

describe("text_banner_generator", () => {
	beforeAll(() => {
		initializeLastFmApi(process.env.API_KEY!);
	});

	test("creates simple banner", async () => {
		const tracks = await Bun.file('src/banner/__tests__/mock-tracks.json').json();
		// const tracks = await getTopTracks({ user: 'alator21' });

		const banner = await generateTextBanner({ tracks: tracks.toptracks.track, style: 'default' });
		console.log(banner);
	});

	test("creates experimental banner", async () => {
		const tracks = await Bun.file('src/banner/__tests__/mock-tracks.json').json();
		// const tracks = await getTopTracks({ user: 'alator21' });

		const banner = await generateTextBanner({ tracks: tracks.toptracks.track, style: 'experimental' });
		console.log(banner);
	});

});

