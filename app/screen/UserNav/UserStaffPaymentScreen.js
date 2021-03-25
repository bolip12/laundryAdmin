import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Divider, IconButton, Menu, Button, Text, Subheading, Chip, TouchableRipple } from 'react-native-paper';

import firebase from '../../config/firebase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';
import thousandFormat from '../../comp/thousandFormat.js';

class UserStaffPaymentScreen extends React.Component {

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

    const staffId = this.props.route.params.staffId;

    //query
    let query = firebase.firestore().collection('userPayment').where('uid', '==', staffId);

      //data
      const dataList = [];
      let self = this;
      const docList = await query.get();
      docList.forEach(doc => {
        const docData = doc.data();
        dataList.push({
          id : doc.id,
          tanggal: docData.tanggal,
          nominal: docData.nominal,
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

  toggleMenu(id) {
      this.setState({['displayMenu'+id]: !this.state.['displayMenu'+id] });
  }

  render() {
    return (
      <PaperProvider theme={theme}>

        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Staff Payment" color= {theme.colors.primary} />
        </Appbar.Header>

        <FlatList
          keyboardShouldPersistTaps="handled"
          data={this.state.dataList}
          keyExtractor={(item) => item.id}
          style={styleApp.FlatList}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={dateFormat(item.tanggal)}
                description={props => <Caption style={styleApp.Caption}>License: {dateFormat(item.licenseDate)}</Caption>}
                right={props => <Subheading style={styleApp.Subheading}>{thousandFormat(item.nominal)}</Subheading>}
              />
              <Divider />
            </View>
          )}
        />

        <Button 
            mode="contained"
            icon="plus" 
            onPress={() => this.props.navigation.navigate('UserStaffPaymentInsertScreen', {staffId:this.props.route.params.staffId, staffNama:this.props.route.params.staffNama, licenseDate:item.licenseDate})}
            disabled={this.state.isLoading}
            style={styleApp.Button}
          >
            Insert Payment
        </Button>

      </PaperProvider>
    );
  }
};


export default UserStaffPaymentScreen;