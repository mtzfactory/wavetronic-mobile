import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native'
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

    componentDidMount() {
        this.results_count = 0
        this.results_fullcount = 0
        this._requestData()
    }

    _requestData () {
        // if (this.state.loading)
        //     return null
        
        this.setState({ loading: true })

        this.props.getData(this.state.offset, this.props.limit, this.state.search)
            .then( res => {
                this.results_count = res.headers.results_count
                this.results_fullcount = res.headers.results_fullcount

                console.log('_requestData', res.results.length)
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
            console.log('_handleLoadMore')
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
        if (this.state.loading)
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator animating size='small'/>
                </View>
            )

        if (this.state.offset + this.results_count  >= this.results_fullcount)
            return (
                <View style={{ paddingTop: 10, paddingBottom: 20, flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: "#d1d1d1" }}>no more</Text>
                </View>
            )

        return null
    }

    _renderItem = ( { item, index } ) => {
        if (this.state.error) {
            return (
                <View style={{ height: this.props.rowHeight, flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: 'red' }}>{ this.state.error.message }</Text>
                </View>
            )
        }

        console.log('_renderItem', index, item.name, this.state.data.length)
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

    _keyExtractor = (item, index) => uuidv4() // item.id || item._id || uuidv4()

    render() {
        const { props } = this
        return (
            <FlatList
                key={ this.props.listKey }
                data={ this.state.data }
                extraData={ props.extraData }
                renderItem={ this._renderItem }
                keyExtractor={ this._keyExtractor }
                getItemLayout={ this._getItemLayout }
                ListHeaderComponent={ this._renderHeader }
                ListFooterComponent={ this._renderFooter }
                onRefresh={ this._handleRefresh }
                refreshing={ this.state.refreshing }
                onEndReached={ this._handleLoadMore }
                onEndReachedThreshold={ 0.45 }
                numColumns={ props.columns }
                removeClippedSubviews={ true }
                initialNumToRender={ props.initialNumToRender }
                maxToRenderPerBatch={ props.initialNumToRender }
                windowSize={ props.windowSize }
                //updateCellsBatchingPeriod={40}
                keyboardShouldPersistTaps="always"
                //debug={true}
            />
        )
    }
}

InfiniteList.propTypes = {
    listKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    getData: PropTypes.func.isRequired,
    extraData: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    renderItem: PropTypes.func.isRequired,
    rowHeight: PropTypes.number.isRequired,
    columns: PropTypes.number,
    limit: PropTypes.number,
    initialNumToRender: PropTypes.number,
    maxToRenderPerBatch: PropTypes.number,
    windowSize: PropTypes.number,
    searchHolder: PropTypes.string.isRequired,
}

InfiniteList.defaultProps = {
    listKey: uuidv4(),
    columns: 1,
    limit: 15,
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    windowSize: 3,
    searchHolder: 'Type here...',
}