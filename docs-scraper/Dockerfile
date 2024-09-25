# Use the official docs-scraper image as a parent image
FROM getmeili/docs-scraper:latest

# install jq from apt-get
RUN apt-get update && apt-get install -y --no-install-recommends jq curl

# set working directory
WORKDIR /scrape

# copy config and script
COPY meilisearch-docs-scraper.config.json ./
COPY --chmod=755 scrape.sh ./

# run the script
CMD ["./scrape.sh"]

