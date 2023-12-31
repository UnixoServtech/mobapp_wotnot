import React, {Component} from 'react';
import {View, Text, Alert} from 'react-native';
import {accountList, languageList} from '../../../constants/settings';
import SettingScreenComponent from '../component/SettingScreenComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {LOCAL_STORAGE, removeItemFromStorage} from '../../../constants/storage';
import {
  navigateAndSimpleReset,
  navigate,
} from '../../../navigator/NavigationUtils';
import {connect} from 'react-redux';
import {
  userLogout,
  fetchAccounts,
  fetchUserPreference,
  changeAccount,
} from '../../../store/actions';
import {handleFailureCallback} from '../../../util/apiHelper';

class SettingScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      isActive: false,
      accountStatus: accountList?.[0]?.label,
      selectedLanguage: 'English',
      isOpen: false,
      isLoading: false,
    };
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onNotificationClick = this.onNotificationClick.bind(this);
    this.onHelpDeskClick = this.onHelpDeskClick.bind(this);
    this.accountModalRef = React.createRef();
    this.languageModalRef = React.createRef();
    this.logoutRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.cllFetchAccounts();
      this.callFetchUserPreference();
    });
    // this.cllFetchAccounts();
    // this.callFetchUserPreference();
  }

  onLogoutClick = async () => {
    this.setState({isOpen: true});
  };

  onNotificationClick = () => {};

  onSwitchToggle = () => {
    this.setState({isActive: !this.state.isActive});
  };

  onPressAccountDropdown = () => {
    this.accountModalRef?.current?.open();
  };

  onAccountListPress = (item, index) => {
    this.setLoader(true);
    this.callChangeAccount(item?.key);
    // this.setState(
    //   {
    //     accountStatus: item?.label,
    //   },
    //   () => {
    //     this.accountModalRef?.current?.close();
    //   },
    // );
  };

  onPressLanguageDropdown = () => {
    this.languageModalRef?.current?.open();
  };

  onLanguageSelected = (item, index) => {
    //code
    this.setState(
      {
        selectedLanguage: item?.languageName,
      },
      () => {
        this.languageModalRef?.current?.close();
      },
    );
  };

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  logoutButtonPress = () => {
    this.onClose();
    this.props.userLogout({
      SuccessCallback: async res => {
        Object.keys(LOCAL_STORAGE).map(key =>
          removeItemFromStorage(LOCAL_STORAGE[key]),
        );
        // await AsyncStorage.setItem(LOCAL_STORAGE.IS_LOGIN, 'false');
        // await AsyncStorage.setItem(
        //   LOCAL_STORAGE.USER_PREFERENCE,
        //   JSON.stringify({}),
        // );
        navigateAndSimpleReset('SignInScreen');
      },
      FailureCallback: res => {},
    });
  };

  cllFetchAccounts = () => {
    this.props.fetchAccounts({
      SuccessCallback: res => {},
      FailureCallback: res => {
        handleFailureCallback(res);
      },
    });
  };

  callFetchUserPreference = () => {
    this.props.fetchUserPreference(null, {
      SuccessCallback: res => {
        AsyncStorage.setItem(
          LOCAL_STORAGE?.USER_PREFERENCE,
          JSON.stringify(res),
        );
      },
      FailureCallback: res => {
        handleFailureCallback(res, true, true);
      },
    });
  };

  callChangeAccount = account_key => {
    let param = {
      account_key: account_key,
    };
    this.props.changeAccount(param, {
      SuccessCallback: res => {
        this.setLoader(false);
      },
      FailureCallback: res => {
        this.setLoader(false);
        handleFailureCallback(res);
      },
    });
    this.accountModalRef?.current?.close();
  };

  setLoader = value => {
    this.setState({isLoading: value});
  };

  onHelpDeskClick = () => {
    navigate('HelpDeskScreen');
  };

  render() {
    let state = this.state;
    const {userPreference, accounts} = this.props;
    return (
      <>
        <SettingScreenComponent
          accountDropdownValue={userPreference?.account_name}
          languageDropdownValue={state.selectedLanguage}
          onLogoutClick={this.onLogoutClick}
          onNotificationClick={this.onNotificationClick}
          onSwitchToggle={this.onSwitchToggle}
          isActive={state.isActive}
          name={userPreference?.logged_in_user_name}
          email={userPreference?.email}
          profilePhoto={userPreference?.image_url?.small}
          onPressAccountDropdown={this.onPressAccountDropdown}
          accountModalRef={this.accountModalRef}
          accountList={accounts}
          languageList={languageList}
          onAccountListPress={(item, index) =>
            this.onAccountListPress(item, index)
          }
          onPressLanguageDropdown={this.onPressLanguageDropdown}
          languageModalRef={this.languageModalRef}
          onLanguageSelected={(item, index) =>
            this.onLanguageSelected(item, index)
          }
          cancelRef={this.logoutRef}
          isOpen={state.isOpen}
          onClose={this.onClose}
          logoutButtonPress={this.logoutButtonPress}
          account_id={userPreference?.account_id}
          isLoading={state.isLoading}
          onHelpDeskClick={this.onHelpDeskClick}
        />
      </>
    );
  }
}

const mapActionCreators = {
  userLogout,
  fetchAccounts,
  fetchUserPreference,
  changeAccount,
};
const mapStateToProps = state => {
  return {
    isInternetConnected: state.global.isInternetConnected,
    isLoading: state.global.loading,
    userPreference: state.detail?.userPreference,
    accounts: state.settings?.accounts?.account_info,
  };
};
export default connect(
  mapStateToProps,
  mapActionCreators,
)(SettingScreenContainer);
