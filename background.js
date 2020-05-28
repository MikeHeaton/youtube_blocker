function getBlockDecision(videoId, channelId, videoBlockList, channelBlockList) {
    console.log("video ID:", id, ", channel ID: ", channelId);

    console.log("Video block list:", videoBlockList)

    console.log("Channel block list:", channelBlockList)

    if (videoBlockList.has(videoId) || channelBlockList.has(channelId)) {
        return true;
    } else {
        return false;
    }
}

// Show the popup on youtube.com.
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        // When page url is as listed... 
        conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {urlContains: 'youtube.com'},
            })
        ],
        // Activate the page_action, which is the icon in the toolbar.
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

// Listener to receive messages from the Youtube tabs 
// and dispense blocking decisions.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        const videoId = request.videoId

        const channelIdPromise = getChannelFromVideoPromise(videoId)

        const videoBlockListPromise = getVideoBlockListPromise()
        const channelBlockListPromise = getChannelBlockListPromise()

        Promise.all([channelIdPromise, videoBlockListPromise, channelBlockListPromise]).then(
            (values) => {
                const channelId = values[0]
                const videoBlockList = values[1]
                const channelBlockList = values[2]

                const shouldBlock = getBlockDecision(
                    videoId, channelId, videoBlockList, channelBlockList
                )
        
                const response = {
                    videoId: videoId,
                    shouldBlock: shouldBlock
                }

                console.log("Sending response: ", response)

                sendResponse({
                    complete: true,
                    videoId: videoId,
                    shouldBlock: shouldBlock
                })
            }
        )

        return true;
    }
);