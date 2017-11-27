# In your Dockerfile.
FROM node:7.8.0

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Run server
RUN yarn global add serve
CMD serve -s build

# Let Docker know about the port that serve runs on.
EXPOSE 5000

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Get node packaged
COPY package.json /app/package.json

RUN yarn install

COPY . .

RUN yarn build
