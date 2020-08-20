'use strict';

import React from 'react';
import {Logger} from 'aws-amplify';
import {Avatar, IconRegistry, ApplicationProvider} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';

const logger = new Logger('auth components');

import {Authenticator} from 'aws-amplify-react-native';
import {AuthStyle, AuthHeaderStyle, Context} from '../../components';

const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password',
    },
  ],
};

export function Authentication(Comp) {
  class Wrapper extends React.Component {
    constructor(props) {
      super(props);

      this.handleAuthStateChange = this.handleAuthStateChange.bind(this);

      this.state = {authState: props.authState};
    }

    handleAuthStateChange(state, data) {
      this.setState({authState: state, authData: data});
      if (this.props.onStateChange) {
        this.props.onStateChange(state, data);
      }
    }

    render() {
      const {authState, authData} = this.state;
      const signedIn = authState === 'signedIn';
      if (signedIn) {
        return (
          <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
              <Comp
                {...this.props}
                authState={authState}
                authData={authData}
                onStateChange={this.handleAuthStateChange}
              />
            </ApplicationProvider>
          </>
        );
      }

      return (
        <>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva.light}>
            <View style={AuthHeaderStyle.logoView}>
              <Avatar
                style={AuthHeaderStyle.logo}
                size="large"
                source={require('../../assets/logo.png')}
              />
            </View>
            <Authenticator
              {...this.props}
              usernameAttributes="email"
              signUpConfig={signUpConfig}
              theme={AuthStyle}
              onStateChange={this.handleAuthStateChange}
            />
          </ApplicationProvider>
        </>
      );
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
