FROM node:alpine3.19

LABEL maintainer="0xmmq <mail@mmq.dev>"
LABEL version="1.0"
LABEL description="This is a script that interacts automatically with the scroll bridge."

WORKDIR /app

COPY . ./

RUN ["npm", "i"]
CMD ["npx", "ts-node", "index.ts"]