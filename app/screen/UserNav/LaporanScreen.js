import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Badge, Divider, Button, Text } from 'react-native-paper';

import firebase from '../../config/firebase';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';

class LaporanScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = store.getState();  
    store.subscribe(()=>{
      this.setState(store.getState());
    });

    this.state = {
        ...this.state,

    }

  }

  render() {
    return (
      <PaperProvider theme={theme}>

        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.Content title="Laporan" color= {theme.colors.primary} />
        </Appbar.Header>

        <ScrollView style={styleApp.ScrollView}>
          
              <List.Item
                title="Laporan Pembayaran"
                onPress={() => this.props.navigation.navigate('LaporanPembayaranScreen')}
                left={props => <List.Icon {...props} icon="clipboard-text" color={Colors.green800}/>}
                right={props => <List.Icon {...props} icon="arrow-right" color={Colors.green800} />}
              />
              <Divider />

              <List.Item
                title="Laporan Lisensi"
                onPress={() => this.props.navigation.navigate('LaporanLisensiScreen')}
                left={props => <List.Icon {...props} icon="clipboard-check-outline" color={Colors.green800}/>}
                right={props => <List.Icon {...props} icon="arrow-right" color={Colors.green800} />}
              />
              <Divider />

        </ScrollView>
      </PaperProvider>
    );
  }
};


export default LaporanScreen;