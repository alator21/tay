import { MusicBrainzApi } from "musicbrainz-api";

let MUSICBRAINZ_API: MusicBrainzApi | undefined;

/**
 * Initialize the musicbrainz integration.
 */
export function initializeMusicBrainzApi(settings: { appName: string, appVersion: string, appContactInfo: string }) {
	if (isApiInitialized(MUSICBRAINZ_API)) {
		throw new Error('MusicBrainz API is already initialized');
	}
	MUSICBRAINZ_API = new MusicBrainzApi(settings);
}



function isApiInitialized(api: MusicBrainzApi | undefined): api is MusicBrainzApi {
	return api !== undefined;
}

export function getApi(): MusicBrainzApi {
	if (!isApiInitialized(MUSICBRAINZ_API)) {
		throw new Error('You need to initialize the MusicBrainz API.');
	}
	return MUSICBRAINZ_API;
}
