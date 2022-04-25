// injected script - injected.js
var s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.js");
s.onload = function () {
    this.remove();
};
(document.body || document.documentElement).appendChild(s);

// get storage from storage
async function getStoredQueries() {
    console.log("getting stored queries...");
    return new Promise((resolve, reject) => {
        chrome.storage.local.get({ queryJSON: [] }, (result) => {
            if (result?.queryJSON && result?.queryJSON.length > 0) {
                console.log("getStoredQueries:", result);
                const reversedResultArray = result.queryJSON.reverse();
                resolve(reversedResultArray);
            } else {
                reject("no queries found");
            }
        });
    });
}

// remove stored query from storage
function removeStoredQuery(queryIndex) {
    chrome.storage.local.get({ queryJSON: [] }, function (result) {
        if (result.queryJSON) {
            console.log(result.queryJSON);
            result.queryJSON.splice(queryIndex, 1);
            chrome.storage.local.set({
                queryJSON: result.queryJSON,
            });
        }
    });
}

// clears previously stored query element
function clearPreviousStoredQueryEl() {
    const storedQueriesEl = document.querySelectorAll(
        ".storedQueriesContainer"
    );

    if (storedQueriesEl && storedQueriesEl.length > 0) {
        // console.log(storedQueriesEl)
        console.log("clearing previous stored queries...");
        // remove from DOM
        storedQueriesEl.forEach((el) => {
            el.remove();
        });
    }
}

// create query elements
function createQueryElement(query, index) {
    if (query && index !== undefined) {
        console.log("now creating query elements...");
        // the target Area where our UI would be injected
        const targetArea = document.querySelector(
            ".form-horizontal div.bordered-box"
        );

        // the container div
        const queryEl = document.createElement("div");
        queryEl.classList.add("storedQueriesContainer");
        queryEl.style.display = "flex";
        queryEl.style.justifyContent = "space-between";
        queryEl.style.backgroundColor = "#333";
        queryEl.style.color = "#fff";
        queryEl.style.padding = "10px";
        queryEl.style.borderRadius = "4px";
        queryEl.style.margin = "10px";
        queryEl.onmouseover = () => {
            queryEl.style.backgroundColor = "#555";
        };
        queryEl.onmouseout = () => {
            queryEl.style.backgroundColor = "#333";
        };

        // the query text paragraph element
        const queryParagraph = document.createElement("p");
        queryParagraph.setAttribute("class", `storedQueries`);
        queryParagraph.innerHTML = JSON.stringify(query, null, 2);
        queryParagraph.style.cursor = "pointer";
        queryEl.appendChild(queryParagraph);

        // the remove button
        const removeQueryButton = document.createElement("button");
        removeQueryButton.style.width = "30px";
        removeQueryButton.style.height = "30px";
        removeQueryButton.innerText = "X";
        removeQueryButton.addEventListener("click", () => {
            removeStoredQuery(index);
            queryEl.remove();
        });
        queryEl.appendChild(removeQueryButton);

        // append to target area
        targetArea && targetArea.prepend(queryEl);
    } else {
        console.log(
            "Error creating query elements: query or index is undefined"
        );
    }
}

async function init() {
    try {
        console.log("initilizing...");
        const result = await getStoredQueries();
        // console.log({ result });

        if (result && result.length > 0) {
            console.log("stored queries found!");
            // clear previous stored queries
            clearPreviousStoredQueryEl();

            // create elements for each query
            result.forEach((query, index) => {
                createQueryElement(query, index);
            });
        } else {
            console.log("no stored queries found!");
        }
    } catch (error) {
        console.log({ error });
    }
}

init();

const messagesFromAppListener = (msg, sender, sendResponse) => {
    console.log("[content.js]. Message received from injected.js", msg);

    if (msg?.type === "QUERY_ADDED") {
        init();
    }
};

chrome.runtime.onMessage.addListener(messagesFromAppListener);
