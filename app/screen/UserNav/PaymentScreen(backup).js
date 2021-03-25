import * as React from 'react';
import { View, FlatList, Alert, Text, ScrollView, Dimensions } from 'react-native';
import { Provider as PaperProvider, RadioButton, Appbar, Portal, Searchbar, Caption, List, HelperText, Avatar, Divider, Title, FAB, TextInput, Button, Chip, Subheading } from 'react-native-paper';
import ValidationComponent from 'react-native-form-validator';

import firebase from '../../config/firebase.js';
import theme from '../../config/theme.js';
import store from '../../config/storeApp';
import styleApp from '../../config/styleApp.js';
import dateFilterFormat from '../../comp/dateFilterFormat.js';
import dateFormat from '../../comp/dateFormat.js';
import DateTimeInput from '../../comp/dateTimeInput.js';
import thousandFormat from '../../comp/thousandFormat.js';
import clearThousandFormat from '../../comp/clearThousandFormat.js';
import checkRangeDate from '../../comp/checkRangeDate.js';

class PaymentScreen extends ValidationComponent {
	constructor(props) {
	    super(props);

	    this.state = store.getState();  
	    store.subscribe(()=>{
	      this.setState(store.getState());
	    });

	    this.state = {
	    	...this.state,
	    	
	    	dataList: [],
	    	
	    	StartDate:'',
	        EndDate:new Date(),

	        Total: 0,

	        formDisplay: false,
	        
	    };
	}

	componentDidMount() {
	    this.fetchData();
	    
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevState.StartDate !== this.state.StartDate) {
	    	if(checkRangeDate(this.state.StartDate, this.state.EndDate)) {
	        	this.fetchData();
	        }
		}

		if(prevState.EndDate !== this.state.EndDate) {
	    	if(checkRangeDate(this.state.StartDate, this.state.EndDate)) {
	        	this.fetchData();
	        }
		}
	}

	
	async fetchData() {
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:true }
        });

		let StartDate = new Date();
		if(this.state.StartDate == '') {
			StartDate.setDate(StartDate.getDate() - 7);
		} else {
			StartDate = this.state.StartDate;
		}
        const StartDateFilter = dateFilterFormat(StartDate);
        
        const EndDate = this.state.EndDate;
        const EndDateFilter = dateFilterFormat(EndDate);

        const query = await firebase.firestore().collection('userPayment')
        	.where('tanggal', '>=', StartDateFilter).where('tanggal', '<=', EndDateFilter).get();        

	    //data
	    const dataList = [];
	    let Total = 0;

		query.forEach(doc => {
		  const docData = doc.data();

		  dataList.push({
		  	id: doc.id,
	        tanggal: docData.tanggal,
	        nominal: docData.nominal,
	        nama: docData.nama,
		  });

		  Total += docData.nominal;
		});

		//result
		this.setState({dataList:dataList, Total:Total, StartDate:StartDate, EndDate:EndDate });
		store.dispatch({
            type: 'LOADING',
            payload: { isLoading:false }
        });
	}


	
	render() {
	    return (
	    	<PaperProvider theme={theme}>

	    		<Appbar.Header style={styleApp.Appbar}>
			      <Appbar.Content title="Payment" color={theme.colors.primary}/>
			    </Appbar.Header>

		        <View style={{ height:55, backgroundColor:'#ffffff' }}>
		          <View style={{ flex:1, flexDirection:'row', justifyContent: 'space-around'}}>

		          <DateTimeInput
						title="Start Date"
						value={this.state.StartDate}
			         	mode="date"
			         	onChangeDate={(date) => this.setState({StartDate:date})}
			         	style={{width: (windowWidth/2), marginTop:-10}}
					/>

					<DateTimeInput
						title="End Date"
						value={this.state.EndDate}
			         	mode="date"
			         	onChangeDate={(date) => this.setState({EndDate:date})}
			         	style={{width: (windowWidth/2), marginTop:-10}}
					/>
		          </View>
		          
		        </View>
		        <Divider/>


		        <FlatList
			      keyboardShouldPersistTaps="handled"
                  data={this.state.dataList}
                  keyExtractor={(item) => item.id}
                  style={styleApp.FlatList}
                  renderItem={({ item }) => (
                    <View>
                    	<List.Item
			              title={item.nama}
			              description={dateFormat(item.tanggal)}
		                  right={props => <Subheading style={styleApp.Subheading}>{thousandFormat(item.nominal)}</Subheading>}
			            />
			            <Divider />
                    </View>
                  )}
                />

                <Divider />
                <View style={{ alignItems: 'center', backgroundColor: '#ffffff' }}>
                	<HelperText style={{ fontSize: 18 }}>Total</HelperText>
                	<Subheading style={{ fontSize: 20, fontWeight: 'bold' }}>{thousandFormat(this.state.Total)}</Subheading>
                </View>


			</PaperProvider>
	    )
	}
}

const windowWidth = Dimensions.get('window').width;

export default PaymentScreen;