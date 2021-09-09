import * as React from 'react';
import { View, ScrollView } from 'react-native'
import { Appbar, IconButton, Headline, Text, TextInput, HelperText, Button, Subheading, Paragraph, List, Divider } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';
import { showMessage } from "react-native-flash-message";

import supabase from '../../config/supabase.js';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

import dateFilterFormat from '../../comp/dateFilterFormat.js';
import clearPhoneNumber from '../../comp/clearPhoneNumber.js';
import PickerInput from '../../comp/pickerInput.js';

class ForgotPassword extends ValidationComponent {
  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,

        email: '',
        new_password: '',

        passwordHide: true,
        passwordIcon: 'eye',

      };

  }

  componentDidMount() {
  }

  passwordDisplay() {
    let passwordIcon = this.state.passwordIcon == 'eye' ? 'eye-off-outline' : 'eye';
    this.setState({passwordIcon: passwordIcon});
    this.setState({passwordHide: !this.state.passwordHide});
  }

  async onSubmit() {
    this.validate({
      email: {required:true, email:true},
      new_password: {required:true, minlength:6},
    });

    if(this.isFormValid()) {
        store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

        const email = this.state.email;
        const new_password = this.state.new_password;
        const currTime = new Date();

        //get curr user by email
        let { data:user_db, error } = await supabase
          .from('user')
          .select('id, password')         
          .eq('email', email)
          .single();
          
        //user not found
        if(user_db == null) {
          showMessage({
            message: 'Email tidak ditemukan',
            icon: 'warning',
            backgroundColor: 'red',
            color: theme.colors.background,
          });

        //reset
        } else {
          const { user, session } = await supabase.auth.signIn({
              email: email,
              password: user_db.password,
          })

          await supabase.auth.api
            .updateUser(session.access_token, { password : new_password })

          //update password
          await supabase
                                      .from('user')
                                      .update({password:new_password, _updated_at:currTime})  
                                      .eq('id', user_db.id)
                                      .single();

          showMessage({
              message: 'Reset password berhasil',
              icon: 'success',
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
          }); 

        }

        store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
    }
  }

  toggleDialog() {
    this.setState({registerSuccess:!this.state.registerSuccess});
    this.props.navigation.navigate('LoginScreen');
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:theme.colors.background}}>

        <Appbar.Header style={styleApp.Appbar}>
          <Appbar.BackAction onPress={() => this.props.navigation.navigate('LoginScreen')} color={theme.colors.primary} />
          <Appbar.Content title="Lupa password" color={theme.colors.primary}/>
        </Appbar.Header>

        <View style={{flex:5}}>
          <ScrollView keyboardShouldPersistTaps="handled">
              <TextInput
                label="Email"
                value={this.state.email}
                onChangeText={text => this.setState({email: text})}
                selectionColor={theme.colors.accent}
                style={styleApp.TextInput}
              />
              {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

              <TextInput
                label="Password Baru"
                secureTextEntry={this.state.passwordHide}
                value={this.state.new_password}
                onChangeText={text => this.setState({new_password: text})}
                style={styleApp.TextInput}
                selectionColor={theme.colors.accent}
                right={<TextInput.Icon icon={this.state.passwordIcon} onPress={() => this.passwordDisplay()} />}
              />
              <HelperText>Minimal 6 karakter</HelperText>
              {this.isFieldInError('new_password') && this.getErrorsInField('new_password').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

              <Button 
                mode="contained"
                icon="account" 
                onPress={() => this.onSubmit()}
                disabled={this.state.isLoading}
                style={styleApp.Button}
              >
                Ubah Password
              </Button>
        </ScrollView>
      </View>

    </View>
    )
  }
}

export default ForgotPassword;