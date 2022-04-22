import { DOMMessage, DOMMessageResponse } from "../types";

// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessageResponse) => void
) => {
    console.log("[content.js]. Message received", msg);

    const headlines = Array.from(document.getElementsByTagName<"h1">("h1")).map(
        (h1) => h1.innerText
    );
    const queryField = document.querySelector("#query-field");
    // console.log({ queryField });

    let code = "";

    // editor.setValue('{\n  "selector": {\n    "_id": {\n      "$eq": null\n    }\n  }\n}');

    // window.addEventListener("DOMContentLoaded", (event) => {
    //     console.log("DOM fully loaded and parsed");
    //     const editor = (window as any).ace.edit("query-field");
    //     code = editor.getValue();
    // });

    // Prepare the response object with information about the site
    const response: DOMMessageResponse = {
        title: code,
        headlines,
    };

    sendResponse(response);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

// function main() {
//     // ...
//     window.alert = function () {
//         console.log("[content.js]. modified Alert called");
//     };
//     // ...
// }

// var script = document.createElement("script");
// script.appendChild(document.createTextNode("(" + main + ")();"));
// (document.body || document.head || document.documentElement).appendChild(
//     script
// );

// function injectJs(link: string) {
//     var scr = document.createElement("script");
//     scr.type = "text/javascript";
//     scr.src = link;
//     document.getElementsByTagName("head")[0].appendChild(scr);
//     //document.body.appendChild(scr);
// }

// injectJs(chrome.runtime.getURL("injected.js"));

// var s = document.createElement("script");
// s.src = chrome.runtime.getURL("injected.js");
// s.onload = function () {
//     // @ts-ignore
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);

// var actualCode =
//     "(" +
//     function () {
//         // All code is executed in a local scope.
//         // For example, the following does NOT overwrite the global `alert` method
//         var alert = null;
//         // To overwrite a global variable, prefix `window`:
//         // @ts-ignore
//         window.alert("hello");
//     } +
//     ")();";
// var script = document.createElement("script");
// script.textContent = actualCode;
// (document.head || document.documentElement).appendChild(script);
// script.remove();

function init() {
    const el = document.createElement("input");
    el.setAttribute("type", "checkbox");
    el.setAttribute("id", "myCheckbox");
    // el.style.position = "fixed";
    // el.style.top = "0";
    // el.style.left = "0";
    // el.style.zIndex = "9999";
    // el.style.width = "100%";
    // el.style.height = "100%";
    // el.style.backgroundColor = "red";
    // el.style.color = "white";
    // el.style.fontSize = "30px";
    // el.style.textAlign = "center";

    document.body.appendChild(el);
    el.addEventListener("click", (event) => {
        // @ts-ignore
        console.log(event.target.checked);
        // @ts-ignore
        console.log("ace:", window.ace);
    });
}

init();

function networkIntercept(){
    console.log("network intercepted")
}

// chrome.webRequest.onBeforeRequest.addListener(tab => {
//     chrome.scripting.executeScript(
//         {
//         target: { tabId: tab.tabId },
//         function: networkIntercept,
//         args: [details.url],
//         },
//         () => { console.log('ZZZ') });
//     },  {
//         urls: ['<all_urls>']
//     });  