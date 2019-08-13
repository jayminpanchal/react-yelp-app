import React, {useState, useEffect} from 'react';
import GoogleMapReact from 'google-map-react';
import {useApolloClient} from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import AutoComplete from './components/AutoComplete';
import Places from './components/Places';
import './App.css';
import {GET_RESTAURANTS} from "./graphql/query";
import Marker from "./components/Marker";

function App() {
    const [center, setCenter] = useState(null);
    const [mapApi, setMapApi] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapApiLoaded, setMapApiLoaded] = useState(false);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const apolloClient = useApolloClient();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
            },
            error => console.log(error)
        );
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const onChildClickCallback = (key) => {
        setSelectedPlace(key);
    };

    return center && (
        <div className="App">
            {mapApiLoaded && <div className="searchContainer">
                <AutoComplete
                    map={mapInstance} mapApi={mapApi}
                    onPlaceSelect={async (place) => {
                        console.log("place 1", place.geometry.location.lat(), place.geometry.location.lng())
                        const {data} = await apolloClient.query({
                            query: GET_RESTAURANTS,
                            variables: {
                                term: 'restaurants',
                                latitude: place.geometry.location.lat(),
                                longitude: place.geometry.location.lng()
                            },
                        });
                        setPlaces(data.search.business);
                        if (data.search.business.length === 0)
                            setSnackBarOpen(true);
                    }}/>
            </div>}
            {places.length > 0 && <Places places={places}/>}
            <GoogleMapReact
                onGoogleApiLoaded={({map, maps}) => {
                    console.log("google api loaded");
                    setMapInstance(map);
                    setMapApi(maps);
                    setMapApiLoaded(true);
                }}
                bootstrapURLKeys={{key: process.env.REACT_APP_MAP_KEY, libraries: 'places'}}
                center={center}
                defaultZoom={11}
                onChildClick={onChildClickCallback}>
                {places.map(place =>
                    <Marker
                        key={place.id}
                        lat={place.coordinates.latitude}
                        lng={place.coordinates.longitude}
                        place={place}
                        show={place.id === selectedPlace}/>
                )}
            </GoogleMapReact>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackBarOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">No Restaurant found</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>,
                ]}
            />
        </div>
    );
}

export default App;
