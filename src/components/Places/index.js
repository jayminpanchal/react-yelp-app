import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import Place from "../Place";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: 0,
        zIndex: 8,
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
        },
        [theme.breakpoints.up('sm')]: {
            maxWidth: '400px',
        },
    },
    paper: {
        height: '100vh',
        overflow: 'auto',
        padding: 0
    }
}));

const Places = ({places}) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {places.map(place => <Place place={place} key={`PLACE_CARD_${place.id}`}/>)}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Places;