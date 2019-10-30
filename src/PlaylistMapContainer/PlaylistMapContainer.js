import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import axios from 'axios'
import PlaylistMap from '../PlaylistMap'
import { notification } from 'antd'
import '../main.css'
import 'antd/dist/antd.css'
import { geolocated } from 'react-geolocated'

class PlaylistMapContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlists: [],
            coords: {latitude: 0, longitude: 0},
        }
    }
    componentDidUpdate = (prevProps) => {
        if (this.props.coords !== null && prevProps.coords === null) {
            this.setState({coords: this.props.coords})
            axios.get(`${process.env.REACT_APP_BACK_END_URI}/get-nearby-playlists?latitude=${this.props.coords.latitude}&longitude=${this.props.coords.longitude}`, {}, {
                withCredentials: true
            })
            .then((response) => {
                const { playlists } = response.data
                this.setState({ playlists })
            })
            .catch((error) => {
                // const { status } = error.response
                notification.error({
                    message: 'Could not get nearby playlists',
                    description: 'Please try again later'
                })
            })
        }
    }
    couldNotDetermineLocation = () => {
        if (this.state.coords.latitude === 0 && this.state.coords.longitude === 0) {
            notification.error({
                message: 'Could not determine location.',
                description: 'Please try again later or enter the code for the party'
            })
        }
    }
    componentDidMount() {
        if (this.props.isGeolocationAvailable) {
            if (!this.props.isGeolocationEnabled) {
                notification.error({
                    message: 'Please enable geolocation on your browser',
                })
                this.props.changeToGuestLoginView()
            } else {
                setTimeout(this.couldNotDetermineLocation, 3000);
            }
        } else {
            notification.error({
                message: 'No location',
                description: 'Your browser does not have geolocation capabilities'
            })
            this.props.changeToGuestLoginView()
        }
    }
    render() {
        return(
            <PlaylistMap 
                coords={this.state.coords}
                nearbyPlaylists={this.state.playlists}
            />
        )
    }
}

export default geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  })(PlaylistMapContainer)