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
	style: 'default' | 'style2' | 'style3' | 'style4' | 'style5';
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
	switch (style) {
		case 'default': return defaultStyle(tracks, period);
		case "style2": return style2(tracks, period);
		case "style3": return style3(tracks, period);
		case "style4": return style4(tracks, period);
		case "style5": return style5(tracks, period);
	}
}

async function defaultStyle(tracks: GenerateImageBannerRequest['tracks'], period: Period): Promise<Buffer> {
	const width = 900;
	const height = 400;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Set background gradient
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, '#1e3a8a');
	gradient.addColorStop(1, '#3b82f6');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Add some decorative elements
	ctx.beginPath();
	ctx.moveTo(0, height);
	ctx.lineTo(width * 0.3, height * 0.7);
	ctx.lineTo(width * 0.7, height * 0.5);
	ctx.lineTo(width, height * 0.8);
	ctx.lineTo(width, height);
	ctx.closePath();
	ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.fill();

	// Set text styles
	ctx.fillStyle = '#ffffff';
	ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
	ctx.shadowBlur = 5;
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	// Draw title
	ctx.font = 'bold 36px Arial';
	ctx.fillText(constructHeader(period), 30, 50);

	// Draw track information and artist images
	ctx.font = '18px Arial';
	for (let i = 0; i < tracks.length; i++) {
		const { name, playcount, artist } = tracks[i];
		const y = 100 + i * 60;

		ctx.save();
		// Draw artist image or placeholder
		ctx.beginPath();
		ctx.arc(60, y + 20, 25, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		if (artist.imageUrl !== undefined) {
			try {
				const img = await loadImage(artist.imageUrl);
				ctx.drawImage(img, 35, y - 5, 50, 50);
			} catch (error) {
				console.error(`Failed to load image for ${artist.name}:`, error);
				ctx.fillStyle = '#cccccc';
				ctx.fillRect(35, y - 5, 50, 50);
			}
		} else {
			ctx.fillStyle = '#cccccc';
			ctx.fillRect(35, y - 5, 50, 50);
		}

		ctx.restore();

		// Draw track information
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 18px Arial';
		ctx.fillText(`${i + 1}. ${name}`, 100, y + 15);
		ctx.font = '16px Arial';
		ctx.fillText(`by ${artist.name}`, 100, y + 35);

		// Draw playcount
		ctx.fillStyle = '#fbbf24';
		ctx.font = 'bold 16px Arial';
		ctx.fillText(`${playcount} plays`, width - 120, y + 25);
	}

	// Add a subtle border
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.lineWidth = 2;
	ctx.strokeRect(10, 10, width - 20, height - 20);

	return canvas.toBuffer('image/png');
}

