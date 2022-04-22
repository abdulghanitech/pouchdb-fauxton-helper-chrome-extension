import React from "react";
import { DOMMessage, DOMMessageResponse } from "./types";

function App() {
    const [title, setTitle] = React.useState("");
    const [headlines, setHeadlines] = React.useState<string[]>([]);

    React.useEffect(() => {
        /**
         * We can't use "chrome.runtime.sendMessage" for sending messages from React.
         * For sending messages from React we need to specify which tab to send it to.
         */
        chrome.tabs &&
            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true,
                },
                (tabs) => {
                    /**
                     * Sends a single message to the content script(s) in the specified tab,
                     * with an optional callback to run when a response is sent back.
                     *
                     * The runtime.onMessage event is fired in each content script running
                     * in the specified tab for the current extension.
                     */
                    chrome.tabs.sendMessage(
                        tabs[0].id || 0,
                        { type: "GET_DOM" } as DOMMessage,
                        (response: DOMMessageResponse) => {
                            setTitle(response.title);
                            setHeadlines(response.headlines);
                        }
                    );
                }
            );
    }, []);

    return (
        <div className="bg-gray-800 flex flex-col w-full h-full min-h-screen">
            <div className="flex justify-center">
                <h1 className="text-3xl text-white font-bold underline">
                    Stored queries
                </h1>
            </div>
            <div className="flex px-8 py-8">
                <ul>
                    <li
                        className="text-white text-lg"
                        onClick={() => {
                            const editor = (window as any)?.ace.edit(
                                "query-field"
                            );

                            editor.setValue(title);
                        }}
                    >
                        <p>{title}</p>
                    </li>
                </ul>

                <ul>
                    {headlines.map((headline, index) => (
                        <li
                            className="text-white text-lg"
                            onClick={() => {
                                console.log("clicking set val");
                                const editor = (window as any)?.ace.edit(
                                    "query-field"
                                );

                                editor.setValue(
                                    '{\n  "hello": {\n    "_id": {\n      "$eq": null\n    }\n  }\n}'
                                );
                            }}
                            key={index}
                        >
                            Set val
                        </li>
                    ))}
                </ul>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        console.log("clicking set val");
                        const queryField =
                            document.querySelector("#query-field");
                        console.log({ queryField });
                        // const editor = (window as any)?.ace.edit("query-field");

                        // editor.setValue(
                        //     '{\n  "hello": {\n    "_id": {\n      "$eq": null\n    }\n  }\n}'
                        // );
                    }}
                >
                    set val btn
                </button>
            </div>
        </div>
    );
}

export default App;
