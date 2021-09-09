import React from 'react';
import { ScrollView, FlatList, View, StyleSheet, Alert, Linking} from 'react-native';
import { Provider as PaperProvider, Appbar, List, Colors, Caption, Badge, Menu, Divider, Button, Text, Subheading, Chip, TouchableRipple, TextInput} from 'react-native-paper';
import { showMessage } from "react-native-flash-message";
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
        new_password: '',

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
          .select('id, email, nama_usaha, telepon, license_date, password')          
          .eq('id', user_id)
          .single()

      this.setState({
        email:data.email, 
        nama_usaha:data.nama_usaha,  
        telepon:data.telepon,  
        license_date:data.license_date,
        password:data.password,
        
      });

      store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
      });
    
  }

  onResetConfirm() {
      Alert.alert(
        "Warning",
        "Reset password menjadi 'kotakbon123' ",
        [
          { text: "Batal" },
          { text: "Oke", onPress: () => this.onResetPass() }
        ],
      );
  }
  
  async onResetPass() {
   
        store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

        let new_password = 'kotakbon123';
        let email = this.state.email;
        let password = this.state.password;
        let currTime = new Date();

        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password,
        })

        await supabase.auth.api
          .updateUser(session.access_token, { password : new_password })

        //update password
        await supabase
          .from('user')
          .update({password:new_password, _updated_at:currTime})  
          .eq('email', email)
          .single();

        showMessage({
            message: 'Reset password berhasil',
            icon: 'success',
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
        }); 

        store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
  }

  onWhatsapp() {
    let phone = '+62'+this.state.telepon;

    Linking.openURL('whatsapp://send?phone='+phone);
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

            <TextInput
              label="License Date"
              disabled
              value={dateTimeFormatSupa(this.state.license_date)}
              style={styleApp.TextInput}                                                                                                                                                                                                                                                                                                              
            />
            <Divider />

            <Button 
              mode="contained"
              icon="lock-reset" 
              onPress={() => this.onResetConfirm()}
              style={{ margin:10, marginTop:20, borderRadius:20 }}
            >
              Reset Password
            </Button>


            <Button 
              mode="contained"
              icon="whatsapp" 
              onPress={() => this.onWhatsapp()}
              style={{ margin:10, borderRadius:20 }}
            >
              WhatsApp
            </Button>

          </ScrollView>

         

      </PaperProvider>
    );
  }
};


export default UserProfilScreen;