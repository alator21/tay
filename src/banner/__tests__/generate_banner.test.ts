import { test, describe, beforeAll } from "bun:test";
import { initializeLastFmApi } from "../../lastfm/api";
import { generateBanner } from "../generate_banner";

describe("generate_banner", () => {
	beforeAll(() => {
		initializeLastFmApi(process.env.API_KEY!);
	});

	test("fetches succsefully", async () => {
		const tracks = await Bun.file('src/banner/__tests__/mock-tracks.json').json();

		const banner = await generateBanner({ tracks: tracks.toptracks.track, style: 'default' });
		Bun.write('top_tracks_banner.png', banner);
	});

});

