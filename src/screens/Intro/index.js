import { Image, View, Text, StyleService } from "react-native";
import { Button } from "react-native-elements";

import React from "react";
import { Context, IntroStyle, palette } from "../../components";

import Onboarding from "react-native-onboarding-swiper";
import AsyncStorage from "@react-native-community/async-storage";

import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../../graphql/queries";

const pages = [
  {
    backgroundColor: palette.background,
    image: <Image source={Context["IntroLogo"]} style={IntroStyle.image} />,
    title: "Welcome to Q&Aid!",
    subtitle:
      " Explore the latest AI discoveries in healthcare. \n\n Ask a second opinion on medical images.",
  },
  {
    backgroundColor: palette.background,
    image: <Image source={Context["IntroLogo2"]} style={IntroStyle.image} />,
    title: "Welcome to Q&Aid!",
    subtitle:
      "Connect to several hospitals for your investigation. \n\n Let's start!",
  },
];

export function Intro(Comp) {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);

      this.handleSkip = this.handleSkip.bind(this);
      this.state = { skip: Context["Onboarding"]["SkipOnboarding"] };
    }
    componentDidMount() {
      AsyncStorage.getItem("skipOnboarding").then((cached) => {
        if (cached) {
          console.log("skip cached", cached);
          this.setState({ skip: true });
          Context["Onboarding"]["SkipOnboarding"] = true;
        }
      });
    }

    handleSkip = (state, data) => {
      Context["Onboarding"]["SkipOnboarding"] = true;
      AsyncStorage.setItem("skipOnboarding", "1").catch((err) =>
        console.log("failed to save state ", err)
      );
      if (this.props.onStateChange) {
        this.props.onStateChange(state, data);
      }
    };

    renderInternal = () => {
      if (this.state.skip) {
        return (
          <>
            <Comp {...this.props} />
          </>
        );
      }

      return (
        <Onboarding
          showNext={false}
          showSkip={false}
          onDone={this.handleSkip}
          onSkip={this.handleSkip}
          titleStyles={IntroStyle.title}
          subTitleStyles={IntroStyle.subtitle}
          containerStyles={IntroStyle.container}
          imageContainerStyles={IntroStyle.image}
          bottomBarHighlight={false}
          transitionAnimationDuration={10}
          pages={pages}
        />
      );
    };
    render() {
      return this.renderInternal();
    }
  }

  Object.keys(Comp).forEach((key) => {
    // Copy static properties in order to be as close to Comp as possible.
    // One particular case is navigationOptions
    try {
      const excludes = ["displayName", "childContextTypes"];
      if (excludes.includes(key)) {
        return;
      }

      Wrapper[key] = Comp[key];
    } catch (err) {
      logger.warn("not able to assign " + key, err);
    }
  });

  return Wrapper;
}
