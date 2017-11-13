import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button } from 'native-base'
import ActionButton from 'react-native-action-button'

import { SCREEN_PLAYLISTS_COLOR, API_PAGE_LIMIT } from '../../constants'

import MusicData from '../../business/MusicData'
import UserData from '../../business/UserData'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const SCREEN = 'Playlists'
const musicData = new MusicData()
const userData = new UserData()

class PureListItem extends React.PureComponent {
    _openPlaylist = (id) => {
        Alert.alert(`${id} was clicked`)
    }

    render() {
        const { listItem } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this._openPlaylist(listItem.id) }>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.user_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.creationdate }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Open</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }
}

export default class PlaylistsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center' },
        headerStyle: { backgroundColor: SCREEN_PLAYLISTS_COLOR }
    }
    
    _renderItem = (item) => (
        <PureListItem listItem={ item } />
    )

    render() {
        const ROWHEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
        const { navigate } = this.props.navigation
        const { isPlayerVisible } = this.props.screenProps

        return (
            <View style={ styles.container }>
                <InfiniteList
                    getData={ musicData.getPlaylists }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderItem }
                    rowHeight={ ROWHEIGTH }
                    searchHolder='Search for playlists ...'
                    searchIcon='ios-infinite'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } isPlayerVisible={ isPlayerVisible } />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
})