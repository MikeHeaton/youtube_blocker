/**
 * Call the Youtube API to discover the channel ID from a video ID.
 * Returns a Promise.
 * @param {str} videoId 
 */
async function getChannelFromVideoPromise(videoId) {
	let url = new URL('https://www.googleapis.com/youtube/v3/videos')
	url.search = new URLSearchParams({
		part: 'snippet',
		id: videoId,
		key: YOUTUBE_API_KEY
	})
	
	// Decode the result and extract the channel ID.
	return fetch(url).then(
		(result) => { 
			return result.json() }
	).then(
		(result) => { 
			console.log(result.items)
			return result.items[0].snippet.channelId }
	)
}