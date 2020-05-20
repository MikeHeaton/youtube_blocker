function getVideoId(url) {
    /**
     * Extract the Youtube video ID from a url, if it's there.
     */
    const urlParams = new URLSearchParams(url.search.replace(/^\?/g, ''));
    console.log(urlParams.entries());
    return urlParams.get("v");
}

function sendMessageToBackgroundPromise(message) {
    return new Promise((resolve, reject) => {
        console.log("doing promise")
        chrome.runtime.sendMessage(message, function(response) {
            if(response.complete) {
                console.log("response complete: ", response)
                resolve(response);
            } else {
                reject('Error sending message ', message, 'to background.');
            }
        });
    });
}