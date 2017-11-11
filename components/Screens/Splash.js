import React, { Component } from 'react'
import { StyleSheet, AsyncStorage, ActivityIndicator, View, Text, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation'

import apiAuthorization from '../../services/ApiAuthorization' 

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
    
    componentDidMount() {
        AsyncStorage.getItem('@mtzfactory:token')
            .then(token => {
                if (token) {
                    //console.log('Splash token:', token)
                    apiAuthorization.amIAuthorized(token)
                        .then( () => {
                            //console.log('Splash -> Songs')
                            this._navigate('Songs', { token })
                        })
                        .catch( error => {
                            //console.log('Splash -> Login:', error.message)
                            this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                        })
                }
                else {
                    this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' })
                }
            })
            .catch( () => this._navigate('Login', { type: 'Login', next:'Sign up', text: 'Don\'t have an account yet?' }))
    }

    render() {
        return (
            <ImageBackground style={ styles.container } source={require('../../assets/images/splash_screen_2.png')}>
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
        backgroundColor: '#EEF3E2'
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