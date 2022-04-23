var arrayBufferToData = {
    toBase64: function (arrayBuffer) {
        var binary = "";
        var bytes = new Uint8Array(arrayBuffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },

    toString: function (arrayBuffer) {
        try {
            var base64 = this.toBase64(arrayBuffer);

            return decodeURIComponent(escape(window.atob(base64)));
        } catch (e) {
            console.warn("Can not be converted to String");
            return false;
        }
    },

    toJSON: function (arrayBuffer) {
        try {
            var string = this.toString(arrayBuffer);
            return JSON.parse(string);
        } catch (e) {
            console.warn("Can not be converted to JSON");
            return false;
        }
    },
};

function requestHandler(req) {
    console.log(req);
    if (
        req &&
        req.type === "xmlhttprequest" &&
        req.requestBody?.raw?.length > 0 &&
        req.requestBody?.raw[0]?.bytes
    ) {
        console.log("XHR");
        // console.log(req.requestHeaders);
        console.log(req.requestBody);
        const buffer = req.requestBody?.raw[0]?.bytes;
        // arrayBufferToJSON(buffer);
        // console.log(arrayBufferToJSON(buffer));
        try {
            const query = arrayBufferToData.toJSON(buffer);
            console.log(query);
            // if queryJSON(query) is there then store it in chrome storage
            storeQuery(query);
            // send the event to content.js
            console.log("sending event to content.js");
            // chrome.runtime.sendMessage({
            //     type: "QUERY_ADDED",
            //     query,
            // });

            notifyContentScript({
                type: "QUERY_ADDED",
                query,
            });
        } catch (error) {
            console.log(error);
        }
    }
}

function notifyContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

// chrome.storage.local.set({
//     query: query,
// });

function storeQuery(query) {
    // get the queryJSON Array and push to it
    if (query) {
        chrome.storage.local.get({ queryJSON: [] }, function (result) {
            if (result.queryJSON) {
                console.log(result.queryJSON);
                result.queryJSON.push(query);
                chrome.storage.local.set({
                    queryJSON: result.queryJSON,
                });
            } else {
                chrome.storage.local.set({
                    queryJSON: [query],
                });
            }
        });
    }
}

function setListeners() {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        requestHandler,
        { urls: ["http://localhost:3000/wayship/_find"] },
        ["requestHeaders"]
    );
    chrome.webRequest.onBeforeRequest.addListener(
        requestHandler,
        { urls: ["http://localhost:3000/wayship/_find"] },
        ["requestBody"]
    );
    chrome.webRequest.onCompleted.addListener(requestHandler, {
        urls: ["http://localhost:3000/wayship/_find"],
    });
}
function removeListeners() {
    chrome.webRequest.onBeforeSendHeaders.removeListener(requestHandler);
    chrome.webRequest.onBeforeRequest.removeListener(requestHandler);
    chrome.webRequest.onCompleted.removeListener(requestHandler);
}

setListeners();
