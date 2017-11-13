import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'

import SplashScreen from '../Screens/Splash'
import LoginScreen from '../Screens/Login'
import SongsScreen from '../Screens/Songs'
import AlbumsScreen from '../Screens/Albums'
import PlaylistsScreen from '../Screens/Playlists'
import ContactsScreen from '../Screens/Contacts'

const RootStackNavigator = StackNavigator(
    {
        Splash: { 
            screen: SplashScreen,
            navigationOptions: {
                header: false
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                header: false
            } 
        },
        Songs: { screen: SongsScreen },
        Albums: { screen: AlbumsScreen },
        Playlists: { screen: PlaylistsScreen },
        Contacts: { screen: ContactsScreen },
    },
    {
        navigationOptions: () => ({
            headerTitleStyle: {
                fontWeight: 'normal',
                justifyContent: 'center'
            },
        }),
        transitionConfig: () => ({ 
            screenInterpolator: () => null
        })
    }
  )

export default class RootNavigation extends Component {
    render() {
        return (
            <RootStackNavigator screenProps={ { handlePlaySong: this.props.handlePlaySong, isPlayerVisible: this.props.isPlayerVisible } } />
        )
    }
}
