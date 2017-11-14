import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator, View, Text, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { SPLASH_COLOR } from '../../constants'

import TokenService from '../../services/TokenService'
import UserApi from '../../api/UserApi'

const userApi = new UserApi()

export default class SplashScreen extends Component {    
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

    componentWillMount() {
        this.backgroundImage = require('../../assets/images/splash_screen_2.png')
    }

    componentDidMount() {
        TokenService.get().readToken()
            .then(token => {
                if (token) {
                    console.log('Splash token:', token)
                    //apiAuthorization.amIAuthorized(token)
                    TokenService.get().setToken(token)
                    userApi.amIAuthorized()
                        .then( () => {
                            console.log('Splash -> Songs')
                            this._navigate('Songs') //this._navigate('Songs', { token })
                        })
                        .catch( error => {
                            console.log('Splash -> Login:', error.message)
                            this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                        })
                }
                else {
                    console.log('Splash -> Login: no token', token)
                    this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                }
            })
            .catch( (error) =>  {
                console.log('Splash -> Login: error', error.message)
                this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
            })
    }

    render() {
        return (
            <ImageBackground style={ styles.container } source={this.backgroundImage}>
                <View style={ styles.loading }>
                    <Text style={ styles.leitmotif }>do you remember when you shared music with tapes?</Text>
                    <ActivityIndicator size={'large'} color={'aliceblue'} style={ styles.spinner }/>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: SPLASH_COLOR //'#EEF3E2'
    },
    loading: {
        marginVertical: '10%'
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