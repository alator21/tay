import type { GetTopTracksResponse } from "@alator21/lastfm";
import { pluralize } from "../internal/pluralize";

type Period = '7day';
type Track = GetTopTracksResponse['toptracks']['track'][0];
type GenerateTextBannerRequest = {
	tracks: Array<Track>;
	period: Period;
	style: 'default' | 'experimental';
};

function constructHeader(period: Period): string {
	if (period === '7day') {
		return '## My top tracks last week!\n';
	}
	throw new Error(`Not supported period ${period}`);
};


/**
 * returns the top tracks of the week in markdown format
 */
export async function generateTextBanner(request: GenerateTextBannerRequest): Promise<string> {
	const { tracks: allTracks, period, style } = request;
	const tracks = allTracks.slice(0, 5);
	if (style === 'default') {
		return defaultStyle(tracks, period);
	}
	return experimentalStyle(tracks);
}


async function defaultStyle(tracks: Array<Track>, period: Period): Promise<string> {
	let formattedText = constructHeader(period);

	for (let i = 0; i < tracks.length; i++) {
		const track = tracks[i];
		const index = i + 1;
		formattedText += `${index}. **${track.name}** by **${track.artist.name}** played **${track.playcount}** ${pluralize(track.playcount, 'time', 'times')}\n`;
	}

	return formattedText;
}
async function experimentalStyle(tracks: Array<Track>): Promise<string> {
	throw new Error(`not implemented yet`);
}

