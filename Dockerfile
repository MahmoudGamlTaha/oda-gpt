FROM node:16.14.2
WORKDIR .
COPY package*.json ./
# Install project dependencies
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000/tcp
CMD [ "node", "dist/main.js" ]