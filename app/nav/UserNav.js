import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, Text, Button } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import theme from '../config/theme.js';

import UserScreen from '../screen/UserNav/UserScreen.js';
import UserProfilScreen from '../screen/UserNav/UserProfilScreen';
import UserPaymentScreen from '../screen/UserNav/UserPaymentScreen';
import UserPaymentInsertScreen from '../screen/UserNav/UserPaymentInsertScreen';
import UserStaffScreen from '../screen/UserNav/UserStaffScreen';
import UserStaffPaymentScreen from '../screen/UserNav/UserStaffPaymentScreen';
import UserStaffPaymentInsertScreen from '../screen/UserNav/UserStaffPaymentInsertScreen';
import UserLisensiScreen from '../screen/UserNav/UserLisensiScreen';
import UserLisensiPerpanjangScreen from '../screen/UserNav/UserLisensiPerpanjangScreen';
import UserStaffLisensiScreen from '../screen/UserNav/UserStaffLisensiScreen';
import UserStaffLisensiPerpanjangScreen from '../screen/UserNav/UserStaffLisensiPerpanjangScreen';

import PaymentScreen from '../screen/UserNav/PaymentScreen';
/*import PaymentDetailScreen from '../screen/UserNav/PaymentDetailScreen.js';*/

const BottomTab = createMaterialBottomTabNavigator();
const UserStack = createStackNavigator();

class UserNav extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <PaperProvider theme={theme}>

      <NavigationContainer>
        <BottomTab.Navigator
              activeColor= { theme.colors.primary }
              inactiveColor="grey"
              barStyle={{ backgroundColor: 'white' }} 
              shifting={false}
          >
            <BottomTab.Screen 
              name="UserScreen"
              options={{
                tabBarLabel: 'User',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons name="account" color={color} size={25} />)
              }}
            >
            {() => (
            <UserStack.Navigator initialRouteName="UserScreen" screenOptions={{headerShown:false}}>
              <UserStack.Screen name="UserScreen" component={UserScreen} />
              <UserStack.Screen name="UserProfilScreen" component={UserProfilScreen} />
              <UserStack.Screen name="UserPaymentScreen" component={UserPaymentScreen} />
              <UserStack.Screen name="UserPaymentInsertScreen" component={UserPaymentInsertScreen} />
              <UserStack.Screen name="UserStaffScreen" component={UserStaffScreen} />
              <UserStack.Screen name="UserStaffPaymentScreen" component={UserStaffPaymentScreen} />
              <UserStack.Screen name="UserStaffPaymentInsertScreen" component={UserStaffPaymentInsertScreen} />
              <UserStack.Screen name="UserLisensiScreen" component={UserLisensiScreen} />
              <UserStack.Screen name="UserLisensiPerpanjangScreen" component={UserLisensiPerpanjangScreen} />
              <UserStack.Screen name="UserStaffLisensiScreen" component={UserStaffLisensiScreen} />
              <UserStack.Screen name="UserStaffLisensiPerpanjangScreen" component={UserStaffLisensiPerpanjangScreen} />
              
            </UserStack.Navigator>
            )}
            </BottomTab.Screen>

            <BottomTab.Screen 
              name="PaymentScreen"
              options={{
                tabBarLabel: 'Payment',
                tabBarIcon: ({color}) => (
                  <FontAwesome5 name="money-bill" color={color} size={20} />)
              }}
            >
            {() => (
            <UserStack.Navigator initialRouteName="PaymentScreen" screenOptions={{headerShown:false}}>
              <UserStack.Screen name="PaymentScreen" component={PaymentScreen} />
              {/*<UserStack.Screen name="PaymentDetailScreen" component={PaymentDetailScreen} />*/}
            </UserStack.Navigator>
            )}
            </BottomTab.Screen>

        </BottomTab.Navigator>
      </NavigationContainer>

    </PaperProvider>
    );
  }
}


export default UserNav;
