import type { GetTopTracksResponse } from "../lastfm/user/getTopTracks";

type GenerateImageBannerRequest = {
	tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>;
	style: 'default' | 'experimental';
};


/**
 * returns the top tracks of the week in image format - to be created
 */
export async function generateImageBanner(request: GenerateImageBannerRequest): Promise<Buffer> {
	const { tracks, style } = request;
	if (style === 'default') {
		return defaultStyle(tracks.slice(0, 5));
	}
	return experimentalStyle(tracks);
}


async function defaultStyle(tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>): Promise<Buffer> {
	throw new Error(`not implemented yet`);
}
async function experimentalStyle(tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>): Promise<Buffer> {
	throw new Error(`not implemented yet`);
}

