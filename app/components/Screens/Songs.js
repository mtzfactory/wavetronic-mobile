import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, Alert } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button } from 'native-base'
import ActionButton from 'react-native-action-button'

import { SCREEN_SONGS_COLOR, SCREEN_SONGS_DARK_COLOR, API_PAGE_LIMIT } from '../../constants'

import MusicData from '../../business/MusicData'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const SCREEN = 'Songs'
const musicData = new MusicData()

class PureListItem extends React.PureComponent {
    render() {
        const { listItem } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this.props.handlePlaySong(listItem) }>
                <Left>
                    <Thumbnail square large source={{ uri: listItem.image }} />
                </Left>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.album_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Play</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }
}

export default class SongsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center' },
        headerStyle: { backgroundColor: SCREEN_SONGS_COLOR }
    }

    constructor() {
        super()

        this.state = {
            songId: null,   // para marcar el listitem de otro color....
        }
    }

    _renderItem = (item) => (
        <PureListItem listItem={ item } handlePlaySong={ this.props.screenProps.handlePlaySong } />
    )

    render() {
        const ROWHEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical
        const { navigate } = this.props.navigation
        const { isPlayerVisible } = this.props.screenProps

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_SONGS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ musicData.getTracks }
                    limit={ API_PAGE_LIMIT }
                    renderItem={ this._renderItem }
                    rowHeight={ ROWHEIGTH }
                    searchHolder='Search for songs ...'
                    searchIcon='ios-headset'
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
    }
})