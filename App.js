import * as React from 'react';
import { LogBox } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import firebase from './app/config/firebase';
import theme from './app/config/theme';
import store from './app/config/storeApp';
import FlashMessage from "react-native-flash-message";

import Loading from './app/comp/loading';
import Notif from './app/comp/notif';

import LoginScreen from './app/screen/FrontNav/LoginScreen';
import UserNav from './app/nav/UserNav';

LogBox.ignoreAllLogs();

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = store.getState();  
      store.subscribe(()=>{
        this.setState(store.getState());
      });

      this.state = {
        ...this.state,
      };
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <UserNav />
        {/*{this.state.isLogin ? <UserNav /> : <LoginScreen />}*/}
        <Loading />
        {/*<Notif />*/}
        
        <FlashMessage position="top" floating={true} duration={3000} style={{borderRadius:30}}/>
      </PaperProvider>
    );
  }
}

export default App;