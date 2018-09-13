FROM node

COPY . .

RUN npm install

EXPOSE 22350

CMD ["npm", "start"]
