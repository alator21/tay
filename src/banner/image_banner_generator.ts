import type { Period } from "../lastfm/user/getTopTracks";
import { createCanvas, loadImage } from '@napi-rs/canvas';

type GenerateImageBannerRequest = {
	tracks: Array<{
		name: string;
		playcount: number;
		artist: {
			name: string;
			imageUrl: string | undefined;
		}
	}>;
	style: 'default' | 'experimental';
	period: Period;
};

function constructHeader(period: Period): string {
	if (period === '7day') {
		return 'My top tracks last week!\n';
	}
	throw new Error(`Not supported period ${period}`);
};


/**
 * returns the top tracks of the week in image format 
 */
export async function generateImageBanner(request: GenerateImageBannerRequest): Promise<Buffer> {
	const { tracks, period, style } = request;
	if (style === 'default') {
		return defaultStyle(tracks, period);
	}
	return experimentalStyle(tracks);
}

async function defaultStyle(tracks: GenerateImageBannerRequest['tracks'], period: Period): Promise<Buffer> {
	const width = 800;
	const height = 300;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Set background
	ctx.fillStyle = '#496d89';
	ctx.fillRect(0, 0, width, height);

	// Set text style
	ctx.font = '16px Arial';
	ctx.fillStyle = '#ffffff';

	// Draw title
	ctx.font = 'bold 24px Arial';
	ctx.fillText(constructHeader(period), 20, 40);

	// Draw track information and artist images
	for (let i = 0; i < tracks.length; i++) {
		const { name, playcount, artist } = tracks[i];
		const y = 80 + i * 50;

		if (artist.imageUrl !== undefined) {
			try {
				const img = await loadImage(artist.imageUrl);
				ctx.drawImage(img, 20, y - 20, 40, 40);
			} catch (error) {
				console.error(`Failed to load image for ${artist.name}:`, error);
			}
		}

		// Draw track information
		const text = `${i + 1}. ${name} by ${artist.name}`;
		ctx.fillText(text, 70, y + 10);
	}

	// Add a border
	ctx.strokeStyle = '#ffffff';
	ctx.lineWidth = 4;
	ctx.strokeRect(2, 2, width - 4, height - 4);

	return canvas.toBuffer('image/png');
}
async function experimentalStyle(tracks: GenerateImageBannerRequest['tracks']): Promise<Buffer> {
	throw new Error(`not implemented yet`);
}

