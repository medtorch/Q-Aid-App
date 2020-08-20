import React from 'react';
import {Alert} from 'react-native';

module.exports.CreateAlert = function (msg) {
  Alert.alert(
    msg.title,
    msg.description,
    [
      {
        text: 'Got it!',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
};
