FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Install some depenendencies
COPY package.json .
RUN yarn install
COPY . ./

# Uses port which is used by the actual application
EXPOSE 8000

# Default command
CMD ["yarn", "start:dev"]