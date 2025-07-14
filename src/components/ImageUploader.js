import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ImageBackground, StatusBar, Modal, Alert } from "react-native";
import FormButton from "../../components/Buttons/FormButton";
import FormButtonBack from "../../components/Buttons/FormButtonBack";
import FormButtonNext from "../../components/Buttons/FormButtonNext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import axios from "axios";

import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../components/context";
import { check } from "react-native-permissions";
import WatchLoader from "../../components/Loader/WatchLoader";
var dateOfBirth;

const Identification = ({ navigation, route }) => {
    const [email, setEmail] = useState("email");
    const [selected, setSelected] = useState("Private individual");
    const [typeClicked, setTypeClicked] = useState(false);
    const [id, setId] = useState(true);
    const [passport, setPassport] = useState(false);
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);
    const [passPortImage, setPassportImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loggedin, setLoggedin] = useState();
    const { signIn } = React.useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    console.log("route.params in identification", route.params);

    useEffect(() => {
        checkLoggedIn()
    }, [])

    const checkLoggedIn = async () => {
        let check = await AsyncStorage.getItem('loggedin')
        if (check == "true") {
            setLoggedin(true);
        }
        else {
            setLoggedin(false);
        }
    }

    const changeLoginStatus = async () => {
        await AsyncStorage.setItem("loggedin", "true");
    }

    const gallery = async (x) => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log("image", image);
            if (x == "f") {
                setFront(image);
            }
            else if (x == "b") {
                setBack(image);
            }
            else {
                setPassportImage(image);
            }

            // AsyncStorage.setItem('image', image.path);
            // refRBSheet.current.close();
        });
    };

    const completeRegistration = async () => {
        setLoading(true);
        let token = await AsyncStorage.getItem('token');
        console.log(token);
        console.log('Routes', route.params.email, route.params.fname, route.params.lname, route.params.accountType, route.params.address, route.params.dob, route.params.language, route.params.company, route.params.shippingCountry, route.params.currency)
        let ty;
        if (passport) {
            ty = "Passport"
        }
        else {
            ty = "ID"
        }
        try {
            const formData = new FormData();
            formData.append('email', route.params.email);
            formData.append('first_name', route.params.fname);
            formData.append('last_name', route.params.lname);
            formData.append('account_type', route.params.accountType);
            formData.append('address', route.params.address);
            formData.append('dob', route.params.dob);
            formData.append('type', ty);
            formData.append('language', "English");
            formData.append('company', route.params.company);
            formData.append('zip_code', route.params.zipCode);
            formData.append('state', route.params.state);
            formData.append('city', route.params.city);
            formData.append('country', route.params.country);
            formData.append('shipping_country', route.params.shippingCountry);
            formData.append('currency', route.params.currency);

            if (!passport) {
                var filename1 = front.path.split('/').pop();
                var n = filename1.split('.').slice(0, -1).join('.');
                formData.append('driver_license_picture_front', {
                    // uri: Platform.OS === 'android' ? ${image.path} : image.path,
                    uri: front.path,
                    name: n,
                    fileName: filename1,
                    type: front.mime,
                });
                var filename2 = front.path.split('/').pop();
                var n2 = filename2.split('.').slice(0, -1).join('.');
                formData.append('driver_license_picture_back', {
                    // uri: Platform.OS === 'android' ? ${image.path} : image.path,
                    uri: back.path,
                    name: n2,
                    fileName: filename2,
                    type: back.mime,
                });
            }
            else {
                var filename2 = passPortImage.path.split('/').pop();
                var n2 = filename2.split('.').slice(0, -1).join('.');
                formData.append('passport_picture', {
                    // uri: Platform.OS === 'android' ? ${image.path} : image.path,
                    uri: passPortImage.path,
                    name: n2,
                    fileName: filename2,
                    type: passPortImage.mime,
                });
            }

            console.log(formData);


            axios.post('https://chronedo.webjerky.com/api/profile', formData, {
                headers: {
                    Authorization: Bearer ${token},
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(function (response) {
                    console.log(response.data);
                    setModalVisible(true);
                    setTimeout(() => {
                        setModalVisible(false);
                        if (loggedin) {
                            setLoading(false);
                            // Reset the navigation stack and navigate back to the Sell screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Sell' }],
                            });
                        }
                        else {
                            changeLoginStatus();
                            setLoading(false);
                            signIn(route.params.email, token);
                        }
                    }, 2500);
                });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };



    return (
        <View style={{ backgroundColor: 'rgb(43, 50, 65)', flex: 1 }}>
            {loading ? <WatchLoader visible={loading} /> : null}
            <StatusBar
                animated={true}
                backgroundColor="rgb(43, 50, 65)"
            />
            <ImageBackground source={require('../../assets/Auth/blurredBackground.png')} style={{ height: hp(120), bottom: hp(5), width: wp('100%'), alignItems: 'center' }}>
                <Image source={require('../../assets/Auth/chronedo.png')} style={{ height: hp(6), width: wp(50), resizeMode: 'contain', marginTop: hp(10) }} />
                <View style={styles.innerContainer}>
                    <Image source={require('../../assets/Auth/usertick.png')} style={{ alignSelf: 'center', height: hp('7%'), width: wp('12.5%'), marginTop: hp('2%'), resizeMode: 'contain' }} />
                    <Text style={{ alignSelf: 'center', color: '#fff', fontSize: hp('2%'), fontWeight: '600', fontFamily: 'Poppins-SemiBold', marginTop: hp(1.5) }}>IDENTIFICATION</Text>
                    <Text style={{ color: '#fff', marginHorizontal: wp("5%"), fontSize: hp('1.7%'), textAlign: 'center', fontFamily: 'Poppins-Regular', marginTop: hp(0.5) }}>Thereby we increase the trust</Text>
                    <Text style={{ color: '#fff', marginHorizontal: wp("7%"), marginTop: hp(2), fontSize: hp('1.5%'), textAlign: 'center', fontFamily: 'Poppins-Regular' }}>Upload your passport or ID. The data will be kept confidential and never shared with other members.</Text>

                    {/* <View style = {{height: hp(35), width: wp(80), borderWidth: 1.5, borderColor: '#fff', borderRadius: 5, marginTop: hp(2)}}>

                    </View> */}

                    <View style={{ flexDirection: 'row', marginTop: hp(3) }}>
                        <TouchableOpacity
                            onPress={() => { setId(!id), setPassport(false) }}
                            style={{ height: hp(7.5), width: wp(39.5), borderWidth: 1, borderColor: id ? '#A98754' : 'rgba(255, 255, 255, 0.2)', borderRadius: 5, justifyContent: 'center', backgroundColor: id ? 'rgba(169, 135, 84, 0.15)' : null }}>
                            <Text style={{ textAlign: 'center', marginHorizontal: wp(5), fontSize: hp(1.9), lineHeight: hp(2.2), color: '#fff', fontFamily: 'Poppins-Regular' }}>ID or driver's license</Text>
                        </TouchableOpacity>
                        <View style={{ width: wp(3.5) }} />
                        <TouchableOpacity
                            onPress={() => { setId(false), setPassport(!passport) }}
                            style={{ height: hp(7.5), width: wp(39.5), borderWidth: 1, borderColor: passport ? '#A98754' : 'rgba(255, 255, 255, 0.2)', borderRadius: 5, justifyContent: 'center', backgroundColor: passport ? 'rgba(169, 135, 84, 0.15)' : null }}>
                            <Text style={{ textAlign: 'center', marginHorizontal: wp(5), fontSize: hp(1.9), lineHeight: hp(2.2), color: '#fff', fontFamily: 'Poppins-Regular' }}>Passport</Text>
                        </TouchableOpacity>
                    </View>


                    {id ?
                        <View style={{ alignItems: 'center' }}>
                            <View>
                                <View style={{ flexDirection: 'row', marginTop: hp(3.5) }}>
                                    <View style={{ height: hp(13), width: wp(30), borderWidth: 1, borderColor: '#fff', borderTopLeftRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={require('../../assets/Auth/idfront.png')}
                                            style={{ height: hp(7), width: wp(17), resizeMode: 'contain', }}
                                        />
                                        <Text style={{ fontSize: hp(1.75), color: '#fff', textAlign: 'center', fontFamily: 'Poppins-Regular' }}>Front</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => gallery('f')}
                                        style={{ height: hp(13), width: wp(52), borderWidth: 1, borderColor: '#fff', borderTopRightRadius: 5, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                                        {front == null ?
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../assets/Auth/cloud.png')}
                                                    style={{ height: hp(11), width: wp(11), resizeMode: 'contain', marginLeft: wp(3) }}
                                                />
                                                <Text style={{ fontSize: hp(1.75), color: '#fff', marginLeft: wp(5), fontFamily: 'Poppins-Regular' }}>Select file</Text>
                                            </View>
                                            :
                                            <Image
                                                source={{ uri: front.path }}
                                                style={{ height: hp(12.5), width: wp(51), resizeMode: 'contain' }}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ height: hp(13), width: wp(30), borderWidth: 1, borderColor: '#fff', borderBottomLeftRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            source={require('../../assets/Auth/idback.png')}
                                            style={{ height: hp(7), width: wp(17), resizeMode: 'contain', }}
                                        />
                                        <Text style={{ fontSize: hp(1.75), color: '#fff', textAlign: 'center', fontFamily: 'Poppins-Regular' }}>Back</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => gallery('b')}
                                        style={{ height: hp(13), width: wp(52), borderWidth: 1, borderColor: '#fff', borderTopRightRadius: 5, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                                        {back == null ?
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={require('../../assets/Auth/cloud.png')}
                                                    style={{ height: hp(11), width: wp(11), resizeMode: 'contain', marginLeft: wp(3) }}
                                                />
                                                <Text style={{ fontSize: hp(1.75), color: '#fff', marginLeft: wp(5), fontFamily: 'Poppins-Regular' }}>Select file</Text>
                                            </View>
                                            :
                                            <Image
                                                source={{ uri: back.path }}
                                                style={{ height: hp(12.5), width: wp(51), resizeMode: 'contain' }}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>


                        </View>
                        :
                        <View style={{ flexDirection: 'row', marginTop: hp(3.6) }}>
                            <View style={{ height: hp(13), width: wp(30), borderWidth: 1, borderColor: '#fff', borderTopLeftRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ marginTop: hp(3) }} />
                                <Image
                                    source={require('../../assets/Auth/idfront.png')}
                                    style={{ height: hp(6.5), width: wp(17), resizeMode: 'contain', }}
                                />
                                <Text style={{ fontSize: hp(1.75), color: '#fff', textAlign: 'center', bottom: hp(0.3), fontFamily: 'Poppins-Regular' }}>Page with your</Text>
                                <Text style={{ fontSize: hp(1.75), color: '#fff', textAlign: 'center', bottom: hp(1.3), fontFamily: 'Poppins-Regular' }}>photo</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => gallery('x')}
                                style={{ height: hp(13), width: wp(52), borderWidth: 1, borderColor: '#fff', borderTopRightRadius: 5, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                                {passPortImage == null ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={require('../../assets/Auth/cloud.png')}
                                            style={{ height: hp(11), width: wp(11), resizeMode: 'contain', marginLeft: wp(3) }}
                                        />
                                        <Text style={{ fontSize: hp(1.75), color: '#fff', marginLeft: wp(5), fontFamily: 'Poppins-Regular' }}>Select file</Text>
                                    </View>
                                    :
                                    <Image
                                        source={{ uri: passPortImage.path }}
                                        style={{ height: hp(12.5), width: wp(51), resizeMode: 'contain' }}
                                    />
                                }
                            </TouchableOpacity>
                        </View>}

                    <View style={{ alignItems: 'center', marginTop: id ? hp('5%') : hp('18%'), marginBottom: hp('2%'), flexDirection: 'row', alignSelf: 'center' }}>
                        <FormButtonBack
                            buttonTitle={'Back'}
                            onPress={() => navigation.navigate('DOB', { email: route.params.email, accountType: route.params.accountType, language: route.params.language, currency: route.params.currency, shippingCountry: route.params.shippingCountry, fname: route.params.fname, lname: route.params.lname, company: route.params.company, address: route.params.address, state: route.params.state, zipCode: route.params.zipCode , city: route.params.city , country: route.params.country, dob: route.params.dob })}
                        />
                        <View
                            style={{ marginLeft: wp('3%') }}
                        />
                        <FormButtonNext
                            buttonTitle={'Next'}

                            // onPress={() => console.log("all data", route.params.email,  route.params.accountType,  route.params.language,  route.params.currency,  route.params.shippingCountry,  route.params.fname,  route.params.lname,  route.params.company, route.params.address, route.params.state,  route.params.zipCode , route.params.city , route.params.country, route.params.dob)}
                            onPress={() => {
                                if (passport == false && front != null && back != null) {
                                    completeRegistration();
                                }
                                else if (passport == false && front != null && back == null) {
                                    Alert.alert('Back Image Required', '', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                    ]);
                                }
                                else if (passport == false && front == null && back != null) {
                                    Alert.alert('Front Image Required', '', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                    ]);
                                }
                                else if (passport == false && front == null && back == null) {
                                    Alert.alert('Front & Back Image Required', '', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                    ]);
                                }
                                else if (passport == true && passPortImage != null) {
                                    completeRegistration();
                                }
                                else if (passport == true && passPortImage == null) {
                                    Alert.alert('Image Required', '', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                                    ]);
                                }
                                else {
                                    console.log("something went wrong")
                                }
                            }}

                        />
                    </View>
                </View>

                <View style={styles.centeredView}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ImageBackground source={require('../../assets/Auth/popupbg.png')} style={{ justifyContent: 'center', alignItems: 'center', width: wp(85), height: hp(23) }} imageStyle={{ borderRadius: 25 }}>
                                    <Text style={{ color: '#fff', fontSize: hp(2.2), fontFamily: 'Poppins-SemiBold', }}>PROFILE COMPLETED</Text>
                                    <Text style={{ color: '#fff', fontSize: hp(1.4), fontFamily: 'Poppins-SemiBold', }}>Your Profile has been completed. Thank you.</Text>
                                    <Image source={require('../../assets/Auth/circleTick.png')} style={{ height: hp(10), width: wp(15), resizeMode: 'contain', marginTop: hp(2) }} />
                                </ImageBackground>
                            </View>
                        </View>
                    </Modal>
                </View>

            </ImageBackground>

        </View>
    )
}
const styles = StyleSheet.create({
    dropdown: {
        height: hp('5.2%'),
        width: wp('45%'),
        marginRight: wp('6%'),
        // marginRight: wp('%'), 
        borderBottomWidth: 2,
        borderWidth: 0.7,
        borderBottomColor: '#A98754',
        borderColor: 'rgb(101, 102, 108)',
        paddingLeft: 10,
        borderRadius: 7,
        backgroundColor: 'rgb(101, 102, 108)',
        justifyContent: 'space-between',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    dropdownTitle: {
        color: '#fff',
        fontSize: hp('2.3%'),
        marginLeft: wp('2%')
    },
    innerContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginTop: hp('3%'),
        marginHorizontal: wp('5%'),
        borderRadius: 10,
        alignItems: 'center'
    },
    dropdownArea: {
        backgroundColor: 'rgb(101, 102, 108)',
        height: hp('9%'),
        width: wp('43%'),
        marginLeft: wp('7%'),
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'grey',
        borderRadius: 25,
        // paddingVertical: hp(2),
        width: wp(85),
        // padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default Identification;