async function style2(tracks: GenerateImageBannerRequest['tracks'], period: Period): Promise<Buffer> {
	const width = 1000;
	const height = 500;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create a dynamic background
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, '#8E2DE2');
	gradient.addColorStop(1, '#4A00E0');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Add some abstract shapes
	ctx.beginPath();
	ctx.moveTo(0, height);
	ctx.bezierCurveTo(width / 3, height * 0.7, width * 0.6, height * 0.8, width, height * 0.4);
	ctx.lineTo(width, height);
	ctx.closePath();
	ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
	ctx.fill();

	// Draw title
	ctx.font = 'bold 48px Arial';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.fillText(constructHeader(period), width / 2, 60);

	// Draw track information and artist images
	ctx.textAlign = 'left';
	for (let i = 0; i < tracks.length; i++) {
		const { name, playcount, artist } = tracks[i];
		const x = i % 2 === 0 ? 50 : width / 2 + 50;
		const y = 140 + Math.floor(i / 2) * 120;

		// Draw artist image or placeholder
		ctx.save();
		ctx.beginPath();
		ctx.arc(x + 30, y + 30, 30, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		if (artist.imageUrl !== undefined) {
			try {
				const img = await loadImage(artist.imageUrl);
				ctx.drawImage(img, x, y, 60, 60);
			} catch (error) {
				console.error(`Failed to load image for ${artist.name}:`, error);
				ctx.fillStyle = '#cccccc';
				ctx.fillRect(x, y, 60, 60);
			}
		} else {
			ctx.fillStyle = '#cccccc';
			ctx.fillRect(x, y, 60, 60);
		}
		ctx.restore();

		// Draw track information
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 20px Arial';
		ctx.fillText(name, x + 70, y + 25);
		ctx.font = '16px Arial';
		ctx.fillText(artist.name, x + 70, y + 45);

		// Draw playcount
		ctx.fillStyle = '#FFD700';
		ctx.font = 'bold 16px Arial';
		ctx.fillText(`${playcount} plays`, x + 70, y + 65);
	}

	// Add a subtle border
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
	ctx.lineWidth = 4;
	ctx.strokeRect(10, 10, width - 20, height - 20);

	return canvas.toBuffer('image/png');

}
async function style3(tracks: GenerateImageBannerRequest['tracks'], period: Period): Promise<Buffer> {
	const width = 1200;
	const height = 300;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Create a sleek background
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, '#2c3e50');
	gradient.addColorStop(1, '#34495e');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Add some decorative elements
	ctx.beginPath();
	ctx.moveTo(0, height);
	ctx.lineTo(width * 0.3, 0);
	ctx.lineTo(width * 0.7, height * 0.5);
	ctx.lineTo(width, 0);
	ctx.closePath();
	ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
	ctx.fill();

	// Draw title
	ctx.font = 'bold 36px Arial';
	ctx.fillStyle = '#ecf0f1';
	ctx.textAlign = 'left';
	ctx.fillText(constructHeader(period), 30, 50);

	// Draw track information and artist images horizontally
	const startX = 30;
	const startY = 100;
	const itemWidth = 220;
	const itemHeight = 160;

	for (let i = 0; i < Math.min(tracks.length, 5); i++) {
		const { name, playcount, artist } = tracks[i];
		const x = startX + i * itemWidth;

		// Draw background for each item
		ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.fillRect(x, startY, itemWidth - 10, itemHeight);

		// Draw artist image or placeholder
		ctx.save();
		ctx.beginPath();
		ctx.arc(x + itemWidth / 2, startY + 40, 30, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		if (artist.imageUrl !== undefined) {
			try {
				const img = await loadImage(artist.imageUrl);
				ctx.drawImage(img, x + itemWidth / 2 - 30, startY + 10, 60, 60);
			} catch (error) {
				console.error(`Failed to load image for ${artist.name}:`, error);
				ctx.fillStyle = '#95a5a6';
				ctx.fillRect(x + itemWidth / 2 - 30, startY + 10, 60, 60);
			}
		} else {
			ctx.fillStyle = '#95a5a6';
			ctx.fillRect(x + itemWidth / 2 - 30, startY + 10, 60, 60);
		}
		ctx.restore();

		// Draw track information
		ctx.fillStyle = '#ecf0f1';
		ctx.font = 'bold 16px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(name.length > 20 ? name.slice(0, 17) + '...' : name, x + itemWidth / 2, startY + 90);
		ctx.font = '14px Arial';
		ctx.fillText(artist.name.length > 20 ? artist.name.slice(0, 17) + '...' : artist.name, x + itemWidth / 2, startY + 110);

		// Draw playcount and rank
		ctx.fillStyle = '#f39c12';
		ctx.font = 'bold 14px Arial';
		ctx.fillText(`${playcount} plays`, x + itemWidth / 2, startY + 130);
		ctx.fillStyle = '#e74c3c';
		ctx.font = 'bold 24px Arial';
		ctx.fillText(`#${i + 1}`, x + itemWidth / 2, startY + 155);
	}

	// Add a subtle border
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
	ctx.lineWidth = 2;
	ctx.strokeRect(5, 5, width - 10, height - 10);

	return canvas.toBuffer('image/png');

}
async function style4(tracks: GenerateImageBannerRequest['tracks'], period: Period): Promise<Buffer> {
	const width = 500;
	const height = 500;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Set background
	const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
	gradient.addColorStop(0, '#FF6B6B');
	gradient.addColorStop(0.5, '#4ECDC4');
	gradient.addColorStop(1, '#45B7D1');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Draw circular paths
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
	ctx.lineWidth = 1;
	for (let i = 0; i < 5; i++) {
		ctx.beginPath();
		ctx.arc(width / 2, height / 2, 50 + i * 40, 0, Math.PI * 2);
		ctx.stroke();
	}

	// Draw title
	ctx.font = 'bold 20px Arial';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.fillText(constructHeader(period), width / 2, 40);

	// Draw track information
	for (let i = 0; i < Math.min(tracks.length, 5); i++) {
		const { name, playcount, artist } = tracks[i];
		const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
		const radius = 150;
		const x = width / 2 + Math.cos(angle) * radius;
		const y = height / 2 + Math.sin(angle) * radius;

		// Draw artist image or placeholder
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, 25, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();

		if (artist.imageUrl) {
			try {
				const img = await loadImage(artist.imageUrl);
				ctx.drawImage(img, x - 25, y - 25, 50, 50);
			} catch (error) {
				console.error(`Failed to load image for ${artist.name}:`, error);
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(x - 25, y - 25, 50, 50);
			}
		} else {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(x - 25, y - 25, 50, 50);
		}
		ctx.restore();

		// Draw track information
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 10px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(name.length > 20 ? name.slice(0, 17) + '...' : name, x, y + 35);
		ctx.font = '8px Arial';
		ctx.fillText(artist.name.length > 20 ? artist.name.slice(0, 17) + '...' : artist.name, x, y + 45);

		// Draw playcount and rank
		ctx.fillStyle = '#FFD700';
		ctx.font = 'bold 8px Arial';
		ctx.fillText(`${playcount} plays`, x, y + 55);
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 15px Arial';
		ctx.fillText(`#${i + 1}`, x, y - 35);
	}

	// Add a decorative center circle
	ctx.beginPath();
	ctx.arc(width / 2, height / 2, 40, 0, Math.PI * 2);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
	ctx.fill();

	// Add music note icon in the center
	ctx.fillStyle = '#ffffff';
	ctx.font = '30px Arial';
	ctx.fillText('♫', width / 2, height / 2 + 10);

	return canvas.toBuffer('image/png');
}
async function style5(tracks: GenerateImageBannerRequest['tracks'], period: Period): Promise<Buffer> {
	const width = 800;
	const height = 600;
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Funky background
	const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, '#ff6b6b');
	gradient.addColorStop(1, '#4ecdc4');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	// Funky circles
	const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
	for (let i = 0; i < 20; i++) {
		ctx.beginPath();
		ctx.arc(
			Math.random() * width,
			Math.random() * height,
			Math.random() * 50 + 10,
			0,
			Math.PI * 2
		);
		ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
		ctx.globalAlpha = 0.6;
		ctx.fill();
	}
	ctx.globalAlpha = 1;


	// Draw tracks
	for (let i = 0; i < Math.min(tracks.length, 5); i++) {
		const { name, artist, playcount } = tracks[i];
		const angle = (i / 5) * Math.PI * 2;
		const x = width / 2 + Math.cos(angle) * 200;
		const y = height / 2 + Math.sin(angle) * 150;

		// Funky track background
		ctx.beginPath();
		ctx.moveTo(x, y - 60);
		for (let j = 1; j < 6; j++) {
			const angleStar = (j / 5) * Math.PI * 2;
			const radiusStar = j % 2 === 0 ? 70 : 40;
			ctx.lineTo(
				x + Math.cos(angleStar) * radiusStar,
				y - 60 + Math.sin(angleStar) * radiusStar
			);
		}
		ctx.closePath();
		ctx.fillStyle = colors[i];
		ctx.fill();

		// Track info
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 18px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`#${i + 1}`, x, y - 80);
		ctx.fillText(`${name}`, x, y - 40);
		ctx.font = '14px Arial';
		ctx.fillText(artist.name, x, y - 15);
		ctx.font = '12px Arial';
		ctx.fillText(`${playcount} plays`, x, y + 10);

		// Try to load and draw artist image
		try {
			if (artist.imageUrl) {
				const img = await loadImage(artist.imageUrl);
				ctx.save();
				ctx.beginPath();
				ctx.arc(x, y + 50, 30, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(img, x - 30, y + 20, 60, 60);
				ctx.restore();
			}
		} catch (error) {
			console.error(`Failed to load image for ${artist.name}:`, error);
		}
	}

	// Funky title
	ctx.font = 'bold 40px Arial';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.fillText(constructHeader(period), width / 2, 60);


	return canvas.toBuffer('image/png');
}

