import React, { Component } from 'react'
import { StyleSheet, Dimensions, Keyboard, KeyboardAvoidingView, AsyncStorage } from 'react-native'
import { View, TouchableOpacity, Text, TextInput, Image, ImageBackground, Alert, ActivityIndicator  } from 'react-native'
import { Item, Input, Icon } from 'native-base'
import { NavigationActions } from 'react-navigation'

//import { API_URL_LOGIN } from '../../constants'
import apiAuthorization from '../../services/ApiAuthorization' 

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window')

export default class LoginScreen extends Component {
    constructor() {
        super()

        this.state = {
            username: '',
            email: '',
            password: '',
            requesting: false,
            error: null
        }
    }

    _navigate(page, params) {
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

    _submit() {
        const { navigate, state: { params } } = this.props.navigation
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
            apiAuthorization.doRegister(data)
                .then( () => {
                    this.setState({
                        error: `${username} registered successfully`,
                        requesting: false
                    })
                })
                .catch( error => {
                    this.setState({
                        error: error.message,
                        requesting: false
                    })
                })
        }
        else {
            apiAuthorization.doLogin(data)
                .then( token => {
                    this.setState({
                        error: `${username} login successfully`,
                        requesting: false
                    }, () => {
                        AsyncStorage.setItem('@mtzfactory:token', token)
                            .then( () => this._navigate('Songs', { token }))
                            .catch( error => {
                                this.setState({
                                    error: error.message,
                                    requesting: false
                                })
                            })
                    })
                })
                .catch( error => {
                    this.setState({
                        error: error.message,
                        requesting: false
                    })
                })
        }

        // fetch(API_URL_LOGIN, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // })
        // .then(res => {
        //     console.log(res.status)
        //     if (res.status !== 200) {
        //         this.setState({
        //             error: `Server error or Unauthorized (${res.status})`,
        //             requesting: false
        //         })
        //         return null
        //     }

        //     return res.json()
        // })
        // .then(res => {
        //     if (res) {
        //         AsyncStorage.setItem('@mtzfactory:token', res.data)
        //             .then(() => this._navigate('Songs', { token: res.data }))
        //             .catch( error => {
        //                 this.setState({
        //                     error: error.message,
        //                     requesting: false
        //                 })
        //             })
        //     }
        // })
        // .catch(error => {
        //     this.setState({
        //         error: error.message,
        //         requesting: false
        //     })
        // })
    }

    _changeScreen() {
        const { navigate, state: { params }, setParams } = this.props.navigation

        if (params.type === 'Login') 
            setParams({ type: 'Sign up', next:'Login', text: 'Already have an account?' })
        else
            setParams({ type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
    }

    _renderEmailInput() {
        if (this.props.navigation.state.params.type === 'Login')
            return null

        return (
            <TextInput style={ styles.inputBox } 
                ref={ input => this.email = input }
                underlineColorAndroid='rgba(0,0,0,0)' 
                placeholder="email address"
                keyboardType="email-address"
                placeholderTextColor = "#ffffff"
                onChangeText={ email => this.setState({ email  }) }
                onSubmitEditing={ ()=> this.password.focus() }
            />
        )
    }

    _renderErrorMessage() {
        if (!this.state.error)
            return null

        return (
            <View style={ styles.errorArea }>
                    <Text style={ styles.errorText }>{ this.state.error }</Text>
            </View>
        )
    }

    render() {
        const { params } = this.props.navigation.state
        const loginButtonOrActivity = this.state.requesting ? <ActivityIndicator  size={25} color={'white'} /> : <Text style={ styles.submitText }>{ params.type }</Text>

        return (
            <ImageBackground style={ styles.container } source={require('../../assets/images/splash_screen_2.png')}>
                <View style={ styles.form }>
                    <TextInput style={ styles.inputBox } 
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        placeholder="username"
                        placeholderTextColor = "#ffffff"
                        selectionColor="#fff"
                        onChangeText={ username => this.setState({ username  }) }
                        onSubmitEditing={ ()=> {
                            params.type === 'Login' ? this.password.focus() : this.email.focus() 
                        }}
                    />
                    { this._renderEmailInput() }
                    <TextInput style={ styles.inputBox } 
                        ref={ input => this.password = input }
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        placeholder="password"
                        secureTextEntry
                        placeholderTextColor = "#ffffff"
                        onChangeText={ password => this.setState({ password  }) }
                    />
                    <TouchableOpacity style={ styles.submit } onPress={ this._submit.bind(this) }>
                        { loginButtonOrActivity }
                    </TouchableOpacity>
                </View>
                { this._renderErrorMessage() }
                <View style={ styles.footerContainer }>
                    <Text style={ styles.footerText }>{ params.text + ' ' }</Text>
				    <TouchableOpacity onPress={ this._changeScreen.bind(this) }>
                        <Text style={ styles.footerLink }>{ params.next }</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    form : {
        alignItems: 'center',
        marginTop: '14%'
    },
    inputBox: {
        width: DEVICE_WIDTH - 60,
        backgroundColor:'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: 'white',
        marginVertical: 10
    },
    submit: {
        width: DEVICE_WIDTH - 60,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13
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
        marginVertical: 10,
        backgroundColor:'rgba(0, 0, 255, 0.4)',
    },
    errorText: {
        color: 'white',
        fontSize: 14,
        paddingVertical: 10
    },
    footerContainer: {
        flexGrow: 1,
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