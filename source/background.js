// Import Koii SDK locally (not from CDN)
import * as kweb from "../node_modules/@_koii/sdk/web.js";

const koii = new kweb.Web();

chrome.runtime.onInstalled.addListener(() => {
    console.log("Smart Browser Plugin installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "crawledData") {
        console.log("Received crawled data:", message.data);

        // Submit data to Koii Storage
        koii.submitData(message.data)
            .then((res) => {
                console.log("Data submitted to Koii:", res);
                sendResponse({ status: "success", message: "Data submitted successfully!" });
            })
            .catch((err) => {
                console.error("Error submitting data to Koii:", err);
                sendResponse({ status: "error", message: "Failed to submit data to Koii." });
            });

        return true; // Required to use `sendResponse` asynchronously
    }
});
