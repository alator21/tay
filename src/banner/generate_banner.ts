import { Canvas, createCanvas, type SKRSContext2D } from '@napi-rs/canvas';
import type { GetTopTracksResponse } from '../lastfm/user/getTopTracks';


type GenerateBannerRequest = {
	tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>;
	style: 'default' | 'experimental';
};
/**
 * This function generates a banner based on the tracks provided.
 */
export async function generateBanner(request: GenerateBannerRequest): Promise<Buffer> {
	const { tracks, style } = request;
	const canvas = createCanvas(550, 100);
	const ctx = canvas.getContext('2d');

	if (style === 'default') {
		defaultStyle(ctx, canvas, tracks.slice(0, 5));
	}

	return canvas.toBuffer('image/png');
}

function defaultStyle(ctx: SKRSContext2D, canvas: Canvas, tracks: Array<GetTopTracksResponse['toptracks']['track'][0]>): void {
	// Create a gradient background
	const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
	gradient.addColorStop(0, '#1DB954'); // Left color
	gradient.addColorStop(1, '#191414'); // Right color
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Add title
	ctx.font = 'bold 18px "Arial Black"';
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.fillText('My Top Tracks This Week', canvas.width / 2, 18);

	// Draw boxes for tracks horizontally
	const boxWidth = (canvas.width / 5) - 10;
	const boxHeight = 50;
	const startX = 5;
	const startY = 30;
	const gap = 10;

	tracks.forEach((track, index) => {
		const x = startX + index * (boxWidth + gap);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;
		ctx.strokeRect(x, startY, boxWidth, boxHeight);

		// You can add placeholder text or index here if needed
		ctx.fillStyle = 'white';
		ctx.font = '14px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`#${index + 1}`, x + boxWidth / 2, startY + boxHeight + 18);
	});

}
