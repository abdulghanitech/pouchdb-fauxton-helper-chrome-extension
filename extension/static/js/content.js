var s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.js");
s.onload = function () {
    // @ts-ignore
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.storage.local.get({ queryJSON: [] }, function (result) {
    console.log("getStoredQueries:", result);
    return result;
});

// get storage from storage
const getStoredQueries = async () => {
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
};

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

async function init() {
    try {
        const targetArea = document.querySelector(
            ".form-horizontal div.bordered-box"
        );

        const result = await getStoredQueries();
        console.log({ result });

        if (result && result.length > 0) {
            // clear previous stored queries
            clearPreviousStoredQueryEl();

            // create elements for each query
            result.forEach((query, index) => {
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

                const queryParagraph = document.createElement("p");
                queryParagraph.setAttribute("class", `storedQueries`);
                queryParagraph.innerHTML = JSON.stringify(query, null, 2);
                queryParagraph.style.cursor = "pointer";
                queryEl.appendChild(queryParagraph);

                const removeQueryButton = document.createElement("button");
                removeQueryButton.innerText = "X";
                removeQueryButton.addEventListener("click", () => {
                    removeStoredQuery(index);
                    queryEl.remove();
                });
                queryEl.appendChild(removeQueryButton);

                targetArea && targetArea.prepend(queryEl);
            });
        }
    } catch (error) {
        console.log({ error });
    }
}

init();

function clearPreviousStoredQueryEl() {
    const storedQueriesEl = document.querySelectorAll(
        ".storedQueriesContainer"
    );

    if (storedQueriesEl && storedQueriesEl.length > 0) {
        console.log(storedQueriesEl);
        // remove from DOM
        storedQueriesEl.forEach((el) => {
            el.remove();
        });
    }
}

const messagesFromAppListener = (msg, sender, sendResponse) => {
    console.log("[content.js]. Message received", msg);

    if (msg?.type === "QUERY_ADDED") {
        init();
    }
};

chrome.runtime.onMessage.addListener(messagesFromAppListener);
