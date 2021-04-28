import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Divider, IconButton, Menu, Button, Text, Subheading, Chip, TouchableRipple } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '../../config/firebase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';

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

    //query
    let query = firebase.firestore().collection('user').where('pid', '==', '-');

    //data
    const dataList = [];
    let self = this;
    const docList = await query.get();
    docList.forEach(doc => {
      const docData = doc.data();
      dataList.push({
        id : doc.id,
        nama: docData.nama,
        namaUsaha: docData.namaUsaha,
        email: docData.email,
        licenseDate: docData.licenseDate,
      });

      self.setState({['displayMenu'+doc.id]:false})
    });

    //result
    this.setState({dataList:dataList});
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });

  }

  onDesc(item) {
    return(
      <View>
        <Caption style={styleApp.Caption}>{item.email}</Caption>
        <Caption style={styleApp.Caption}>License: {dateFormat(item.licenseDate)}</Caption>
      </View>
    )
  }

  toggleMenu(id) {
      this.setState({['displayMenu'+id]: !this.state.['displayMenu'+id] });
  }

  async onLogout() {
    store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

      await firebase.auth().signOut().then(function() {
        AsyncStorage.setItem('@loginAuto', '');

        store.dispatch({
          type: 'LOGIN',
          payload: { isLogin:false, uid:'', pid:'', dbid:'', cid:'', cidOrigin:'', uEmail:'', uNama:'' }
        });
      });

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
          <Appbar.Action icon="logout" color={theme.colors.primary} onPress={() => this.onLogout()} />
        </Appbar.Header>

        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.dataList}
          keyExtractor={(item) => item.id}
          style={styleApp.FlatList}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={item.namaUsaha}
                description={() => this.onDesc(item)}
                left={props => <Badge style={{ backgroundColor: theme.colors.primary, margin: 10, marginBottom: 25 }} size={40}>{item.namaUsaha.charAt(0)}</Badge>}
                right={() => <Menu
                                visible={this.state.['displayMenu'+item.id]}
                                onDismiss={() => this.toggleMenu(item.id)}
                                anchor={<IconButton icon="dots-vertical" onPress={(event) => this.toggleMenu(item.id)} />}>
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserLisensiScreen', {userId:item.id, namaUsaha:item.namaUsaha, nama:item.nama, licenseDate:item.licenseDate})} icon="account-check-outline" title="License" />
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserStaffScreen', {userId:item.id})} icon="account-group-outline" title="Staff" />
                                <Menu.Item onPress={() => this.props.navigation.navigate('UserProfilScreen', {userId:item.id})} icon="account-outline" title="Profile" />
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