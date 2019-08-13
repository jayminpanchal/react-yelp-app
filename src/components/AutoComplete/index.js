import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';

class AutoComplete extends Component {

    componentDidMount() {
        const options = {};
        this.autoComplete = new this.props.mapApi.places.Autocomplete(
            this.searchInput,
            options,
        );
        this.autoComplete.addListener('place_changed', this.onPlaceChanged);
        this.autoComplete.bindTo('bounds', this.props.map);
    }

    componentWillUnmount() {
        this.props.mapApi.event.clearInstanceListeners(this.searchInput);
    }

    onPlaceChanged = () => {
        const place = this.autoComplete.getPlace();

        if (!place.geometry) return;
        if (place.geometry.viewport) {
            this.props.map.fitBounds(place.geometry.viewport);
        } else {
            this.props.map.setCenter(place.geometry.location);
            this.props.map.setZoom(17);
        }

        this.props.onPlaceSelect(place);
        this.searchInput.blur();
    };

    clearSearchBox = () => {
        this.searchInput.value = '';
    };

    render() {
        return (
            <div className="autoCompleteContainer">
                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs={4}>
                        <Paper>
                            <InputBase
                                inputProps={{
                                    ref: (ref) => {
                                        this.searchInput = ref;
                                    },
                                    'aria-label': 'naked'
                                }}
                                style={{width: '100%', padding: '5px 10px'}}
                                onFocus={this.clearSearchBox}
                                placeholder="Enter a location"
                            />
                            {/*<input
                        ref={(ref) => {
                            this.searchInput = ref;
                        }}
                        type="text"
                        onFocus={this.clearSearchBox}
                        placeholder="Enter a location"
                    />*/}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default AutoComplete;