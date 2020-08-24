rm -rf node_modules
yarn install
rm -rf /tmp/metro-*

watchman watch-del-all
yarn start --reset-cache
#react-native start --reset-cache
