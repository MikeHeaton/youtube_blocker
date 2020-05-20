function serializeBlockList(blockListSet) {
    /**
     * Turn a blockList set into a key/array pair
     * that can be sent up to storage.
     */
    const result = Array.from(blockListSet)
    console.log("serialized to ", result)
    return result
}

function deserializeBlockList(storedBlockList) {
    /**
     * Take the blockList returned from storage and process it.
     * Currently storedBlockList is an array, so simple.
     */
    return new Set(storedBlockList)
}

async function getKeyFromStoragePromise(sKey) {
    /**
     * Turn the async storage API in a promise.
     * Returns a promise that resolves to the stored key.
     */
    console.log("Querying storage with key ", sKey)
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(sKey, function(items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                console.log("GOT ITEMS ", items, " FROM STORAGE ", sKey)
                resolve(items[sKey]);
            }
        });
    });
}

async function setKeyStoragePromise(sKey, v) {
    /**
     * Turn the async storage API in a promise.
     * Returns a promise that resolves to nothing AFAICT.
     */
    console.log("STORING ", v, " AS ", sKey)
    return new Promise(function(resolve, reject) {
        chrome.storage.local.set({[sKey]: v} , function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                resolve()
            }
        });
    });
}

async function getLatestBlockListPromise() {
    /**
     * Per title.
     * Returns a Promise.
     */
    return getKeyFromStoragePromise('blockList').then(deserializeBlockList)
}

async function setBlockListPromise(blockListSet) {
    /**
     * Per title.
     * Accepts a set.
     * Returns a Promise.
     */
    return setKeyStoragePromise(
        'blockList', 
        serializeBlockList(blockListSet)
    ).then(() => console.log("setKeyStoragePromise resolved in setBlockListPromise"))
}

async function appendBlockList(newElement) {
    /**
     * Fetch the latest block list, 
     * and add a new element onto the end of it.
    */
    const prom = getLatestBlockListPromise()
    var blockList = await prom

    console.log("trying to append this " + newElement + " to this " + JSON.stringify(blockList))

    if (
        blockList.size === 0
    ) {
        console.log("empty blockList")
        blockList = new Set()
    }

    blockList.add(newElement)

    console.log("syncing new list: " + JSON.stringify(blockList))

    return setBlockListPromise(blockList)
}

async function resetBlockList() {
    /**
     * Set the blockList to nil.
     */
    var prom = setBlockListPromise(new Set())
    console.log("reset promise: ", prom)
    return prom
}