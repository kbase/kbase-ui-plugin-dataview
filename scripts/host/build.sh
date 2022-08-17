cd tools/node
DIR=`pwd`/../.. docker compose run --rm node npm install
DIR=`pwd`/../.. docker compose run --rm node npm run clean
DIR=`pwd`/../.. docker compose run --rm node npm install
DIR=`pwd`/../.. docker compose run --rm node npm run install-bower
DIR=`pwd`/../.. docker compose run --rm node npm run install-npm
DIR=`pwd`/../.. docker compose run --rm node npm run remove-source-maps
DIR=`pwd`/../.. docker compose run --rm node npm run install-dist
cd ../..
