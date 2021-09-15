FROM node:alpine

ARG NEXT_PUBLIC_FATHOM_CODE
ARG DISCORD_WEBHOOK
ARG DATABASE_URL

# Create app directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# Install deps
RUN yarn

# Bundle app source
COPY . .

# Migrate
RUN yarn migrate:deploy

# Build
RUN yarn generate
RUN yarn build

# Start
CMD [ "yarn", "start" ]
