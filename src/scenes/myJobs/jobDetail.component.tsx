import React from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl, TextInput, Picker } from 'react-native';
import {
    Text,
    ThemedComponentProps,
} from 'react-native-ui-kitten';
import { Content, Label, Textarea } from 'native-base';
import { JobDetailScreenProps } from '../../navigation/myJobs.navigator';
import { AppConstants } from '../../constants/AppConstants';
import { Toolbar } from '../../components/toolbar.component';
import {
    SafeAreaLayout,
    SaveAreaInset,
} from '../../components/safe-area-layout.component';
import { PencilIcon } from '../../assets/icons';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { Styles } from '../../assets/styles';
import { country_data } from '../../assets/country';

type MyState = {

}

export class JobDetailScreen extends React.Component<JobDetailScreenProps & ThemedComponentProps, MyState & any> {
    constructor(props) {
        super(props)
        this.state = {
            userId: '',
            userData: [],
            editable: false,
            f_name: '',
            l_name: '',
            emailId: '',
            phone_country_code: '',
            vendor_id: '',
            vendor_name: '',
            city: '',
            address: '',
            pincode: '',
            country: '',
            createdBy: '',
            vendor_location: '',
            initial: '',
            phone_number: '',
            device_token: '',
            id: '',
            remarks: '',
            countryCode: '',
            country_data: country_data,
        }

        this._onRefresh = this._onRefresh.bind(this);
        this.edit = this.edit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCountry = this.handleCountry.bind(this);
        this.handleCountryCode = this.handleCountryCode.bind(this);
    }

    async componentDidMount() {
        const value = await AsyncStorage.getItem('userDetail');
        if (value) {
            const user = JSON.parse(value);
            this.setState({
                userId: user.userId,
                device_token: user.deviceToken
            })
        }

        const value1 = await AsyncStorage.getItem('visitorId');
        if (value1) {
            const jobData = JSON.parse(value1);
            // console.log('user Details all data...', jobData);
            this.setState({
                id: jobData.jobId
            })
            axios({
                method: 'get',
                url: AppConstants.API_BASE_URL + '/api/visitor/get/' + jobData.jobId,
            }).then((response) => {
                this.setState({
                    ...this.state,
                    my_Job: response.data,
                    userData: response.data,
                    f_name: response.data.firstName,
                    l_name: response.data.lastName,
                    emailId: response.data.emailId,
                    phone_country_code: response.data.countryCode,
                    vendor_id: response.data.vendorId,
                    vendor_name: response.data.vendorName,
                    city: response.data.city,
                    address: response.data.address,
                    pincode: response.data.pincode,
                    country: response.data.country,
                    initial: response.data.initials,
                    phone_number: response.data.phone,
                    vendor_location: response.data.vendorLocation,
                    remarks: response.data.remarks
                })
                // console.log("Job Data", response.data);
                this.handleCountryCode(response.data.countryCode);
            },
                (error) => {
                    // console.log(error);
                    if (error) {
                        // alert("UserId or Password is invalid");
                    }
                }
            );
        }
    }

    edit() {
        this.setState({
            editable: true
        })
    }

    handleSubmit() {
        const { device_token, id, userData, editable, remarks, f_name, l_name, emailId, phone_country_code, vendor_id, vendor_name, city, address, pincode, country, createdBy, vendor_location, initial, phone_number } = this.state
        axios({
            method: 'PUT',
            url: AppConstants.API_BASE_URL + '/api/visitor/update',
            data: {
                id: id,
                initial: initial,
                emailId: emailId,
                device_token: device_token,
                f_name: f_name,
                l_name: l_name,
                phone_country_code: phone_country_code,
                city: city,
                address: address,
                pincode: pincode,
                country: country,
                phone_number: phone_number,
                remarks: remarks
            }
        }).then((response) => {
            if (response) {
                if (response.data.emailId === emailId) {
                    alert('Visitor Updated Successfuly')
                    this.setState({
                        editable: false
                    })
                    this._onRefresh()
                }
            }
        }, (error) => {
            // console.log(error)
            alert('Server is Down or You are using wrong Data')
        });

    }

    handleCountry(e, code) {
        this.setState({
            countryCode: code
        })

        this.state.country_data.map((item, index) => {
            if (code === item.code) {
                this.setState({
                    country: item.name,
                    phone_country_code: item.dial_code
                })
            }
        })
    }

    handleCountryCode(code) {
        this.state.country_data.map((item, index) => {
            if (code === item.dial_code) {
                this.setState({
                    countryCode: item.code,
                })
            }
        })
    }



