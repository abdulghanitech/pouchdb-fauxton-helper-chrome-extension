function main() {
    console.log("injected.js script injected");

    try {
        // The editor used by pouchdb-fauxton-client to write queries
        const editor = window?.ace?.edit("query-field");
        const code = editor.getValue();
        // console.log({ code });
        // editor.setValue(
        //     '{\n  "hello": {\n    "_id": {\n      "$gt": null\n    }\n  }\n}'
        // );

        // add listener to storedQueries paragraph element
        const storedQueriesEl = document.querySelectorAll(".storedQueries");

        if (storedQueriesEl && storedQueriesEl.length > 0) {
            storedQueriesEl.forEach((el) => {
                el.addEventListener("click", (event) => {
                    console.log("storedQueriesEl clicked");
                    const query = JSON.parse(el.innerText);
                    console.log({ query });
                    editor && editor.setValue(JSON.stringify(query, null, 2));
                });
            });
        }
    } catch (error) {
        console.log("Error in injected.js", error);
    }

}

main();
