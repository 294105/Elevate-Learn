FROM node:18

WORKDIR /app

# Install build tools for native modules like bcrypt
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install nodemon globally
RUN npm install -g nodemon

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

EXPOSE 5000

CMD ["nodemon", "server.js"]
