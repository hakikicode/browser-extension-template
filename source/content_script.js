async function crawlGameplayData() {
    const data = [];

    try {
        // Fetch data from RAWG API
        const response = await fetch("https://api.rawg.io/api/games?key=68f04623d57245ac8e8ffa7ed9c6b5ea&page_size=10");
        const json = await response.json();

        json.results.forEach((game) => {
            data.push({
                game: game.name,
                players: Math.floor(Math.random() * 10000), // Simulated player count
                location: "Global",
            });
        });

        console.log("Crawled Gameplay Data:", data);
    } catch (error) {
        console.error("Error fetching gameplay data:", error);
    }

    return data;
}

async function sendDataToBackgroundScript() {
    const crawledData = await crawlGameplayData();
    
    chrome.runtime.sendMessage(
        { type: "crawledData", data: crawledData },
        (response) => {
            console.log("Response from background script:", response);
        }
    );
}

window.addEventListener("load", () => {
    console.log("Page loaded, crawling gameplay data...");
    sendDataToBackgroundScript();
});
