@echo off

cd server
start "" npm run start
cd ..

cd client
start "" npm run serve
cd ..