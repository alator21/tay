import { test, describe, beforeAll } from "bun:test";
import { getTopTracks } from "../getTopTracks";
import { initializeLastFmApi } from "../../api";

describe("getTopTracks", () => {
	beforeAll(() => {
		initializeLastFmApi(process.env.API_KEY!);
	});

	test("fetches succsefully", async () => {
		await getTopTracks({
			user: 'alator21'
		});
	});

	test.skip('Saves result to file', async () => {
		const tracks = await getTopTracks({
			user: 'alator21'
		});

		await Bun.write('src/test-data/user/getTopTracks.json', JSON.stringify(tracks));
	});

});
