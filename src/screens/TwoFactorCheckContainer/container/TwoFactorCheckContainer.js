import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {
  goBack,
  navigate,
  navigateAndSimpleReset,
} from '../../../navigator/NavigationUtils';
import TwoFactorCheckComponent from '../component/TwoFactorCheckComponent';
import {
  twoFactorCode,
  verifyTFAOTP,
  fetchUserPreference,
} from '../../../store/actions';
import {handleFailureCallback} from '../../../util/apiHelper';
import {strings} from '../../../locales/i18n';
import {LOCAL_STORAGE} from '../../../constants/storage';
import AsyncStorage from '@react-native-community/async-storage';

class TwoFactorCheckContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyCode: '',
      qr_code: '',
      isErrOTP: false,
      errOTP: '',
    };
  }

  componentDidMount() {}

  onPressLeftContent = () => {
    goBack();
  };

  onVerifyCodeChange = text => {
    this.setState({
      verifyCode: text,
      errOTP: '',
    });
  };

  onVerifyCodePress = () => {
    const {verifyCode} = this.state;
    if (verifyCode === '' || verifyCode === null) {
      this.setState({
        errOTP: strings('error.errEmpty'),
      });
      return;
    }

    if (verifyCode && verifyCode.length < 6) {
      this.setState({
        errOTP: strings('error.errTwoFACode'),
      });
      return;
    }

    let param = {
      totp: verifyCode,
    };
    this.props.verifyTFAOTP(param, {
      SuccessCallback: res => {
        if (res?.ok) {
          this.apiFetchUserPreference();
        }
      },
      FailureCallback: res => {
        handleFailureCallback(res, true, true, true);
      },
    });
  };

  recoveryCodeBtnPress = () => {
    navigate('RecoveryCodeScreen');
  };

  apiFetchUserPreference = () => {
    this.props.fetchUserPreference(null, {
      SuccessCallback: res => {
        AsyncStorage.setItem(
          LOCAL_STORAGE.USER_PREFERENCE,
          JSON.stringify(res),
        );
        AsyncStorage.setItem(LOCAL_STORAGE.IS_LOGIN, 'true');
        navigateAndSimpleReset('MainNavigator');
      },
      FailureCallback: res => {
        handleFailureCallback(res);
      },
    });
  };

  render() {
    let state = this.state;
    return (
      <>
        <TwoFactorCheckComponent
          onPressLeftContent={this.onPressLeftContent}
          onVerifyCodeChange={this.onVerifyCodeChange}
          onSubmitVerifyCode={this.onVerifyCodePress}
          state={state}
          onSubmit={this.onVerifyCodePress}
          recoveryCodeBtnPress={this.recoveryCodeBtnPress}
          tittle={strings('login.enter_2fa_code')}
          tittle2={strings('login.enter_2fa_code_note')}
          inputLabel={strings('login.2fa_code')}
          btnLabel={strings('button.verify_code')}
          showRecoveryLabel={true}
          isLoading={this.props.isLoading}
        />
      </>
    );
  }
}

const mapActionCreators = {twoFactorCode, verifyTFAOTP, fetchUserPreference};
const mapStateToProps = state => {
  return {
    isLoading: state.global.loading,
  };
};
export default connect(
  mapStateToProps,
  mapActionCreators,
)(TwoFactorCheckContainer);
