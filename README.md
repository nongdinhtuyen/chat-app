# Full Stack Chat App

This is a full stack chat application. You can chat privately or in a group and send images if you wish.

## :triangular_flag_on_post: Getting Started

First of all you need to clone the repository and install the dependencies

```shell

git clone https://github.com/nongdinhtuyen/chat-app.git
cd client
yarn
cd ..
cd server
yarn
```

After doing this you must assign the following environment variables

```shell

--- CLIENT ---
VITE_BASE_URL=http://{{your Ip Address}}:8080/api/v1

--- SERVER ---
MONGODB_URI
PORT=8080

JWT_ACCESS_TOKEN=12345678
JWT_ACCESS_EXPIRE=1d

JWT_REFRESH_TOKEN=87654321
JWT_REFRESH_EXPIRE=1d
```

After doing run client and server

```shell
cd client
yarn dev
cd ..
cd server
yarn dev
```
Then go to http://localhost:5173/chat
