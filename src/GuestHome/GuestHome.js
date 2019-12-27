import React, { Component } from 'react'
import GuestNavBar from '../GuestNavBar'
import { Icon } from 'antd'
import Input from 'muicss/lib/react/input'
import SearchResults from '../SearchResults'
import axios from 'axios'
import queryString from 'query-string'
import '../main.css'
import 'antd/dist/antd.css'
import 'muicss/dist/css/mui.min.css'
import styles from './GuestHome.module.css'
const { 
    searchBar,
    loadingIcon
} = styles

var CancelToken = axios.CancelToken // https://stackoverflow.com/questions/42896831/cancel-axios-get-request-when-typing-reactjs
var cancel

class GuestHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlistName: '',
            searchResults: [],
            roomCode: '',
            loading: false
        }
        this.onSearchChange = this.onSearchChange.bind(this)
    }
    componentDidMount() {
        let playlistName, roomCode
        if (this.props.fromProps) {
            playlistName = this.props.playlistName
            roomCode = this.props.roomCode
        } else {
            var rawQuery = queryString.parse(this.props.location.search)
            playlistName = rawQuery.playlistName
            roomCode = rawQuery.roomCode
        }
        this.setState({ playlistName, roomCode })
    }
    onSearchChange(q) {
        if (cancel !== undefined) {
            cancel();
        }
        this.setState({
            loading: true,
            searchResults: []
        })
        axios.post(`${process.env.REACT_APP_BACK_END_URI}/search-songs`, {
            q
        }, {
            withCredentials: true,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c
            })
        })
        .then((response) => {
            const { results } = response.data
            console.log(results)
            this.setState({
                searchResults: results.tracks.items
            })
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            this.setState({
                loading: false
            })
        })
    }
    render() {
        return(
            <div>
                <GuestNavBar 
                    playlistName={this.state.playlistName} 
                    roomCode={this.state.roomCode}
                    host={false}
                    locked={this.props.locked}
                />
                <Input 
                    className={searchBar}
                    onChange={e => this.onSearchChange(e.target.value)}
                    label="Search for Tracks"
                    floatingLabel={true}
                />
                <SearchResults 
                    searchResults={this.state.searchResults}
                    roomCode={this.state.roomCode}
                />
                {this.state.loading && <Icon 
                    type="loading" 
                    className={loadingIcon}
                />}
            </div>
        )
    }
}

export default GuestHome