    _onRefresh() {
        this.setState({ refreshing: true });
        this.componentDidMount().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {
        const {  editable, f_name, remarks, l_name, emailId, phone_country_code, vendor_id, vendor_name, city, address, pincode, country, createdBy, vendor_location, initial, phone_number } = this.state
        return (
            <SafeAreaLayout
                style={styles.safeArea}
                insets={SaveAreaInset.TOP}>
                <Toolbar
                    title='Visitor Detail'
                    // backIcon={MenuIcon}
                    onBackPress={this.props.navigation.goBack}
                    style={{ marginTop: -5, marginLeft: -5, borderBottomColor: '#D9D5DC', borderBottomWidth: 1 }}
                />


                <Content style={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                >

                    <View style={styles.header}>
                        <TouchableOpacity style={styles.editButton} onPress={this.edit}>
                            <Text style={editable ? styles.editButtonTextSelected : styles.editButtonText}><PencilIcon /></Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={styles.dataView}>
                            <Label>Initials</Label>
                            <TextInput
                                style={styles.dataText}
                                value={initial}
                                placeholder='Initials'
                                editable={editable}
                                onChangeText={(initial) => { this.setState({ initial: initial }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>First Name</Label>
                            <TextInput
                                style={styles.dataText}
                                value={f_name}
                                placeholder='First Name'
                                editable={editable}
                                onChangeText={(f_name) => { this.setState({ f_name: f_name }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Last Name</Label>
                            <TextInput
                                style={styles.dataText}
                                value={l_name}
                                placeholder='Last Name'
                                editable={editable}
                                onChangeText={(l_name) => { this.setState({ l_name: l_name }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Email Id</Label>
                            <TextInput
                                style={styles.dataText}
                                value={emailId}
                                placeholder='Email Id'
                                editable={false}
                                onChangeText={(emailId) => { this.setState({ emailId: emailId }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Country</Label>
                            <Picker
                                enabled={editable}
                                selectedValue={this.state.countryCode}
                                style={{ height: 50, width: '100%', color: '#000', opacity: 0.5 }}
                                onValueChange={(itemValue, itemIndex) => { this.handleCountry(itemIndex, itemValue) }
                                }>
                                {this.state.country_data.map((item, index) => {
                                    return (
                                        <Picker.Item label={item.name} value={item.code} />
                                    )
                                })}
                            </Picker>
                        </View>


                        <View style={styles.dataView}>
                            <Label>Country Code</Label>
                            <TextInput
                                style={styles.dataText}
                                value={phone_country_code}
                                placeholder='Country Code'
                                editable={false}
                                onChangeText={(phone_country_code) => { this.setState({ phone_country_code: phone_country_code }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Phone Number</Label>
                            <TextInput
                                style={styles.dataText}
                                value={phone_number}
                                placeholder='Phone Number'
                                editable={editable}
                                onChangeText={(phone_number) => { this.setState({ phone_number: phone_number }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Address</Label>
                            <TextInput
                                style={styles.dataText}
                                value={address}
                                placeholder='Address'
                                editable={editable}
                                onChangeText={(address) => { this.setState({ address: address }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>City</Label>
                            <TextInput
                                style={styles.dataText}
                                value={city}
                                placeholder='City'
                                editable={editable}
                                onChangeText={(city) => { this.setState({ city: city }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Pin Code</Label>
                            <TextInput
                                style={styles.dataText}
                                value={pincode}
                                placeholder='Pin Code'
                                editable={editable}
                                onChangeText={(pincode) => { this.setState({ pincode: pincode }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>GSTIN/TIN</Label>
                            <TextInput
                                style={styles.dataText}
                                value={vendor_id}
                                placeholder='GSTIN/TIN'
                                editable={false}
                                onChangeText={(vendor_id) => { this.setState({ vendor_id: vendor_id }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Premise Name</Label>
                            <TextInput
                                style={styles.dataText}
                                value={vendor_name}
                                placeholder='Premise Name'
                                editable={false}
                                onChangeText={(vendor_name) => { this.setState({ vendor_name: vendor_name }) }}
                            />
                        </View>

                        <View style={styles.dataView}>
                            <Label>Premise location</Label>
                            <TextInput
                                style={styles.dataText}
                                value={vendor_location}
                                placeholder='Premise location'
                                editable={false}
                                onChangeText={(vendor_location) => { this.setState({ vendor_location: vendor_location }) }}
                            />
                        </View>

                        <View style={styles.textAreaBox}>
                            <Textarea
                                style={styles.textArea}
                                value={remarks}
                                editable={editable}
                                placeholder='Remarks'
                                onChangeText={(remarks) => { this.setState({ remarks: remarks }) }}
                            ></Textarea>
                        </View>

                    </View>
                    {editable ?
                        <View>
                            <TouchableOpacity style={[Styles.buttonContainer, styles.button]} onPress={this.handleSubmit}>
                                <Text style={Styles.buttonCaption}>Submit</Text>
                            </TouchableOpacity>
                        </View> :
                        null
                    }

                    <View style={Styles.bottomSpace}></View>
                </Content>

            </SafeAreaLayout>
        )
    }

}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },

    header: {
        height: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    headerText: {
        alignSelf: 'center',
        textAlign: 'center'
    },

    editButton: {
        width: '10%',
        // backgroundColor: 'red',
        alignSelf: 'center',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'flex-end'
    },

    editButtonTextSelected: {
        color: '#3F51B5',
        fontSize: 25,
    },

    editButtonText: {
        color: '#999',
        fontSize: 25,
    },

    content: {
        backgroundColor: '#FFFFFF',
        padding: 10
    },

    dataView: {
        backgroundColor: "transparent",
        paddingLeft: 2,
        borderColor: "#D9D5DC",
        borderBottomWidth: 1,
        marginTop: 15
    },

    dataText: {
        marginTop: 0,
        marginBottom: -10,
        marginLeft: 10,
        color: '#000'
    },

    card2: {
        width: '85%',
        alignSelf: 'center',
        borderColor: '#DDDDDD',
        borderWidth: .8,
        borderRadius: 10,
        marginTop: 10,
    },

    card2_2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },

    cardText3: {
        fontSize: 15,
        color: '#1DA1F2'
    },

    cardText4: {
        fontSize: 20,
        color: '#1DA1F2'
    },

    button: {
        width: '44%',
        height: 52,
        marginTop: 35,
        alignSelf: 'center'
    },

    textArea: {
        width: '100%',
        height: 150,
        backgroundColor: '#eee',

    },

    textAreaBox: {
        marginTop: 25
    },
})


