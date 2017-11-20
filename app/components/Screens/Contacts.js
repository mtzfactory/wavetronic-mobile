import React, { Component } from 'react'
import { StyleSheet, Platform, StatusBar, ActivityIndicator, FlatList } from 'react-native'
import { View, List, ListItem, Left, Right, Body, Thumbnail, Text, Button } from 'native-base'
import { SearchBar } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import uuidv4 from 'uuid/v4'

import { MAIN_THEME_COLOR, SCREEN_CONTACTS_COLOR, SCREEN_CONTACTS_DARK_COLOR, API_URL_FRIENDS } from '../../constants'
import UserApi from '../../api/UserApi'
import InfiniteList from '../InfiniteList'
import FabNavigator from '../FabNavigator'

const SCREEN = 'Contacts'
const userApi = new UserApi()

export default class ContactsScreen extends Component {
    static navigationOptions = {
        title: SCREEN,
        headerLeft: null,
        headerTitleStyle : { alignSelf: 'center', color: SCREEN_CONTACTS_COLOR },
        headerStyle: { backgroundColor: MAIN_THEME_COLOR }
    }

    constructor() {
        super()

        this.state = {
            refreshing: false,
            loading: false,
            page: 1,
            data: [],
            error: null,
            search: null,
            seed: 0
        }

        this._requestData.bind(this)
        this._doTheFetch.bind(this)
    }

    componentWillMount() {
        this._requestData()
    }
    
    async _doTheFetch() {
        try {
            let response = await fetch(`${API_URL_FRIENDS}&page=${this.state.page}&seed=${this.state.seed}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })

            let body = await response.json()
            return body
        }
        catch (error) {
            throw new Error(error.name + ' ' + error.message)
        }
    }

    async _requestData() {
        const { page } = this.state

        if (this.state.loading) return null

        this.setState({ loading: true })

        try {
            res = await this._doTheFetch()

            this.setState(prevState => {
                return {
                    data: prevState.page === 0 ? res.results : [ ...prevState.data, ...res.results ],
                    error: res.error_message || null,
                    loading: false,
                    refreshing: false,
                    error: null
                }
            })
        }
        catch (error) {
            this.setState({ error, loading: false, refreshing: false })
        }
    }

    _handleLoadMore = () => {
        if (!this.state.loading) {
            this.setState(prevState => {
                return {
                    page: prevState.page + 1
                }
            }, () => {
                this._requestData()
            })
        }
    }

    _handleRefresh = () => {
        this.setState(prevState => {
            return {
                page: 0,
                seed: prevState.seed + 1,
                refreshing: true
            }
        }, () => {
            this._requestData()
        })
    }

    _search() {
        // Set loading to true when the search starts to display a Spinner
        // this.setState({
        //     loading: true
        // });
        console.log('search')
    }

    _keyExtractor = (item, index) => uuidv4()

    _renderHeader = () => {
        return (
            <SearchBar
                lightTheme
                clearIcon
                round
                onChangeText={ this._search }
                placeholder={ this.props.searchHolder || 'Type here...' }
            />
        )
    }

    _renderFooter = () => {
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator animating size='large'/>
            </View>
        )
    }

    _renderItem = ( {item} ) => {
        if (this.state.error) {
            return (
                <View>
                    <Text style={{ color: 'red' }} >{ this.state.error.message }</Text>
                </View>
            )
        }

        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail source={{ uri: item.picture.medium }} />
                </Left>
                <Body>
                    <Text numberOfLines={ 1 } >{ item.name.first + ' ' + item.name.last }</Text>
                    <Text numberOfLines={ 1 } note>{ item.email }</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Open</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }

    _getItemLayout = (data, index) => {
        const SEARCHHEADERHEIGHT = 50
        const ROWHEIGHT = 56 + 2 * 15 // Thumbnail size + 2 * paddingVertical

        return {
            offset: SEARCHHEADERHEIGHT + (ROWHEIGHT * index),
            length: ROWHEIGHT,
            index 
        }
    }

    render() {
        const { navigate, state: { params } } = this.props.navigation

        return (
            <View style={ styles.container }>
                {
                    Platform.OS === 'android' && <StatusBar barStyle="light-content" backgroundColor={ SCREEN_CONTACTS_DARK_COLOR } />
                }
                <List contentContainerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <FlatList
                        data={ this.state.data }
                        renderItem={ this._renderItem }
                        getItemLayout={ this._getItemLayout }
                        initialNumToRender={ 15 }
                        keyExtractor={ this._keyExtractor }
                        ListHeaderComponent={ this._renderHeader }
                        ListFooterComponent={ this._renderFooter }
                        onEndReached={ this._handleLoadMore }
                        onEndReachedThreshold={ 0.75 }
                        refreshing={ this.state.refreshing }
                        onRefresh={ this._handleRefresh }
                        removeClippedSubviews={ true }
                    />
                </List>
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