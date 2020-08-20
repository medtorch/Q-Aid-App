import React from 'react';

class Models {
  constructor() {
    this.server = 'https://q-and-aid.com';
    this.method = 'POST';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  image_helper(route, img, cbk) {
    var payload = {
      image_b64: img,
    };

    fetch(this.server + route, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('got response ', route, responseData);

        if (responseData['answer'] !== null) {
          return cbk(null, responseData['answer']);
        } else {
          return cbk('no result', null);
        }
      })
      .catch((err) => cbk(err, null));
  }

  image_router(img, cbk) {
    return this.image_helper('/router', img, cbk);
  }
  prefilter(img, cbk) {
    return this.image_helper('/prefilter', img, cbk);
  }
  vqa(img, query, cbk) {
    console.log('vqa query ', img, query);
    var payload = {
      image_b64: img,
      question: query,
    };

    fetch(this.server + '/vqa', {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData['answer'] !== null) {
          return cbk(null, responseData['answer']);
        } else {
          return cbk('no result', null);
        }
      })
      .catch((error) => {
        return cbk(error, null);
      });
  }
}

module.exports.Models = Models;
