@echo off

cd server
start /wait "" npm i ^& exit
start /wait "" npx patch-package ^& exit
start /wait "" npm run build ^& exit
cd ..

cd common
start /wait "" npm i ^& exit
cd ..

cd client
start /wait "" npm i ^& exit
start /wait "" npx patch-package ^& exit
start /wait "" fixrolluppostcss.bat ^& exit
start /wait "" npm run build ^& exit
cd ..