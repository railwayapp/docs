#!/bin/bash

set -euo

# check for the existence of the $HEALTH_URL and $START_URL environment variables
if [ -z "$HEALTH_URL" ] || [ -z "$START_URL" ]; then
    echo "Error: Required environment variables are not set."
    [ -z "$HEALTH_URL" ] && echo "HEALTH_URL is missing."
    [ -z "$START_URL" ] && echo "START_URL is missing."
    exit 1
fi

timeout=300  # 5 minute timeout
deadtime=2  # 2 seconds between checks
curl_timeout=1  # 1 second timeout for each check

start_time=$(date +%s)

echo "Starting health check..."

while true; do
    current_time=$(date +%s)
    elapsed_time=$((current_time - start_time))

    if [ $elapsed_time -ge $timeout ]; then
        echo "Timeout reached. Health check failed."
        exit 1
    fi

    # check if the health check url is responding
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

# set the start_urls[0].url to the START_URL environment variable
jq ".start_urls[0].url = \"$START_URL\"" meilisearch-docs-scraper.config.json > output.json

# run the docs_scraper with the output.json file
pipenv run ./docs_scraper output.json 2>&1

echo "Scrape Job completed."

# exit with a success code
exit 0