import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Divider, IconButton, Menu, Button, Text, Subheading, Chip, TouchableRipple } from 'react-native-paper';

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

    const userId = this.props.route.params.userId;

    //query
    let query = firebase.firestore().collection('user').where('pid', '==', userId);

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

  render() {
    return (
      <PaperProvider theme={theme}>

        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="User Staff" color= {theme.colors.primary} />
        </Appbar.Header>

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
                right={() => <IconButton icon='account-check' size={35} onPress={() => this.props.navigation.navigate('UserStaffLisensiScreen', {staffId: item.id})} />}
                onPress={() => this.props.navigation.navigate('UserStaffLisensiScreen', {staffId: item.id, namaUsaha:item.namaUsaha, nama:item.nama, licenseDate:item.licenseDate})}
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