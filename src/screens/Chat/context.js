import React from "react";
import { get_pretty_category } from "./data";

class ChatContext {
  constructor() {
    this.reset();
  }

  reset() {
    this.source = require("../../assets/upload.png");
    this.image_value = null;
    this.valid = false;
    this.topic = null;
    this.anomalies = {
      total_sources: 0,
      what: null,
      why: null,
      where: null,
    };
    this.total_sources = 0;
  }

  on_source(src) {
    this.source = {
        uri: src,
    };
  }

  on_prefilter(img, prefilter) {
    this.valid = false;
    if (prefilter["valid"] === true) this.valid = true;

    if (!this.valid) {
      this.reset();
      return;
    }
    this.image_value = img;

    if (prefilter["topic"])
      this.topic = get_pretty_category(prefilter["topic"]);
    if (!prefilter["anomalies"]) return;

    var detected_anomalies = prefilter["anomalies"];
    if (detected_anomalies["total"] == null || detected_anomalies["total"] == 0)
      return;

    this.total_sources = detected_anomalies["total"];
    if (detected_anomalies["has"] == null || detected_anomalies["has"] == 0)
      return;

    this.anomalies.total_sources = detected_anomalies["has"];

    var keys = ["why", "where", "what"];
    for (var idx in keys) {
      var best = -1;
      var most_likely = null;
      for (var val in detected_anomalies[keys[idx]]) {
        if (detected_anomalies[keys[idx]][val] > best) {
          best = detected_anomalies[keys[idx]][val];
          most_likely = val;
        }
      }
      console.log("anomaly ", keys[idx], " --> ", most_likely);
      this.anomalies[keys[idx]] = most_likely;
    }
  }
}

module.exports.ChatContext = ChatContext;
