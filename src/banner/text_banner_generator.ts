import type { GetTopTracksResponse } from "../lastfm/user/getTopTracks";

type GenerateTextBannerRequest = {
	tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>;
	style: 'default' | 'experimental';
};


/**
 * returns the top tracks of the week in text format
 */
export async function generateTextBanner(request: GenerateTextBannerRequest): Promise<string> {
	const { tracks, style } = request;
	if (style === 'default') {
		return defaultStyle(tracks.slice(0, 5));
	}
	return experimentalStyle(tracks);
}


async function defaultStyle(tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>): Promise<string> {
	let formattedText = `My top tracks this week!\n`;
	formattedText += `-------------------------------\n`;

	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		const index = i + 1;
		formattedText += `${index} - ${track.name} by ${track.artist.name} played ${track.playcount} times\n`;
	}

	return formattedText;
}
async function experimentalStyle(tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>): Promise<string> {
	throw new Error(`not implemented yet`);
}

