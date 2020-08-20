import {AmplifyTheme} from 'aws-amplify-react-native';

const palette = {
  red: '#E63946',
  green: '#F1FAEE',
  blue: '#A8DADC',
  night_blue: '#457B9D',
  slate: '#1D3557',
  background: '#FFFFFF',
};

const AuthStyle = {
  ...AmplifyTheme,
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
    backgroundColor: palette.background,
  },
  section: {
    flex: 1,
    width: '100%',
    padding: 30,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 32,
  },
  sectionHeaderText: {
    color: palette.slate,
    fontSize: 20,
    fontWeight: '500',
  },
  sectionFooter: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  sectionFooterLink: {
    fontSize: 14,
    color: palette.slate,
    alignItems: 'baseline',
    textAlign: 'center',
  },
  navBar: {
    marginTop: 35,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: palette.slate,
    marginLeft: 12,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    width: '50%',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorRowText: {
    marginLeft: 10,
  },
  photo: {
    width: '100%',
  },
  album: {
    width: '100%',
  },
  button: {
    backgroundColor: palette.slate,
    alignItems: 'center',
    padding: 16,
  },
  buttonDisabled: {
    backgroundColor: palette.slate,
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: palette.blue,
    fontSize: 14,
    fontWeight: '600',
  },
  formField: {
    marginBottom: 22,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: palette.slate,
  },
  inputLabel: {
    marginBottom: 8,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 2,
    padding: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: palette.slate,
  },
  picker: {
    flex: 1,
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
};

const AuthHeaderStyle = {
  logo: {
    alignItems: 'center',
    backgroundColor: palette.background,
  },
  logoView: {
    marginTop: 10,
    justiftyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.background,
  },
};

const IntroStyle = {
  image: {
    width: undefined,
    height: '50%',
    aspectRatio: 1,

    backgroundColor: palette.background,
  },
  title: {
    color: palette.slate,
  },
  subtitle: {
    color: palette.night_blue,
  },
  container: {
    backgroundColor: palette.background,
  },

  buttonStyle: {
    backgroundColor: palette.slate,
  },
  containerViewStyle: {
    marginVertical: 10,
    backgroundColor: palette.background,
  },
  textStyle: {color: palette.night_blue},
};

const ChatStyle = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: palette.background,
  },
  button: {
    backgroundColor: palette.slate,
    alignItems: 'center',
    padding: 16,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalImage: {
    paddingVertical: 10,
    width: '100%',
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 20,
  },
  bubble: {
    right: {backgroundColor: palette.slate},
  },
};

export {palette, AuthStyle, AuthHeaderStyle, IntroStyle, ChatStyle};
