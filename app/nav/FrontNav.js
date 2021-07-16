import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, Text, Button } from 'react-native-paper';

import theme from '../config/theme.js';

import LandingScreen from '../screen/FrontNav/LandingScreen.js';
import LoginScreen from '../screen/FrontNav/LoginScreen.js';
/*import RegisterScreen from '../screen/FrontNav/RegisterScreen.js';*/

const FrontStack = createStackNavigator();

class FrontNav extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <PaperProvider theme={theme}>

      <NavigationContainer>
        <FrontStack.Navigator initialRouteName="LandingScreen" screenOptions={{headerShown:false}}>
          <FrontStack.Screen name="LandingScreen" component={LandingScreen} />
          <FrontStack.Screen name="LoginScreen" component={LoginScreen} />
          {/*<FrontStack.Screen name="RegisterScreen" component={RegisterScreen} />*/}
          
        </FrontStack.Navigator>
      </NavigationContainer>

    </PaperProvider>
    );
  }
}


export default FrontNav;
