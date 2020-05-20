// import {getVideoId} from "./utils.js"

// Block the page.
// TODO: make this more nuanced or appealing.
function blockPage() {
    console.log("Unwanted video! Blocking.")
    document.documentElement.innerHTML = '';
    document.documentElement.innerHTML = 'This site is blocked';
    document.documentElement.scrollTop = 0;
}

// Main function, run on page load.
async function checkPageAndMaybeBlock() {
    const currentUrl = new URL(window.location.href);
    const videoId = getVideoId(currentUrl);

    console.log("video id: ", videoId)
    // If we're on a video page, call out to the extension background script
    // to figure out if we should block the page or not.
    if(videoId) {
        console.log("sending message to background: ", {videoId: videoId})

        sendMessageToBackgroundPromise({videoId: videoId}).then( 
            function (response) {
                console.log("response from background: ", response)
                if (response.shouldBlock) {
                    blockPage()
                } else {
                    console.log("not a video page." + videoId)
                }
            }
        )
    }    
}

checkPageAndMaybeBlock()