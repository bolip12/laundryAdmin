import * as React from 'react';
import { View } from 'react-native'
import { Headline, Text, TextInput, HelperText, List, Checkbox, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';

import firebase from '../../config/firebase.js';
import theme from '../../config/theme.js';
import styleApp from '../../config/styleApp.js';
import store from '../../config/storeApp';

class LoginScreen extends ValidationComponent {
	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,
	    	email: '',
	    	password: '',
	    	passwordHide: true,
	    	passwordIcon: 'eye',
	    	loginAuto: 'checked',
	    };

	    this.fs = firebase.firestore();
	}

	componentDidMount() {
		this.defaultValue();
	}

	async defaultValue() {
		let loginEmail = await AsyncStorage.getItem('@loginEmail');
		this.setState({ email:loginEmail });

		let loginPassword = await AsyncStorage.getItem('@loginPassword');
		this.setState({ password:loginPassword });

		let loginAuto = await AsyncStorage.getItem('@loginAuto');
		this.setState({ loginAuto:'checked' });
	}

	async onSubmit() {
		this.validate({
			email: {required:true, email: true},
			password: {required:true, minlength:6},
		});

		if(this.isFormValid()) {
			store.dispatch({
	            type: 'LOADING',
	            payload: { isLoading:true }
	        });

			//save email & password
			if(this.state.loginAuto == 'checked') {
				await AsyncStorage.setItem('@loginEmail', this.state.email);
				await AsyncStorage.setItem('@loginPassword', this.state.password);
				await AsyncStorage.setItem('@loginAuto', 'checked');
		    } else {
		        await AsyncStorage.setItem('@loginEmail', '');
		        await AsyncStorage.setItem('@loginPassword', '');
		        await AsyncStorage.setItem('@loginAuto', 'unchecked');
		    }

		    //login process
		    const self = this;
		    await firebase.auth()
		      .signInWithEmailAndPassword(this.state.email, this.state.password)
		      .then((response) => {

		      	const userLogin = firebase.auth().currentUser;
		      	const uid = userLogin.uid;
        		const emailVerified = userLogin.emailVerified;

        		//email verified
				if(emailVerified) {

					this.fs.collection('user').doc(uid).get().then((doc) => {
		          	let docData = doc.data();
		          	let isAdmin = docData.isAdmin;
		          	
			          	if (isAdmin) {

		            	//update first login
							this.fs.collection("user").doc(uid).update({firstLogin:false});

					        store.dispatch({
						        type: 'LOGIN',
						        payload: { isLogin:true}
					    	}); 

					    } else {
					    	store.dispatch({
					            type: 'NOTIF',
					            payload: { notifDisplay:true, notifType:'error', notifMessage:'User Bukan Admin' }
					          });
					    }

					    store.dispatch({
				            type: 'LOADING',
				            payload: { isLoading:false }
				        });
			        });

		        //email not verified
		        } else {
		          this.setState({ isLoading:false });
		          store.dispatch({
		            type: 'NOTIF',
		            payload: { notifDisplay:true, notifType:'error', notifMessage:'Email Belum Diverifikasi' }
		          });
		        }

		        store.dispatch({
		            type: 'LOADING',
		            payload: { isLoading:false }
		        });
		      })
		      .catch(error => {

		      	let errorMessage = '';
		        if(error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') {
		          errorMessage = 'Email & Password tidak cocok';
		        } else if(error.code == 'auth/too-many-requests') {
		          errorMessage = 'Terlalu banyak login gagal, coba lagi beberapa saat';
		        } else {
		          errorMessage = error.message;
		        }

		        store.dispatch({
		            type: 'LOADING',
		            payload: { isLoading:false }
		        });
		        store.dispatch({
		            type: 'NOTIF',
		            payload: { notifDisplay:true, notifType:'error', notifMessage:errorMessage }
		        });
		    });
		}
	}


	passwordDisplay() {
		let passwordIcon = this.state.passwordIcon == 'eye' ? 'eye-off-outline' : 'eye';
		this.setState({passwordIcon: passwordIcon});

		this.setState({passwordHide: !this.state.passwordHide});
	}

	render() {
	    return (
	    	<View style={{flex:1, flexDirection:'column', backgroundColor:theme.colors.background}}>
			    <View style={{flex:4, justifyContent:'center'}}>
			    	<View style={{alignItems: 'center', justifyContent: 'center', marginBottom:20}}>
			    		<Headline style={{color:theme.colors.primary, fontSize:33}}>KotakBon Admin</Headline>
			    	</View>

				    <TextInput
				      label="Email"
				      value={this.state.email}
				      onChangeText={text => this.setState({email: text})}
				      style={styleApp.TextInput}
				      selectionColor="lightgreen"
				    />
				    {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    <TextInput
				      label="Password"
				      secureTextEntry={this.state.passwordHide}
				      value={this.state.password}
				      onChangeText={text => this.setState({password: text})}
				      style={styleApp.TextInput}
				      right={<TextInput.Icon icon={this.state.passwordIcon} onPress={() => this.passwordDisplay()} />}
				      selectionColor="lightgreen"
				    />
				    {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <HelperText type="error">{errorMessage}</HelperText>) }

				    <Button 
				    	mode="contained"
				    	icon="login" 
				    	onPress={() => this.onSubmit()}
				    	disabled={this.state.isLoading}
				    	style={styleApp.Button}
				    >
					    Login
					</Button>
				</View>

				{/*<View style={{flex:1, justifyContent:'flex-end', alignItems:'center', marginBottom:10}}>
					  <Text>Belum Punya Akun ?</Text>
			          <Button 
			          	mode='text'
			            icon='account'
			            onPress={() => this.props.navigation.navigate('RegisterScreen')}
			          >
			            Daftar
			          </Button>
				</View>*/}

			</View>
	    )
	}
}

export default LoginScreen;