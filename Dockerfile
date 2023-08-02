
# Use the node:14-alpine image as base
FROM node:14-alpine

# Set working directory to /usr/src/app
WORKDIR /usr/app/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy all files and directories to the working directory
COPY . .

# Build the project
RUN npm run build

# Expose port 3000 for incoming traffic
EXPOSE 3000

# Run the application
CMD npm start > logs.txt
#CMD [ "node", "dist/main.js" ]
