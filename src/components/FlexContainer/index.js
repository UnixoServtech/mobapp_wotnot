import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

const FlexContainer = ({
  children,
  statusBarColor = 'white',
  bottomSafeAreaColor = 'white',
  backgroundColor = 'white',
  isDarkContent = true,
  translucent = false,
}) => {
  return (
    <React.Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: statusBarColor}} />
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={isDarkContent ? 'dark-content' : 'light-content'}
        translucent={translucent}
        hidden={false}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: bottomSafeAreaColor}}>
        <View style={{flex: 1, backgroundColor}}>{children}</View>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default FlexContainer;
