import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Menu, Divider, Button, Text, Subheading, Chip, TouchableRipple, TextInput} from 'react-native-paper';

import supabase from '../../config/supabase.js';
import store from '../../config/storeApp';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import dateFormat from '../../comp/dateFormat.js';
import dateTimeFormatSupa from '../../comp/dateTimeFormatSupa.js';

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

  async fetchData() {
      store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

      const user_id = this.state.userTabId;
      
      let { data, error } = await supabase
          .from('user')
          .select('id, email, nama_usaha, telepon, license_date')          
          .eq('id', user_id)
          .single()

      this.setState({
        email:data.email, 
        nama_usaha:data.nama_usaha,  
        telepon:data.telepon,  
        license_date:data.license_date,
        
      });

      store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
      });
    
  }


  render() {
    return (
      <PaperProvider theme={theme}>

        <ScrollView style={styleApp.ScrollView}>
          
            <TextInput
              label="Nama Usaha"
              disabled
              value={this.state.nama_usaha}
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

           {/* <TextInput
              label="Alamat"
              disabled
              value={this.state.alamat}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />*/}

            <TextInput
              label="License Date"
              disabled
              value={dateTimeFormatSupa(this.state.license_date)}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />


          </ScrollView>

         

      </PaperProvider>
    );
  }
};


export default UserProfilScreen;