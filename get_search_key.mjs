const maxWaitTime = 60000; // 1 minute in milliseconds

// meilisearch health check
async function checkMeilisearchHealth(maxWaitTime) {
    let lastError = null;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);

            const healthRes = await fetch(process.env.NEXT_PUBLIC_MEILISEARCH_HOST + '/health', {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (healthRes.ok) {
                return null; // Return null for success
            }
        } catch (error) {
            lastError = error;
            // Continue the loop, don't return immediately on error
        }

        // Wait for 500 ms before the next check
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return lastError;
}

// check if meilisearch is healthy
const error = await checkMeilisearchHealth(maxWaitTime);

if (error) {
    const errorMessage = error.cause?.errors?.[0]?.message;
    console.error(`Meilisearch health check timed out after: ${maxWaitTime}ms${errorMessage ? ` - ${errorMessage}` : ''}`);
    process.exit(1);
}

const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 1000);

const res = await fetch(process.env.NEXT_PUBLIC_MEILISEARCH_HOST + '/keys', {
    headers: {
        Authorization: `Bearer ${process.env.MEILI_MASTER_KEY}`
    },
    signal: controller.signal
});

clearTimeout(timeoutId);

const data = await res.json();

const searchKey = data.results.find(key => key.actions.length == 1 && key.actions[0] == 'search');

console.log(searchKey.key);
process.exit(0);