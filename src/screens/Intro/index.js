import {Image, View, Text, StyleService} from 'react-native';
import {Button} from 'react-native-elements';

import React from 'react';
import {AsyncStorage} from 'react-native';
import {Context, IntroStyle, palette} from '../../components';

import Onboarding from 'react-native-onboarding-swiper';

import {API, graphqlOperation} from 'aws-amplify';
import {getUser} from '../../graphql/queries';

const pages = [
  {
    backgroundColor: palette.background,
    image: <Image source={Context['Logo']} style={IntroStyle.image} />,
    title: 'Welcome to Q&Aid!',
    subtitle:
      'Explore the latest AI discoveries in healthcare. \n\n Ask a second opinion on medical images.',
  },
  {
    backgroundColor: palette.background,
    image: <Image source={Context['Logo']} style={IntroStyle.image} />,
    title: 'Welcome to Q&Aid!',
    subtitle: "Debate about a medical issue in the chatroom. \n\n Let's start!",
  },
];

export function Intro(Comp) {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);

      this.handleSkip = this.handleSkip.bind(this);
    }

    handleSkip = (state, data) => {
      Context['Onboarding']['SkipOnboarding'] = true;
      if (this.props.onStateChange) {
        this.props.onStateChange(state, data);
      }
    };

    renderInternal = (skipOnboarding) => {
      if (skipOnboarding) {
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
      return this.renderInternal(Context['Onboarding']['SkipOnboarding']);
    }
  }

  Object.keys(Comp).forEach((key) => {
    // Copy static properties in order to be as close to Comp as possible.
    // One particular case is navigationOptions
    try {
      const excludes = ['displayName', 'childContextTypes'];
      if (excludes.includes(key)) {
        return;
      }

      Wrapper[key] = Comp[key];
    } catch (err) {
      logger.warn('not able to assign ' + key, err);
    }
  });

  return Wrapper;
}
