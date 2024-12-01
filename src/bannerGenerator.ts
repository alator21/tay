import { createCanvas } from '@napi-rs/canvas';
import type { TrackSchema } from './LastFmApi';

/**
 * This function generates a banner based on the tracks provided.
 */
export async function generateBanner(tracks: Array<TrackSchema>): Promise<Buffer> {
	const canvas = createCanvas(800, 400);
	const ctx = canvas.getContext('2d');

	// Create a gradient background
	const gradient = ctx.createLinearGradient(0, 0, 0, 400);
	gradient.addColorStop(0, '#1DB954'); // Top color
	gradient.addColorStop(1, '#191414'); // Bottom color
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 800, 400);

	// Add title with improved font style
	ctx.font = 'bold 36px "Arial Black"';
	ctx.fillStyle = 'white';
	ctx.textAlign = 'center';
	ctx.fillText('My Top Tracks This Week', canvas.width / 2, 50);

	// List top tracks with better spacing and alignment
	ctx.font = '20px Arial';
	ctx.fillStyle = 'white';

	tracks.slice(0, 5).forEach((track, index) => {
		ctx.fillText(`${index + 1}. ${track.name} - ${track.artist.name}`, canvas.width / 2, 100 + index * 40);
	});

	// Draw a border around the banner
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 5;
	ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

	return canvas.toBuffer('image/png');
}
