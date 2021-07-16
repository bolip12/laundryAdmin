import * as React from 'react';
import { View } from 'react-native'
import { Headline, Text, TextInput, HelperText, List, Checkbox, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValidationComponent from 'react-native-form-validator';

import supabase from '../../config/supabase.js';
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

	}

	componentDidMount() {
		/*BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);*/
		this.defaultValue();
	}

	onBackButtonPress = () => {
	        return true;
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
			const { user, session, error } = await supabase.auth.signIn({
	            email: this.state.email,
	            password: this.state.password,
	        })

			if(error) {
	            store.dispatch({
	              type: 'NOTIF',
	              payload: { notifDisplay:true, notifType:'error', notifMessage:error.message }
	            });

        	} else {
        		//const uid = user.id;

				const { data:user_data, error, count }  = await supabase
				.from('user')
				.select('id, is_admin')
				.eq('email', this.state.email)
				.single();
	          	
		          	if (user_data.is_admin) {
					
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
		    }
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