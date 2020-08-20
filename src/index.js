import Amplify from '@aws-amplify/core';
import awsconfig from '../aws-exports';
import {YellowBox} from 'react-native';

import {Authentication, Home} from './screens';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

YellowBox.ignoreWarnings(['']);

const App = Authentication(Home);

export default App;
