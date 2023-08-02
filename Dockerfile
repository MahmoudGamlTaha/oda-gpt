
# Use node:14-alpine as the base image for the build stage
FROM node:14-alpine AS build
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json (or package*.json) to the working directory
COPY package*.json  ./
# Install the project dependencies using npm ci command
RUN npm ci
# Copy all files and directories to the working directory
COPY . .
# Build the project and remove unnecessary dependencies using npm run build and npm prune --production commands
RUN npm run build && npm prune --production

# Use node:14-alpine as the base image for the production stage
FROM node:14-alpine AS production
# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the built files from the build stage to the production stage
COPY  --from=build /usr/src/app/dist ./dist
# Copy the required dependencies from the build stage to the production stage
COPY  --from=build /usr/src/app/node_modules ./node_modules

# Expose port 3000 for the application
EXPOSE 3000/tcp
# Set the command to run the application when the container starts
RUN npm start -> log.txt
#CMD [ "node", "./dist/main.js" ]
