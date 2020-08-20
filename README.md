<p align="center">
  <img align="center" src="https://github.com/medtorch/Q-Aid/blob/master/misc/q_aid_logo_small1.png" alt="Q&Aid" width="75%">
</p>

## Run server

```
rm -rf node_modules
yarn install
rm -rf /tmp/metro-*

watchman watch-del-all
yarn start --reset-cache
```

## Run Android

```
react-native run-android
```
