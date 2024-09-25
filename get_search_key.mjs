let lastError = null;

async function checkMeilisearchHealth(maxWaitTime = 60000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
        try {
            const healthRes = await fetch(process.env.NEXT_PUBLIC_MEILISEARCH_HOST + '/health');

            if (healthRes.ok) {
                return true;
            }
        } catch (error) {
            lastError = error;
        }

        // Wait for 5 seconds before the next check
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.error('Meilisearch health check timed out after 1 minute', lastError);

    return false;
}

// Check Meilisearch health before proceeding
const isHealthy = await checkMeilisearchHealth();

if (isHealthy) {
    const res = await fetch(process.env.NEXT_PUBLIC_MEILISEARCH_HOST + '/keys', {
        headers: {
            Authorization: `Bearer ${process.env.MEILI_MASTER_KEY}`
        }
    });

    const data = await res.json();

    const searchKey = data.results.find(key => key.actions.length == 1 && key.actions[0] == 'search');

    console.log(searchKey.key);
    process.exit(0);
} else {
    console.error('Unable to proceed due to Meilisearch health issues');
    process.exit(1);
}
