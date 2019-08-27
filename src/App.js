import React, {useState, useEffect} from 'react';
import GoogleMapReact from 'google-map-react';
import {useApolloClient} from '@apollo/react-hooks';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

import AutoComplete from './components/AutoComplete';
import Places from './components/Places';
import './App.css';
import {GET_RESTAURANTS} from "./graphql/query";
import Marker from "./components/Marker";

const useStyles = makeStyles(theme => ({
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9,
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            backgroundColor: '#18cddd',
            paddingBottom: '20px'
        },
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        zIndex: 99,
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)'
    }
}));

function App() {
    const [center, setCenter] = useState(null);
    const [mapApi, setMapApi] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapApiLoaded, setMapApiLoaded] = useState(false);
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [showOnMap, setShowOnMap] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const apolloClient = useApolloClient();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
            },
            error => console.log(error)
        );
    });

    const useCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log("position", position);
                setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
                fetchData(position.coords.latitude, position.coords.longitude);
            },
            error => console.log(error)
        );
    };

    const fetchData = async (latitude, longitude) => {
        setIsLoading(true);
        const {data} = await apolloClient.query({
            query: GET_RESTAURANTS,
            variables: {
                term: 'restaurants',
                latitude: latitude,
                longitude: longitude
            },
        });
        setPlaces(data.search.business);
        if (data.search.business.length === 0)
            setSnackBarOpen(true);
        setIsLoading(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const onChildClickCallback = (key) => {
        setSelectedPlace(key);
    };

    const onMapClick = (e) => {
        setCenter({lat: e.lat, lng: e.lng});
        fetchData(e.lat, e.lng);
    };

    const theme = useTheme();
    const downMatches = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    return center && (
        <div className="App">
            {isLoading && <div className={classes.loaderContainer}>
                <CircularProgress/>
            </div>}
            {mapApiLoaded && <div className={classes.searchContainer}>
                <AutoComplete
                    map={mapInstance} mapApi={mapApi}
                    onPlaceSelect={(place) => {
                        console.log("place 1", place.geometry.location.lat(), place.geometry.location.lng())
                        fetchData(place.geometry.location.lat(), place.geometry.location.lng());
                    }}/>
                {downMatches && <Grid container alignItems="center" justify="center">
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                style={{alignItems: 'center', justifyContent: 'center'}}
                                control={
                                    <div>
                                        <Button variant="contained" className={classes.button}
                                                onClick={useCurrentLocation}>
                                            Use My Location
                                        </Button>
                                        {places.length > 0 && <Switch
                                            checked={showOnMap}
                                            onChange={(e, checked) => setShowOnMap(checked)}
                                            value={showOnMap}/>}
                                    </div>
                                }
                                label={places.length > 0 && "Show On Map"}/>
                        </FormGroup>
                    </Grid>
                </Grid>}
            </div>}
            {places.length > 0 && !downMatches && <Places places={places}/>}
            {places.length > 0 && downMatches && !showOnMap && <Places places={places}/>}
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
                onClick={onMapClick}
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
