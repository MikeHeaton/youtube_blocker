const VIDEO_BLOCK_LIST_KEY = 'videoBlockList'
const CHANNEL_BLOCK_LIST_KEY = 'channelBlockList'

function serializeSet(inputSet) {
    /**
     * Turn a blockList set into a key/array pair
     * that can be sent up to storage.
     */
    const result = Array.from(inputSet)
    console.log("serialized to ", result)
    return result
}

function deserializeToSet(inputSerialized) {
    /**
     * Take the blockList returned from storage and process it.
     * Currently storedBlockList is an array, so simple.
     */
    return new Set(inputSerialized)
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

async function getDictPromise(key) {
    /**
     * Get a serialized dict from storage and deserialize it.
     * Returns a Promise.
     */
    return getKeyFromStoragePromise(key).then(deserializeToSet)
}

async function getVideoBlockListPromise() {
    return getDictPromise(VIDEO_BLOCK_LIST_KEY).then(deserializeToSet)
}

async function getChannelBlockListPromise() {
    return getDictPromise(CHANNEL_BLOCK_LIST_KEY).then(deserializeToSet)
}

async function writeSetToKeyPromise(inputSet, key) {
    /**
     * Per title.
     * Accepts a set, and a key.
     * Returns a Promise.
     */
    return setKeyStoragePromise(
        key, 
        serializeSet(inputSet)
    ).then(() => console.log("setKeyStoragePromise resolved in setBlockListPromise"))
}

async function setVideoBlockListPromise(inputSet) {
    writeSetToKeyPromise(inputSet, VIDEO_BLOCK_LIST_KEY)
}

async function setChannelBlockListPromise(inputSet) {
    writeSetToKeyPromise(inputSet, CHANNEL_BLOCK_LIST_KEY)
}

async function appendToStorage(newElement, key) {
    /**
     * Fetch the latest block list, 
     * and add a new element onto the end of it.
    */
    const prom = getDictPromise(key)
    var currentStorage = await prom

    console.log("trying to append this " + newElement + " to this " + JSON.stringify(currentStorage))

    if (
        currentStorage.size === 0
    ) {
        console.log("empty  blockList")
        currentStorage = new Set()
    }

    // In-place
    currentStorage.add(newElement)

    console.log("syncing new list: " + JSON.stringify(currentStorage))

    return setVideoBlockListPromise(currentStorage, key)
}

async function appendVideoBlockList(newElement) {
    return appendToStorage(newElement, VIDEO_BLOCK_LIST_KEY)
}

async function appendChannelBlockList(newElement) {
    return appendToStorage(newElement, CHANNEL_BLOCK_LIST_KEY)
}

async function resetVideoBlockList() {
    /**
     * Set the blockList to nil.
     */
    var prom = setVideoBlockListPromise(new Set())
    console.log("reset promise: ", prom)
    return prom
}
