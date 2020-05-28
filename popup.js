function blockCurrentTabVideo() {
    // Get current tab (or rather, a list of 1 tab) and then...
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // Get the video Id from the tab URL
        const currentTab = tabs[0]; // there will be only one in this array
        console.log("Current tab:" + currentTab)
        const url = new URL(currentTab.url);

        const videoId = getVideoId(url)

        console.log("Current id:" + videoId)

        // Append to the block list (this is async too, woo callbacks).
        if(videoId) {
            appendVideoBlockList(videoId)
        }
    })
}

function blockCurrentTabChannel() {
    // Get current tab (or rather, a list of 1 tab) and then...
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // Get the video Id from the tab URL
        const currentTab = tabs[0]; // there will be only one in this array
        console.log("Current tab:" + currentTab)
        const url = new URL(currentTab.url);
        const videoId = getVideoId(url)

        // Then turn the video ID into a channel ID and block it
        const channelId = getChannelFromVideoPromise(videoId).then(appendChannelBlockList)
    })
}

let blockVideoButton = document.getElementById('blockVideoButton');
console.log("blockVideoButton" + blockVideoButton)
blockVideoButton.onclick = blockCurrentTabVideo

let blockChannelButton = document.getElementById('blockChannelButton');
console.log("blockChannelButton" + blockChannelButton)
blockChannelButton.onclick = blockCurrentTabChannel

