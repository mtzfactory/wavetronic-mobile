import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList, ActivityIndicator, TextInput } from 'react-native'
import { List } from 'native-base'
import { SearchBar } from 'react-native-elements'
import uuidv4 from 'uuid/v4'

export default class InfiniteList extends Component {
    constructor() {
        super()

        this.state = {
            refreshing: false,
            loading: false,
            offset: 0,
            data: [],
            error: null,
            search: null,
            searching: false
        }

        this._requestData.bind(this)
    }

    componentWillMount() {
        this.results_count = 0
        this.results_fullcount = 0
        this._requestData()
    }

    _requestData () {
        if (this.state.loading)
            return null
        
        this.setState({ loading: true })

        this.props.getData(this.state.offset, this.props.limit, this.state.search)
            .then( res => {
                this.results_count = res.headers.results_count
                this.results_fullcount = res.headers.results_fullcount

                this.setState(prevState => {
                    return {
                        data: prevState.offset === 0 ? res.results : [ ...prevState.data, ...res.results ],
                        error: res.error_message || null,
                        loading: false,
                        refreshing: false,
                        searching: false,
                        error: null
                    }
                })
            })
            .catch( error => {
                console.log(error.message)
                this.setState({ error: error.message, loading: false, refreshing: false })
            })
    }

    _handleLoadMore = () => {
        if (this.state.offset + this.results_count  < this.results_fullcount) {
            this.setState(prevState => {
                return {
                    offset: prevState.offset + this.results_count,
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

    _search = (search) => {
        if (search.length >= 4) {
            this.setState({ offset: 0, search, searching: true }, () => {
                this._requestData()
            })
            
        }
    }

    _clearSearch = () => {
        this.setState({ offset: 0, search: null, searching: false }, () => {
            this._requestData()
        })
    }

    _renderHeader = () => {
        return (
            <SearchBar
                lightTheme round clearIcon
                showLoadingIcon = { this.state.searching }
                onChangeText={ this._search }
                onClearText={ this._clearSearch }
                placeholder={ this.props.searchHolder } />
        )
    }

    _renderFooter = () => {
        if ( this.state.loading )
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator animating size='large'/>
                </View>
            )

        return null
    }

    _renderItem = ( { item, index } ) => {
        if (this.state.error) {
            return (
                <View>
                    <Text style={{ color: 'red' }}>{ this.state.error.message }</Text>
                </View>
            )
        }

        return this.props.renderItem(item, index)
    }

    _getItemLayout = (data, index) => {
        const SEARCH_HEADER_HEIGHT = 50
        const { rowHeight } = this.props

        return {
            offset: SEARCH_HEADER_HEIGHT + (rowHeight * index),
            length: rowHeight,
            index 
        }
    }

    _keyExtractor = (item, index) => item.id || item._id || uuidv4()

    render() {
        return (
            <FlatList
                key={ this.props.listKey }
                data={ this.state.data }
                renderItem={ this._renderItem }
                keyExtractor={ this._keyExtractor }
                getItemLayout={ this._getItemLayout }
                ListHeaderComponent={ this._renderHeader }
                ListFooterComponent={ this._renderFooter }
                onRefresh={ this._handleRefresh }
                onEndReached={ this._handleLoadMore }
                onEndReachedThreshold={ 0.50 }
                refreshing={ this.state.refreshing }
                removeClippedSubviews={ true }
                initialNumToRender={ this.props.initialNumToRender }
                numColumns={ this.props.columns }
            />
        )
    }
}

InfiniteList.propTypes = {
    listKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]),
    getData: PropTypes.func.isRequired,
    limit: PropTypes.number,
    initialNumToRender: PropTypes.number,
    columns: PropTypes.number,
    renderItem: PropTypes.func.isRequired,
    rowHeight: PropTypes.number.isRequired,
    searchHolder: PropTypes.string.isRequired,
}

InfiniteList.defaultProps = {
    listKey: uuidv4(),
    limit: 15,
    initialNumToRender: 8,
    columns: 1,
    searchHolder: 'Type here...',
}