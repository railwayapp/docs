FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# Install deps
RUN yarn

# Bundle app source
COPY . .

# Build
RUN yarn build

ARG NEXT_PUBLIC_FATHOM_CODE
# Start
CMD [ "yarn", "start" ]
