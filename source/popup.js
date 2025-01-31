const koii = new kweb.Web();

// Connect Finnie Wallet
async function connectWallet() {
    try {
        const walletResponse = await koii.connectWallet();
        document.getElementById("wallet-status").innerText = `Wallet Connected: ${walletResponse.address}`;

        // Save wallet address
        chrome.storage.local.set({ walletAddress: walletResponse.address });
    } catch (err) {
        console.error("Error connecting wallet:", err);
        alert("Failed to connect wallet.");
    }
}

// Fetch user stats
async function fetchUserStats() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["rewards", "contributions"], (data) => {
            resolve({
                rewards: data.rewards || 0,
                contributions: data.contributions || 0,
            });
        });
    });
}

// Claim Rewards (Deducting Gas Fees)
async function claimRewards() {
    try {
        const stats = await fetchUserStats();
        if (stats.rewards <= 0) {
            alert("No rewards available to claim.");
            return;
        }

        const gasFee = 0.1; // Example gas fee deduction
        const claimAmount = stats.rewards - gasFee;
        alert(`Claiming ${claimAmount} Koii (Gas fee: ${gasFee} Koii)`);

        // Reset stored rewards after claiming
        chrome.storage.local.set({ rewards: 0 });
        displayStats();
    } catch (error) {
        console.error("Error claiming rewards:", error);
        alert("Failed to claim rewards.");
    }
}

// Update the stats in the popup window
async function displayStats() {
    const stats = await fetchUserStats();
    document.getElementById("reward-stats").innerText = `Rewards: ${stats.rewards} Koii`;
    document.getElementById("contribution-stats").innerText = `Contributions: ${stats.contributions}`;
}

document.addEventListener("DOMContentLoaded", () => {
    displayStats();
    document.getElementById("connect-wallet").addEventListener("click", connectWallet);
    document.getElementById("claim-rewards").addEventListener("click", claimRewards);
});
