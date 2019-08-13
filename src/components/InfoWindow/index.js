import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

const InfoWindow = (props) => {
    const {place} = props;
    const infoWindowStyle = {
        position: 'relative',
        bottom: 150,
        left: '-45px',
        width: 220,
        backgroundColor: 'white',
        boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
        padding: 10,
        fontSize: 14,
        zIndex: 100,
    };

    return (
        <div style={infoWindowStyle}>
            <Typography variant="subtitle1" align="left">
                {place.name}
            </Typography>
            <Typography variant="body2" align="left" color="textSecondary">
                {place.categories.map(category => category.title).join(', ')}
            </Typography>
            <Typography variant="body2" gutterBottom align="left" color="textSecondary">
                {place.location.formatted_address}
            </Typography>
        </div>
    );
};

export default InfoWindow;
