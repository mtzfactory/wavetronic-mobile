import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, Alert } from 'react-native'
import { View, ListItem, Left, Right, Body, Thumbnail, Text, Button } from 'native-base'
import ActionButton from 'react-native-action-button'

import { SCREEN_ALBUMS_COLOR, SCREEN_ALBUMS_DARK_COLOR, API_PAGE_LIMIT } from '../../constants'

import MusicApi from '../../api/MusicApi'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const SCREEN = 'Albums'
const musicApi = new MusicApi()

class PureListItem extends React.PureComponent {
    _openAlbum = (id) => {
        Alert.alert(`${id} was clicked`)
    }

    render () {
        const { listItem } = this.props

        return (
            <ListItem thumbnail button={true} onPress={ () => this._openAlbum(listItem.id) }>
                <Left>
                    <Thumbnail square large source={{ uri: listItem.image }} />
                </Left>
                <Body>
                    <Text numberOfLines={ 1 } >{ listItem.name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.artist_name }</Text>
                    <Text numberOfLines={ 1 } note>{ listItem.releasedate }</Text>
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

export default class AlbumsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center', color: '#fff' },
        headerStyle: { backgroundColor: SCREEN_ALBUMS_COLOR }
    }

    constructor () {
        super()

        this.state = { columns: 1 }
    }

    _renderItem = (item) => (
        <PureListItem listItem={ item } />
    )

    render () {
        const ROWHEIGTH = 80 + 15 + 15 // 80 por Thumbnail large + 2 * (12+3) ListItem paddingVertical        
        const { navigate } = this.props.navigation

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_ALBUMS_DARK_COLOR } />
                }
                <InfiniteList
                    getData={ musicApi.getAlbums }
                    renderItem={ this._renderItem }
                    rowHeight={ ROWHEIGTH }
                    columns= { this.state.columns }
                    searchHolder='Search for albums ...'
                />
                <FabNavigator current={ SCREEN } navigate={ navigate } />
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