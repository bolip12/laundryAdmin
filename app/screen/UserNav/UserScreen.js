import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Divider, IconButton, Menu, Button, Text, Subheading, Chip, TouchableRipple } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import supabase from '../../config/supabase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormatSupa from '../../comp/dateFormatSupa.js';
import dateTimeFormatSupa from '../../comp/dateTimeFormatSupa.js';

class UserScreen extends React.Component {

  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        dataList: [],

        openMenu: false,
        
      };

  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });

    let { data, error } = await supabase
          .from('user')
          .select('id, nama, nama_usaha, email, license_date')          
          .is('pid', null)

    //data
    let dataList = [];
    data.map(row => {
      this.setState({['displayMenu'+row.id]:false})
    });

    //result
    this.setState({dataList:data});
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });

  }

  onDesc(item) {
    return(
      <View>
        <Caption style={styleApp.Caption}>{item.email}</Caption>
        <Caption style={styleApp.Caption}>License: {dateTimeFormatSupa(item.license_date)}</Caption>
      </View>
    )
  }

  toggleMenu(id) {
      this.setState({['displayMenu'+id]: !this.state.['displayMenu'+id] });
  }

  async onLogout() {
    const { error } = supabase.auth.signOut()

    if(error) {
      store.dispatch({
          type: 'NOTIF',
          payload: { notifDisplay:true, notifType:'error', notifMessage:error.message }
      });

    } else {
      AsyncStorage.setItem('@loginAuto', '');

      store.dispatch({
        type: 'LOGIN',
        payload: { isLogin:false/*, uid:'', cid:'', cidOrigin:'', uEmail:'', uNama:'' */}
      });
    }

  }

  async onLogoutMacAddress(docId) {
    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

    let response = [];

      response = await supabase
          .from('user')
          .update([{  
                login_macaddress: null,
                login_devicename: null,
              }])
          .eq('id', docId);

    if(response.error) {
        store.dispatch({
                type: 'NOTIF',
                payload: { notifDisplay:true, notifType:'error', notifMessage:response.error.message }
            });

      } else {
        store.dispatch({
                type: 'NOTIF',
                payload: { notifDisplay:true, notifMessage:'Logout berhasil' }
            });
      }

    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });

  }

  render() {
    return (
      <PaperProvider theme={theme}>

        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.Content title="User" color= {theme.colors.primary} />
          {/*<Appbar.Action icon="logout" color={theme.colors.primary} onPress={() => this.onLogout()} />*/}
        </Appbar.Header>

        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.dataList}
          keyExtractor={(item) => item.id}
          style={styleApp.FlatList}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={item.nama_usaha}
                description={() => this.onDesc(item)}
                left={props => <Badge style={{ backgroundColor: theme.colors.primary, margin: 10, marginBottom: 25 }} size={40}>{item.nama_usaha.charAt(0)}</Badge>}
                right={() => <Menu
                                visible={this.state.['displayMenu'+item.id]}
                                onDismiss={() => this.toggleMenu(item.id)}
                                anchor={<IconButton icon="dots-vertical" onPress={(event) => this.toggleMenu(item.id)} />}>
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserLisensiScreen', {user_id:item.id, nama_usaha:item.nama_usaha, nama:item.nama, license_date:item.license_date})} icon="account-check-outline" title="License" />
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserStaffScreen', {user_id:item.id})} icon="account-group-outline" title="Staff" />
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserProfilScreen', {user_id:item.id})} icon="account-outline" title="Profile" />
                                <Menu.Item onPress={() => this.onLogoutMacAddress(item.id)} icon="logout" title="Clear Macaddress" />
                              </Menu>}
              />
              <Divider />
            </View>
          )}
        />

      </PaperProvider>
    );
  }
};


export default UserScreen;