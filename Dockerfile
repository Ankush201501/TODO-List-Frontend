FROM node:18

WORKDIR /app

# Add .npmrc first
COPY .npmrc ./

COPY package*.json ./
COPY vite.config.js ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
