import type { GetTopTracksResponse } from "../lastfm/user/getTopTracks";

type Track = GetTopTracksResponse['toptracks']['track'][0];
type GenerateTextBannerRequest = {
	tracks: Array<Track>;
	style: 'default' | 'experimental';
};


/**
 * returns the top tracks of the week in markdown format
 */
export async function generateTextBanner(request: GenerateTextBannerRequest): Promise<string> {
	const { tracks: allTracks, style } = request;
	const tracks = allTracks.slice(0, 5);
	if (style === 'default') {
		return defaultStyle(tracks);
	}
	return experimentalStyle(tracks);
}


async function defaultStyle(tracks: Array<Track>): Promise<string> {
	let formattedText = `## My top tracks this week!\n`;

	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		const index = i + 1;
		formattedText += `${index}. **${track.name}** by **${track.artist.name}** played **${track.playcount}** times\n`;
	}

	return formattedText;
}
async function experimentalStyle(tracks: Array<Track>): Promise<string> {
	throw new Error(`not implemented yet`);
}

