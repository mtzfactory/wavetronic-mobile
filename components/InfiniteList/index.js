import React, { Component } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator, TextInput } from 'react-native'
import { List } from 'native-base'
import { SearchBar } from 'react-native-elements'

import { API_PAGE_LIMIT } from '../Constants'

export default class InfiniteList extends Component {
    constructor() {
        super()

        this.state = {
            refreshing: false,
            loading: false,
            offset: 0,
            data: [],
            error: null,
            search: null
        }

        this.results_count = 0
        this.results_fullcount = 0
        this.limit = API_PAGE_LIMIT

        this._requestData.bind(this)
        this._doTheFetch.bind(this)
    }

    componentDidMount() {
        this._requestData()
    }

    async _doTheFetch() {
        try {
            let response = await fetch(`${this.props.url}?offset=${this.state.offset}&limit=${this.limit}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.token}`
                }
            })

            let body = await response.json()

            //console.log('fetch', this.state.offset, body.headers.results_count, body.results[0].id, body.results[body.results.length-1].id)

            this.results_count = body.headers.results_count
            this.results_fullcount = body.headers.results_fullcount

            return body
        }
        catch (error) {
            throw new Error(error.name + ' ' + error.message)
        }
    }

    async _requestData() {
        const { offset } = this.state

        if (this.state.loading) return null

        this.setState({ loading: true })

        try {
            res = await this._doTheFetch()

            this.setState(prevState => {
                return {
                    data: prevState.offset === 0 ? res.results : [ ...prevState.data, ...res.results ],
                    error: res.error_message || null,
                    offset: prevState.offset + this.results_count - 1,
                    loading: false,
                    refreshing: false,
                    error: null
                }
            })
        }
        catch (error) {
            this.setState({ error, loading: false, refreshing: false })
        }

        // fetch(`${this.props.url}?offset=${this.state.offset}&limit=${this.limit}`, {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     }
        // })
        // .then(res => res.json())
        // .then(res => {
        //     this.results_count = res.headers.results_count
        //     this.results_fullcount = res.headers.results_fullcount

        //     console.log('fetch', this.state.offset, this.results_count, res.results[0].id, res.results[res.results.length-1].id)

        //     this.setState(prevState => {
        //         return {
        //             data: prevState.offset === 0 ? res.results : [ ...prevState.data, ...res.results ],
        //             error: res.error_message || null,
        //             offset: prevState.offset + this.results_count - 1,
        //             loading: false,
        //             refreshing: false,
        //             error: null
        //         }
        //     })
        // })
        // .catch(error => {
        //     this.setState({ error, loading: false, refreshing: false })
        // })
    }

    _handleLoadMore = () => {
        if (!this.state.loading && this.state.offset + 1 < this.results_fullcount) {
            this.setState(prevState => {
                return {
                    offset: prevState.offset + 1
                }
            }, () => {
                this._requestData()
            })
        }
    }

    _handleRefresh = () => {
        this.setState(prevState => {
            return {
                offset: 0,
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

    _keyExtractor = (item, index) => item.id

    _renderHeader = () => {
        return (
            <SearchBar
                lightTheme
                clearIcon
                round
                onChangeText={ this._search }
                placeholder={ this.props.searchHolder || 'Type here...' } />
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
                    <Text style={{ color: 'red' }}>{ this.state.error.message }</Text>
                </View>
            )
        }

        return this.props.renderItem(item)
    }

    _getItemLayout = (data, index) => {
        const SEARCHHEADERHEIGHT = 50
        const { rowHeight } = this.props

        return {
            offset: SEARCHHEADERHEIGHT + (rowHeight * index),
            length: rowHeight,
            index 
        }
    }

    render() {
        return (
            <List contentContainerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                <FlatList
                    data={ this.state.data }
                    renderItem={ this._renderItem }
                    initialNumToRender={ 20 }
                    keyExtractor={ this._keyExtractor }
                    getItemLayout={ this._getItemLayout }
                    ListHeaderComponent={ this._renderHeader }
                    ListFooterComponent={ this._renderFooter }
                    onEndReached={ this._handleLoadMore }
                    onEndReachedThreshold={ 0.50 }
                    refreshing={ this.state.refreshing }
                    onRefresh={ this._handleRefresh }
                    removeClippedSubviews={ true }
                />
            </List>
        )
    }
}