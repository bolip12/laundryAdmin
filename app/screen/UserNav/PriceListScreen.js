import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Divider, IconButton, Menu, Button, Text, Subheading, Chip, TouchableRipple, Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import supabase from '../../config/supabase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormatSupa from '../../comp/dateFormatSupa.js';
import dateTimeFormatSupa from '../../comp/dateTimeFormatSupa.js';
import thousandFormat from '../../comp/thousandFormat.js';

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

  componentDidUpdate(prevProps, prevState) {
      
  }

  componentDidMount() {
      this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this.fetchData();
      });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async fetchData() {
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:true }
    });

    let { data, error, count } = await supabase
          .from('ref_license_paket')
          .select('id, nama, harga_bulanan, harga, durasi, deskripsi')          
          .order('harga', { ascending: true })

    //result
    this.setState({dataList:data});
    store.dispatch({
        type: 'LOADING',
        payload: { isLoading:false }
    });

  }

  

  render() {
    return (
      <PaperProvider theme={theme}>

        <Appbar.Header style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction color= {theme.colors.primary} onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Price List" color= {theme.colors.primary} />
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
                  titleStyle={{fontSize:17, fontWeight:'bold'}}
                  description={'Durasi : '+item.durasi+' Hari'}
                  right={() => <Subheading style={styleApp.Subheading}>{thousandFormat(item.harga)}</Subheading>}
                  onPress={() => this.props.navigation.navigate('PriceListUpdateScreen', {id:item.id})}
                />
              <Divider />
              </View>
            )}
          />

          <Button 
            mode="contained"
            icon="plus" 
            onPress={() => this.props.navigation.navigate('PriceListInsertScreen')}
            disabled={this.state.isLoading}
            style={styleApp.Button}
          >
            Insert
        </Button>

      </PaperProvider>
    );
  }
};


export default UserScreen;