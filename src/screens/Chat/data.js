module.exports.templates = {
  replies: {
    intro: [
      "Let's start a new investigation! \n\nSend us a CT scan, a X-Ray or any other medical image, and let's discuss about it!",
    ],
    on_task: [
      "I'll analyze that asap!!",
      "Gimme a sec",
      "Working on it!",
      "On it",
      "This might take a while!",
    ],
    on_upload: [
      "That looks like %s!",
      "Your upload looks like %s!",
      "I hope I'm not wrong, but that looks like %s!",
    ],
    on_invalid_input: [
      "Please ask a valid question!",
      "That's not a question!",
      "Sorry, I cannot recognize that input. Try something else!",
    ],
    on_miss: [
      "Nothing found. Try something else!",
      "No verdict here!",
      "Please try something else!",
    ],
    on_no_hip: [
      "Unfortunately, none of our intelligence providers could analyze the input!",
      "I'm sorry, but I analyze the image!",
    ],

    on_hip_no_anomalies: [
      "%s health intelligence providers analyzed your input and lukily, they didn't find anything abnormal!",
      "%s HIPs say there isn't anything abnormal in your photo!",
    ],
    on_hip_anomalies: [
      "Unfortunately, %s/%s of the health intelligence providers found abnormalities in your input!",
      "Unfortunately, %s/%s of the HIPs found issues in your photo!",
    ],
    on_prefilter_anomaly: [
      "The sources identified %s in the %s area. One of the possible reasons could be %s!",
      "There seems to be %s in the %s area. One of the possible reasons could be %s!",
    ],
  },
  messages: {
    on_error: {
      title: "Error",
      description: "Something went wrong",
    },
    on_invalid_input: {
      title: "Error",
      description: "Please upload a valid medical image!",
    },
  },
  router_labels: {
    xr_elbow: "an elbow X-Ray",
    xr_forearm: "a forearm X-Ray",
    xr_hand: "a hand X-Ray",
    xr_hummerus: "a humerus X-Ray",
    xr_shoulder: "a shoulder X-Ray",
    xr_wrist: "a wrist X-Ray",
    scan_brain: "a brain scan",
    scan_breast: "a breast scan",
    xr_chest: "a chest X-Ray",
    scan_eyes: "an eyes scan",
    scan_heart: "a heart scan",
  },
};

module.exports.get_reply = function (type) {
  return module.exports.templates.replies[type][
    Math.floor(Math.random() * module.exports.templates.replies[type].length)
  ];
};

module.exports.get_pretty_category = function (input) {
  return module.exports.templates.router_labels[input];
};
