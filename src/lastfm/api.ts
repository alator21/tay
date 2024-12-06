const LAST_FM_API: {
	baseUrl: 'https://ws.audioscrobbler.com/2.0';
	apiKey: 'NOT_INITIALIZED' | string & {};
} = {
	baseUrl: 'https://ws.audioscrobbler.com/2.0',
	apiKey: 'NOT_INITIALIZED'
};

/**
 * Initialize the last fm integration with your API key.
 */
export function initializeLastFmApi(apiKey: string) {
	if (isApiInitialized()) {
		throw new Error('Last FM API is already initialized');
	}
	LAST_FM_API.apiKey = apiKey;
}



function isApiInitialized(): boolean {
	return LAST_FM_API.apiKey !== 'NOT_INITIALIZED';
}

export function getApi() {
	if (!isApiInitialized()) {
		throw new Error('You need to initialize the API.');
	}
	return LAST_FM_API;
}
