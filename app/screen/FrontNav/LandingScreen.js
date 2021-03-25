import * as React from 'react';
import { LogBox, View, Text } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, ActivityIndicator, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '../../config/firebase.js';
import theme from '../../config/theme.js';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp.js';

import Loading from '../../comp/loading.js';
import Notif from '../../comp/notif.js';

class LandingScreen extends React.Component {
  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
        loginAuto: false
      };

      this.fs = firebase.firestore();
  }

  componentDidMount() {
    this.loginAuto();
  }

  async loginAuto() {
      let loginEmail = await AsyncStorage.getItem('@loginEmail');
      let loginPassword = await AsyncStorage.getItem('@loginPassword');
      let loginAuto = await AsyncStorage.getItem('@loginAuto');
      
      //login auto
      if(loginAuto) {

        //login process
        const self = this;
        firebase.auth()
          .signInWithEmailAndPassword(loginEmail, loginPassword)
          .then((response) => {

            const userLogin = firebase.auth().currentUser;
            const uid = userLogin.uid;

              if (doc.exists) {

                  //update verified true & first login
                  store.dispatch({
                      type: 'LOGIN',
                      payload: { isLogin:true}
                  });

                  store.dispatch({
                      type: 'LOADING',
                      payload: { isLoading:false }
                  });


              } else {
                alert('User Not Found');
                this.props.navigation.navigate('LoginScreen');
              }
              
            })

      //no login auto
      } else {
        this.props.navigation.navigate('LoginScreen');
      }
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',}}>
          <ActivityIndicator size={50} />
          <Title>Loading</Title>
        </View>

      </PaperProvider>
    );
  }
}

export default LandingScreen;