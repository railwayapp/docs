#!/bin/bash
set -e  # Exit on any error

if [ -z "${MEILI_MASTER_KEY}" ]; then
    echo "Error: MEILI_MASTER_KEY environment variable is not set"
    exit 1
fi

if [ -z "${NEXT_PUBLIC_MEILISEARCH_HOST}" ]; then
    echo "Error: NEXT_PUBLIC_MEILISEARCH_HOST environment variable is not set"
    exit 1
fi

echo "Waiting for Meilisearch to be ready..."

# Wait for Meilisearch to be ready (timeout after 30 seconds)
COUNTER=0
until curl -s -f -o /dev/null "${NEXT_PUBLIC_MEILISEARCH_HOST}/health"; do
    if [ $COUNTER -ge 30 ]; then
        echo "Error: Timed out waiting for Meilisearch after 30 seconds"
        exit 1
    fi
    echo "Continuing to wait for Meilisearch to be ready..."
    sleep 1
    COUNTER=$((COUNTER + 1))
done

echo "Meilisearch is ready"

echo "Checking for existing keys"

# First, try to get existing keys
KEYS_RESPONSE=$(curl -s -H "Authorization: Bearer ${MEILI_MASTER_KEY}" "${NEXT_PUBLIC_MEILISEARCH_HOST}/keys")

# Look for an existing read-only key
READ_KEY=$(echo "${KEYS_RESPONSE}" | jq -r '.results[] | select(.actions | contains(["search"]) and length == 1) | .key')

if [ -z "${READ_KEY}" ]; then
    echo "No existing read-only key found, creating a new one"
    # Create a new read-only key if none exists
    READ_KEY=$(curl -s -X POST -H "Authorization: Bearer ${MEILI_MASTER_KEY}" \
        -H "Content-Type: application/json" \
        -d '{"description":"Read-only key","actions":["search"],"expiresAt":null}' \
        "${NEXT_PUBLIC_MEILISEARCH_HOST}/keys" | jq -r '.key')
    echo "New read-only key created: ${READ_KEY}"
fi

echo "Exporting NEXT_PUBLIC_MEILISEARCH_READ_API_KEY: ${READ_KEY}"
# Output the key
export NEXT_PUBLIC_MEILISEARCH_READ_API_KEY="${READ_KEY}"
