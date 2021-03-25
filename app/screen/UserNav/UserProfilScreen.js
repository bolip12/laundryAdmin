import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Menu, Divider, Button, Text, Subheading, Chip, TouchableRipple, TextInput} from 'react-native-paper';

import firebase from '../../config/firebase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';

class UserProfilScreen extends React.Component {

  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        dataList: [],

        namaUsaha: '',
        telepon: '',
        alamat: '',
        email: '',
        licenseDate: '',

      };

  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
      store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

      const userId = this.props.route.params.userId;
      
      let self = this;
      firebase.firestore().collection('user').doc(userId).get()
      .then(function(doc) {
        if (doc.exists) {
          const docData = doc.data();
          
          self.setState({ 
            namaUsaha: docData.namaUsaha,
            telepon: docData.telepon,
            email: docData.email,
            alamat: docData.alamat,
            licenseDate: docData.licenseDate,
          });
        }

        store.dispatch({
              type: 'LOADING',
              payload: { isLoading:false }
        });
      });
  }


  render() {
    return (
      <PaperProvider theme={theme}>

        <Appbar.Header style={styleApp.Appbar}>
          <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="User Profile" color= {theme.colors.primary}/>
        </Appbar.Header>

        <ScrollView style={styleApp.ScrollView}>
          
            <TextInput
              label="Nama Usaha"
              disabled
              value={this.state.namaUsaha}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />

            <TextInput
              label="Email"
              disabled
              value={this.state.email}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />

            <TextInput
              label="Telepon"
              disabled
              value={this.state.telepon}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />

            <TextInput
              label="Alamat"
              disabled
              value={this.state.alamat}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />

            <TextInput
              label="License Date"
              disabled
              value={dateFormat(this.state.licenseDate)}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />


          </ScrollView>

         

      </PaperProvider>
    );
  }
};


export default UserProfilScreen;