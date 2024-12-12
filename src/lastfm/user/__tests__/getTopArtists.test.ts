import { test, describe, beforeAll } from "bun:test";
import { initializeLastFmApi } from "../../api";
import { getTopArtists } from "../getTopArtists";

describe("getTopArtists", () => {
	beforeAll(() => {
		initializeLastFmApi(process.env.API_KEY!);
	});

	test("fetches succsefully", async () => {
		const topArtists = await getTopArtists({
			user: 'alator21',
			period: 'overall',
			limit: 5
		});
		console.log(JSON.stringify(topArtists, null, 2));
	});

});
