import React from "react";

class Models {
  constructor() {
    this.server = "https://q-and-aid.com";
    this.method = "POST";
    this.headers = {
      "Content-Type": "application/json",
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
        console.log("got response ", route, responseData);

        if (responseData["answer"] !== null) {
          return cbk(null, responseData["answer"]);
        } else {
          return cbk("no result", null);
        }
      })
      .catch((err) => cbk(err, null));
  }

  prefilter(img, cbk) {
    return this.image_helper("/prefilter", img, cbk);
  }

  segmentation(img, cbk) {
    return this.image_helper("/segmentation", img, cbk);
  }

  vqa(img, query, cbk) {
    var payload = {
      image_b64: img,
      question: query,
    };

    fetch(this.server + "/vqa", {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData["answer"] !== null) {
          var verdict = {
            total: responseData["answer"]["total"],
            data: null,
          };
          if (!responseData["answer"]["aggregated"]) {
            return cbk(null, verdict);
          }
          if (!responseData["answer"]["aggregated"]["vqa"]) {
            return cbk(null, verdict);
          }
          var results = responseData["answer"]["aggregated"]["vqa"];
          var best = -1;
          var most_likely = null;
          for (var val in results) {
            if (results[val] > best) {
              best = results[val];
              most_likely = val;
            }
          }
          verdict.data = most_likely;

          return cbk(null, verdict);
        } else {
          return cbk("no result", null);
        }
      })
      .catch((error) => {
        return cbk(error, null);
      });
  }
}

module.exports.Models = Models;
