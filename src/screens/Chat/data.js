module.exports.templates = {
  replies: {
    intro: [
      "Let's start a new investigation! \n\nSend us a CT scan, a X-Ray or any other medical image, and let's discuss about it!",
    ],
    on_task: [
      "I'll analyze that asap!!",
      'Gimme a sec',
      'Working on it!',
      'On it',
      'This might take a while!',
    ],
    on_upload: ['That looks like a {{}}!'],
    on_invalid_input: [
      'Please ask a valid question!',
      "That's not a question!",
      'Sorry, I cannot recognize that input. Try something else!',
    ],
    on_miss: [
      'Nothing found. Try something else!',
      'No verdict here!',
      'Sorry, no idea!',
      'Please try something else!',
    ],
  },
  messages: {
    on_error: {
      title: 'Error',
      description: 'Something went wrong',
    },
    on_invalid_input: {
      title: 'Error',
      description: 'Please upload a medical image!',
    },
  },
  router_labels: {
    XR_ELBOW: 'an elbow X-Ray',
    XR_FOREARM: 'a forearm X-Ray',
    XR_HAND: 'a hand X-Ray',
    XR_HUMERUS: 'a humerus X-Ray',
    XR_SHOULDER: 'a should X-Ray',
    XR_WRIST: 'a wrist X-Ray',
    brain: 'a brain scan',
    breast: 'a breast scan',
    chest_xray: 'a chest X-Ray',
    eyes: 'an eyes scan',
    heart: 'a heart scan',
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
