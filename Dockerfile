##########################################################
#                    BUILD STAGE                         #
##########################################################

FROM node:16-alpine as builder

# Add build deps
RUN apk add --no-cache gcc make python3 musl-dev g++

COPY ./client /app/client

WORKDIR /app/client

RUN npm i

RUN npm run client_build

##########################################################
#                  OUPUT STAGE                           #
##########################################################

FROM node:16-alpine as final

ENV NODE_ENV=production

COPY --from=builder /app/client/dist /app/client/dist
COPY ./server /app/server

WORKDIR /app/server
RUN npm i

EXPOSE 3000/tcp
EXPOSE 8080/tcp

CMD npm start
