import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, Divider } from 'react-native-paper';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

import UserProfilScreen from './UserProfilScreen';
import UserLisensiScreen from './UserLisensiScreen';
import UserStaffScreen from './UserStaffScreen';

const TopTab = createMaterialTopTabNavigator();

class UserListScreen extends React.Component {

  constructor(props) {
    super(props);

    //redux variable
    this.state = store.getState();  
    store.subscribe(()=>{
      this.setState(store.getState());
    });
  }

  render() {
    return (
      <PaperProvider theme={theme}>

          <Appbar.Header style={{ backgroundColor: 'white' }}>
            <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
            <Appbar.Content title="Detail User" color= {theme.colors.primary} />
          </Appbar.Header>
        

          <TopTab.Navigator
              tabBarOptions={{
                pressColor: theme.colors.primary,
                indicatorStyle: { backgroundColor: theme.colors.primary },
              }}
              lazy={true}
              swipeEnabled={false}
          >
            <TopTab.Screen name="Profil" component={UserProfilScreen} />
            <TopTab.Screen name="Staff" component={UserStaffScreen} />
            <TopTab.Screen name="Lisensi" component={UserLisensiScreen} />
          </TopTab.Navigator>
          
      </PaperProvider>    
    );
  }
};


export default UserListScreen;