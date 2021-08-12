import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Divider, IconButton, Menu, Button, Text, Subheading, Chip, TouchableRipple } from 'react-native-paper';

import supabase from '../../config/supabase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';
import dateTimeFormatSupa from '../../comp/dateTimeFormatSupa.js';

class UserStaffScreen extends React.Component {

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

     const user_id = this.state.userTabId;

    //query
    let { data, error } = await supabase
          .from('user')
          .select('id, nama, nama_usaha, email, license_date')
          .eq('pid', user_id)
          .order('id', {ascending: false})

    //data
    let dataList = [];
    data.map(row => {
      this.setState({['displayMenu'+row.id]:false})
    });
          
    this.setState({dataList:data});
    
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });
  }

  toggleMenu(id) {
      this.setState({['displayMenu'+id]: !this.state.['displayMenu'+id] });
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
  
  onDesc(item) {
    return(
      <View>
        <Caption style={styleApp.Caption}>{item.email}</Caption>
        <Caption style={styleApp.Caption}>License: {dateTimeFormatSupa(item.license_date)}</Caption>
      </View>
    )
  }


  render() {
    return (
      <PaperProvider theme={theme}>


        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.dataList}
          keyExtractor={(item) => item.id}
          style={styleApp.FlatList}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={item.nama}
                description={() => this.onDesc(item)}
                left={props => <Badge style={{ backgroundColor: theme.colors.primary, margin: 10, marginBottom: 25 }} size={40}>{item.nama.charAt(0)}</Badge>}
                onPress={() => this.props.navigation.navigate('UserStaffLisensiScreen', {staffId: item.id, namaUsaha:item.nama_usaha, nama:item.nama, licenseDate:item.license_date})}
                right={() => <Menu
                                visible={this.state.['displayMenu'+item.id]}
                                onDismiss={() => this.toggleMenu(item.id)}
                                anchor={<IconButton icon="dots-vertical" onPress={(event) => this.toggleMenu(item.id)} />}>
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserStaffLisensiScreen', {staffId: item.id, namaUsaha:item.nama_usaha, nama:item.nama, licenseDate:item.license_date})} icon="account-check" title="License" />
                                <Menu.Item onPress={() => this.onLogoutMacAddress(item.id)} icon="logout" title="Clear Macaddress" />
                              </Menu>}



                  /*<IconButton icon='account-check' size={35} onPress={() => this.props.navigation.navigate('UserStaffLisensiScreen', {staffId: item.id, namaUsaha:item.nama_usaha, nama:item.nama, licenseDate:item.license_date})} />*/
                
              />
              <Divider />
            </View>
          )}
        />

      </PaperProvider>
    );
  }
};


export default UserStaffScreen;