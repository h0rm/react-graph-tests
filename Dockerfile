# In your Dockerfile.
FROM node:9.2

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Run server
RUN yarn global add serve

# Let Docker know about the port that serve runs on.
EXPOSE 5000

# Get node packaged
COPY package.json /app/package.json

WORKDIR /app/
RUN yarn install

# Link react
WORKDIR /app/node_modules/react
RUN yarn link

# Build dependency react-dropdown-tree-select
COPY ./dep /app/dep

WORKDIR /app/dep/react-dropdown-tree-select
RUN yarn link react
RUN yarn install
RUN yarn build

RUN yarn link

# Build app
WORKDIR /app/
RUN yarn link react-dropdown-tree-select

COPY ./public /app/public

COPY ./src /app/src

RUN yarn build

# Let Docker know about the port that serve runs on.
EXPOSE 3000

CMD ["serve","-s","-C","build"]
