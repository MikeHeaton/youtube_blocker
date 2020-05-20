function getBlockDecision(id, videoBlockList) {
    console.log("video ID:" + id);

    console.log("Video block list:", videoBlockList)

    if (videoBlockList.has(id)) {
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

        getLatestBlockListPromise().then( function (videoBlockList) {
            const shouldBlock = getBlockDecision(videoId, videoBlockList)
        
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
        })
        
        return true;
    }
);


// Demo data
appendBlockList('foo')
appendBlockList('bar')