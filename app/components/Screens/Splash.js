import React, { Component } from 'react'
import { StyleSheet, Alert, ActivityIndicator, View, Text, ImageBackground } from 'react-native'
import { NavigationActions } from 'react-navigation'

const BACKGROUND_PORTRAIT_IMAGE = require('../../assets/images/Default-Portrait.png')
const BACKGROUND_LANDSCAPE_IMAGE = require('../../assets/images/Default-Landscape.png')
import { LANDSCAPE, PORTRAIT, SPLASH_COLOR } from '../../constants'

import TokenService from '../../services/TokenService'

import UserApi from '../../api/UserApi'
const userApi = new UserApi()

export default class SplashScreen extends Component {   
    constructor() {
        super()
        this.state = { loaded: false, orientation: PORTRAIT }
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

        setTimeout(() => {
            //this.props.navigation.navigate(page, config)
            this.props.navigation.dispatch(resetAction)
        }, 50 )
    }

    _handleOnLoad = () => {
        TokenService.get().readToken()
            .then(token => {
                if (token) {
                    TokenService.get().setToken(token)
                    userApi.amIAuthorized()
                        .then( () => {
                            userApi.updatePushNotificationToken(this.props.screenProps.pnToken)
                                .catch(error => Alert.alert(error.message))
                            this._navigate('Tracks')
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

    _handleOnLayout = (event) => {
        const {x, y, width, height} = event.nativeEvent.layout
        if (width > height)
          this.setState({ orientation: LANDSCAPE })
        else
          this.setState({ orientation: PORTRAIT })
    }

    render() {
        const BACKGROUND_IMAGE = this.state.orientation === PORTRAIT 
            ? BACKGROUND_PORTRAIT_IMAGE 
            : BACKGROUND_LANDSCAPE_IMAGE

        return (
            <ImageBackground style={ styles.background } source={ BACKGROUND_IMAGE } onLoad={ this._handleOnLoad }>
                <View style={ styles.overlay } onLayout={ this._handleOnLayout }>
                    <View style={ styles.loading }>
                        <Text style={ styles.leitmotif }>do you remember when you shared music with tapes?</Text>
                        <ActivityIndicator size={'large'} color={'aliceblue'} style={ styles.spinner }/>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: SPLASH_COLOR
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    loading: {
        marginVertical: '10%',
        marginHorizontal: '8%'
    },
    leitmotif: {
        fontFamily: 'Comfortaa-Bold',
        fontSize: 28,
        textAlign: 'center',
        paddingTop: 10,
        color: '#EDEDED'
    },
    spinner: {
        marginVertical: '10%'
    }
})