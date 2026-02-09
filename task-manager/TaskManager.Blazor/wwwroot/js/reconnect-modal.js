// Set up event handlers when DOM is ready (Blazor may render ReconnectModal after load)
function initReconnectModal() {
    const reconnectModal = document.getElementById("components-reconnect-modal");
    if (!reconnectModal) {
        // Retry a few times - Blazor Server may render the modal after connection
        let attempts = 0;
        const id = setInterval(() => {
            attempts++;
            const el = document.getElementById("components-reconnect-modal");
            if (el) {
                clearInterval(id);
                attachHandlers(el);
            } else if (attempts >= 20) clearInterval(id);
        }, 100);
        return;
    }
    attachHandlers(reconnectModal);
}

function attachHandlers(reconnectModal) {
    reconnectModal.addEventListener("components-reconnect-state-changed", handleReconnectStateChanged);
    const retryButton = document.getElementById("components-reconnect-button");
    if (retryButton) retryButton.addEventListener("click", retry);
    const resumeButton = document.getElementById("components-resume-button");
    if (resumeButton) resumeButton.addEventListener("click", resume);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReconnectModal);
} else {
    initReconnectModal();
}

function handleReconnectStateChanged(event) {
    const reconnectModal = document.getElementById("components-reconnect-modal");
    if (!reconnectModal) return;
    if (event.detail.state === "show") {
        reconnectModal.showModal();
    } else if (event.detail.state === "hide") {
        reconnectModal.close();
    } else if (event.detail.state === "failed") {
        document.addEventListener("visibilitychange", retryWhenDocumentBecomesVisible);
    } else if (event.detail.state === "rejected") {
        location.reload();
    }
}

async function retry() {
    document.removeEventListener("visibilitychange", retryWhenDocumentBecomesVisible);

    try {
        const successful = await Blazor.reconnect();
        if (!successful) {
            const resumeSuccessful = await Blazor.resumeCircuit();
            if (!resumeSuccessful) {
                location.reload();
            } else {
                const modal = document.getElementById("components-reconnect-modal");
                if (modal) modal.close();
            }
        }
    } catch (err) {
        document.addEventListener("visibilitychange", retryWhenDocumentBecomesVisible);
    }
}

async function resume() {
    try {
        const successful = await Blazor.resumeCircuit();
        if (!successful) {
            location.reload();
        }
    } catch {
        const modal = document.getElementById("components-reconnect-modal");
        if (modal) modal.classList.replace("components-reconnect-paused", "components-reconnect-resume-failed");
    }
}

async function retryWhenDocumentBecomesVisible() {
    if (document.visibilityState === "visible") {
        await retry();
    }
}
