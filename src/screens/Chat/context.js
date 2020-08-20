import React from 'react';

class ChatContext {
  constructor() {
    this.reset();
  }

  reset() {
    this.source = {
      uri:
        'https://thumbs.dreamstime.com/b/icon-ray-examination-xray-152986240.jpg',
    };
    this.image_value = null;

    this.state = 'invalid';
    this.category = null;
  }
}

module.exports.ChatContext = ChatContext;
