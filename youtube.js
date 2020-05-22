// TODO: Handle api key properly
const YOUTUBE_API_KEY = "AIzaSyCOhzDOryzhD1wFdDVLr19DNW5F0Q5HK44"

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

getChannelFromVideoPromise("SRYtn0j5ccA").then( 
	(result) => { console.log(result) }
)