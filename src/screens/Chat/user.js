import React from 'react';
import {Auth} from 'aws-amplify';

class User {
  constructor() {
    this.reset();
  }

  reset() {
    this.user = {
      _id: 1,
      name: 'Anonymous',
    };
  }
  load() {
    var self = this;
    Auth.currentSession()
      .then((data) => {
        self.user.name = data['accessToken']['payload']['username'];
        console.log('user ', self.user.name);
      })
      .catch((err) => console.log(err));
  }

  async signOut() {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
}
module.exports.User = User;
