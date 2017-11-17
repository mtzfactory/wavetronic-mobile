import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator, View, Text, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { SPLASH_COLOR } from '../../constants'

import TokenService from '../../services/TokenService'
import UserApi from '../../api/UserApi'

const BACKGROUND_IMAGE = require('../../assets/images/splash_screen_2.png')
const userApi = new UserApi()

export default class SplashScreen extends Component {   
    constructor() {
        super()
        this.state = { loaded: false }
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

        setTimeout(() => {
            //this.props.navigation.navigate(page, config)
            this.props.navigation.dispatch(resetAction)
        }, 50 )
    }

    // _handleOnLoad() {
    //     this.setState({ loaded: true })
    // }

    // componentWillMount() {
    //     this.backgroundImage = require('../../assets/images/splash_screen_2.png')
    // }

    //componentDidMount() {
    _handleOnLoad() {
        TokenService.get().readToken()
            .then(token => {
                if (token) {
                    TokenService.get().setToken(token)
                    userApi.amIAuthorized()
                        .then( () => {
                            this._navigate('Songs')
                        })
                        .catch( error => {
                            this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                        })
                }
                else {
                    this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                }
            })
            .catch( (error) =>  {
                this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
            })
    }

    render() {
        return (
            <View style={ styles.overlay }>
            <ImageBackground style={ styles.background } source={ BACKGROUND_IMAGE } onLoad={ this._handleOnLoad.bind(this) }>
                <View style={ styles.loading }>
                    <Text style={ styles.leitmotif }>do you remember when you shared music with tapes?</Text>
                    <ActivityIndicator size={'large'} color={'aliceblue'} style={ styles.spinner }/>
                </View>
            </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    background: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: SPLASH_COLOR
    },
    loading: {
        marginVertical: '10%',
        marginHorizontal: '8%'
    },
    leitmotif: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 28,
        textAlign: 'center',
        paddingTop: 10,
        color: '#EDEDED'
    },
    spinner: {
        marginVertical: '10%'
    }
})