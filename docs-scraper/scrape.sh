#!/bin/bash

set -e

local timeout=60  # 1 minute timeout
local deadtime=5
local curl_timeout=2

local start_time=$(date +%s)

echo "Starting health check..."

while true; do
    local current_time=$(date +%s)
    local elapsed_time=$((current_time - start_time))

    if [ $elapsed_time -ge $timeout ]; then
        echo "Timeout reached. Health check failed."
        exit 1
    fi

    status_code=$(curl -s -o /dev/null -w "%{http_code}" -m $curl_timeout "$HEALTH_URL")

    if [ "$status_code" -eq 200 ]; then
        echo "Health check succeeded. Status code: 200"
        break
    else
        echo "Health check failed. Status code: $status_code"
        sleep $deadtime
    fi
done

echo "Health check succeeded. Starting Scrape Job..."

jq ".start_urls[0].url = ${START_URL}" meilisearch-docs-scraper.config.json > output.json

pipenv run output.json
