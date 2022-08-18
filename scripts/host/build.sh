export XDG_CONFIG_HOME=${PWD}
export DIR=${PWD}
cd tools/node
echo "Installing packages..."
docker compose run --rm node npm install
echo "Cleaning ..."
docker compose run --rm node npm run clean
echo "Installing packages..."
docker compose run --rm node npm install
echo "Installing bower packages..."
docker compose run --rm  -e XDG_CONFIG_HOME=${XDG_CONFIG_HOME} node npm run install-bower
echo "Copying npm packages..."
docker compose run --rm node npm run install-npm
echo "Removing source maps..."
docker compose run --rm node npm run remove-source-maps
echo "Preparing dist..."
docker compose run --rm node npm run install-dist
echo "DONE!"
cd ../..
