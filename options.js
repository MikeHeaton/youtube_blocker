async function showBlockedVideos() {
  const videosListHtml = document.getElementById('blockedVideosList');
  
  console.log("Getting blist...")
  var blockListVals = await getLatestBlockListPromise()
  console.log(blockListVals)
  if (blockListVals.size > 0) {
    videosListHtml.innerHTML = serializeBlockList(blockListVals);
  } else {
    videosListHtml.innerHTML = "[]"
  }
  
}

function addResetListToButton() {
    let button = document.getElementById('resetButton');

    button.addEventListener('click', function() {
      resetBlockList().then(function () {
        console.log("CLEARED BLOCK LIST")
        showBlockedVideos()
      })
      
    });
}

addResetListToButton()
showBlockedVideos()