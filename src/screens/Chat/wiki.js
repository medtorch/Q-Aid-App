import React from "react";
import { GetReplyContent } from "./data.js";
import { DictionaryAPIKey } from "../../secrets.js";

class Wiki {
  constructor() {
    this.cache = {};
  }

  ask(search, cbk, fallback = false) {
    const self = this;

    if (search in this.cache) {
      return cbk(null, this.cache[search]);
    }

    const query =
      "https://www.dictionaryapi.com/api/v3/references/medical/json/" +
      search +
      "?key=" +
      DictionaryAPIKey;

    fetch(query)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.length == 0) {
          return cbk("fail", GetReplyContent("on_dictionary_error"));
        }
        for (var idx in responseData) {
          if (typeof responseData[idx] == "string") {
            if (!fallback) {
              return self.ask(responseData[idx], cbk, true);
            }
            var template = GetReplyContent("on_dictionary_miss");
            template = template.replace("%s", responseData[idx]);
            self.cache[search] = template;
            return cbk("miss", template);
          } else if (responseData[idx]["shortdef"]) {
            var template = GetReplyContent("on_dictionary_hit");

            template = template.replace("%s", responseData[idx]["meta"]["id"]);
            template = template.replace("%s", responseData[idx]["shortdef"][0]);
            self.cache[search] = template;
            return cbk(null, template);
          } else return cbk(GetReplyContent("on_dictionary_error"));
        }
        return cbk("fail", GetReplyContent("on_dictionary_error"));
      })
      .catch((error) => {
        console.log("got error ", error);
        return cbk("fail", GetReplyContent("on_dictionary_error"));
      });
  }
}

module.exports.Wiki = Wiki;
