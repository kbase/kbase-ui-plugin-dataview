
export XDG_CONFIG_HOME=${PWD}
export DIR=${PWD}
cd tools/node
docker compose run --rm node npm install
docker compose run --rm node npm run clean
docker compose run --rm node npm install
docker compose run --rm node npm run -e XDG_CONFIG_HOME=${XDG_CONFIG_HOME} install-bower
docker compose run --rm node npm run install-npm
docker compose run --rm node npm run remove-source-maps
docker compose run --rm node npm run install-dist
cd ../..
