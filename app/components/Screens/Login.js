import React, { Component } from 'react'
import { StyleSheet, Dimensions, Keyboard, Alert } from 'react-native'
import { View, TouchableOpacity, TouchableHighlight, Text, TextInput, Image, ImageBackground, ActivityIndicator  } from 'react-native'
import { Item, Input, Icon } from 'native-base'
import { NavigationActions } from 'react-navigation'
import FCM from "react-native-fcm"

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')
const BACKGROUND_PORTRAIT_IMAGE = require('../../assets/images/Default-Portrait.png')
const BACKGROUND_LANDSCAPE_IMAGE = require('../../assets/images/Default-Landscape.png')
import { LANDSCAPE, PORTRAIT, POSITIVE, SPLASH_COLOR, PRIMARY_COLOR } from '../../constants'

import TokenService from '../../services/TokenService'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

export default class LoginScreen extends Component {
    constructor () {
        super()

        this.state = {
            orientation: PORTRAIT,
            username: null,
            email: null,
            password: null,
            requesting: false,
            error: null
        }
    }

    _navigate = (page, params) => {
        // Route with disabled back functionality
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ 
                    routeName: page,
                    params
                }),
            ],
        })
        this.props.navigation.dispatch(resetAction)
    }

    _submit = () => {
        const { navigate, state: { params }, setParams } = this.props.navigation
        const { username, password, email } = this.state

        Keyboard.dismiss()

        this.setState({ requesting: true, error: null })

        if (!username || !password || (params.type==='Sign up' && !email)) {
            this.setState({
                error: 'insert all the fields',
                requesting: false
            })
            return null
        }

        const data = { username, password }

        if (params.type === 'Sign up') {
            data.email = email
            userApi.doRegister(data)
                .then( () => {
                    this.setState({
                        error: `${username} registered successfully`,
                        requesting: false
                    })
                    setTimeout(() => {
                        setParams({ type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                    } , 50)
                })
                .catch( error => {
                    this.setState({
                        error: error.message,
                        requesting: false
                    })
                })
        }
        else {
            console.log('LoginScreen data:', data)
            userApi.doLogin(data)
                .then( token => {
                    console.log('LoginScreen token:', token)
                    TokenService.get().saveToken(token)
                        .then(() => {
                            TokenService.setToken(token)
                            FCM.getFCMToken()
                                .then(pnToken => {
                                    console.log('LoginScreen pnToken:', pnToken)
                                    userApi.updatePushNotificationToken(pnToken)
                                        .then(() => {
                                            this.setState({
                                                error: `${username} login successfully`,
                                                requesting: false
                                            }, () => {
                                                this._navigate('Tracks')
                                            })
                                        })
                                        .catch(error => this.setState({ error: error.message, requesting: false }) )
                                })
                        })
                        .catch( error => { this.setState({ error: error.message, requesting: false }) })
                })
                .catch( error => { this.setState({ error: error.message, requesting: false }) })
        }
    }

    _changeScreen = () => {
        const { navigate, state: { params }, setParams } = this.props.navigation

        if (params.type === 'Login') 
            setParams({ type: 'Sign up', next:'Login', text: 'Already have an account?' })
        else
            setParams({ type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
    }

    _renderEmailInput = () => {
        if (this.props.navigation.state.params.type === 'Login')
            return null

        return (
            <TextInput style={ styles.inputBox } 
                ref={ input => this.email = input }
                underlineColorAndroid="rgba(0,0,0,0)"
                autoCapitalize="none"
                autocorrect={false}
                blurOnSubmit={ false }
                clearButtonMode={"always"}
                keyboardType="email-address"
                placeholder="email"
                placeholderTextColor = "#fff8"
                onChangeText={ email => this.setState({ email }) }
                onSubmitEditing={ () => this.password.focus() }
            />
        )
    }

    _renderErrorMessage = () => {
        // if (!this.state.error)
        //     return null

        const BACKGROUNDCOLOR = this.state.error !== null ? PRIMARY_COLOR + '80' : 'transparent'

        return (
            <View style={[ styles.errorArea, { backgroundColor: BACKGROUNDCOLOR } ]}>
            { this.state.error !== null &&
                <Text style={ styles.errorText }>{ this.state.error }</Text>
            }
            </View>
        )
    }

    _handleOnLayout = (event) => {
        const {x, y, width, height} = event.nativeEvent.layout
        if (width > height)
          this.setState({ orientation: LANDSCAPE })
        else
          this.setState({ orientation: PORTRAIT })
    }

    componentDidMount () {
        this.props.screenProps.handlePlaySong(null)
    }

    render () {
        const { params } = this.props.navigation.state
        const loginButtonOrActivity = this.state.requesting ? <ActivityIndicator  size={25} color={'white'} /> : <Text style={ styles.submitText }>{ params.type }</Text>

        const BACKGROUND_IMAGE = this.state.orientation === PORTRAIT 
            ? BACKGROUND_PORTRAIT_IMAGE 
            : BACKGROUND_LANDSCAPE_IMAGE

        const FORM_POSITION = this.state.orientation === PORTRAIT ? null : null//'flex-end'
        const FORM_MARGINTOP = this.state.orientation === PORTRAIT ? '6%' : '4%'
        const FORM_MARGINRIGHT = this.state.orientation === PORTRAIT ? null : '3%'
        const CONTAINER_DIR = this.state.orientation === PORTRAIT ? 'column' : 'row'
        const JUSTI = this.state.orientation === PORTRAIT ? 'flex-start' : 'center'
        const ALIGN = this.state.orientation === PORTRAIT ? 'center' : 'flex-end'

        return (
            <View style={{ flex: 1 }} onLayout={ this._handleOnLayout }>
            <ImageBackground style={ styles.container } source={ BACKGROUND_IMAGE }>
            { this._renderErrorMessage() }
                <View style={[ styles.form, { flex: 2, justifyContent: JUSTI, alignItems: ALIGN, alignSelf: FORM_POSITION, marginTop: FORM_MARGINTOP, marginRight: FORM_MARGINRIGHT } ]}>
                    
                    <TextInput style={ styles.inputBox } 
                        underlineColorAndroid="rgba(0,0,0,0)"
                        autoCapitalize="none"
                        autocorrect={false}
                        blurOnSubmit={ false }
                        clearButtonMode={"always"}
                        keyboardType="email-address"
                        placeholder="username"
                        placeholderTextColor = "#fff8"
                        onChangeText={ username => this.setState({ username }) }
                        onSubmitEditing={ ()=> {
                            params.type === 'Login' ? this.password.focus() : this.email.focus() 
                        }}
                    />
                    { this._renderEmailInput() }
                    <TextInput style={ styles.inputBox } 
                        ref={ input => this.password = input }
                        underlineColorAndroid="rgba(0,0,0,0)"
                        autoCapitalize="none"
                        autocorrect={false}
                        blurOnSubmit={ true }
                        clearButtonMode={"always"}
                        secureTextEntry
                        placeholder="password"
                        placeholderTextColor = "#fff8"
                        onChangeText={ password => this.setState({ password }) }
                    />
                    <TouchableHighlight underlayColor={ POSITIVE + '40' } style={ styles.submit } onPress={ this._submit }>
                        { loginButtonOrActivity }
                    </TouchableHighlight>
                    
                </View>
                <View style={ styles.footerContainer }>
                    <Text style={ styles.footerText }>{ params.text + ' ' }</Text>
				    <TouchableOpacity onPress={ this._changeScreen }>
                        <Text style={ styles.footerLink }>{ params.next }</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            </View>
        )
    }
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    form : {

    },
    inputBox: {
        width: DEVICE_WIDTH > DEVICE_HEIGHT ? DEVICE_HEIGHT - 100 : DEVICE_WIDTH - 80,
        marginVertical: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        borderRadius: 25,
        backgroundColor:'rgba(255, 255, 255, 0.2)',
    },
    submit: {
        width: DEVICE_WIDTH > DEVICE_HEIGHT ? DEVICE_HEIGHT -100 : DEVICE_WIDTH - 80,
        marginVertical: 8,
        paddingVertical: 13,
        borderRadius: 25,
        backgroundColor: POSITIVE + '80', //'#1c313a',
    },
    submitText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center'
    },
    errorArea: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginVertical: 0,
        height: 32,
        //backgroundColor: PRIMARY_COLOR + '80' //'rgba(0, 0, 255, 0.4)',
    },
    errorText: {
        color: 'white',
        fontSize: 14,
        paddingVertical: 5
    },
    footerContainer: {
        flex: -1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: 16
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16
    },
    footerLink: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    }
})