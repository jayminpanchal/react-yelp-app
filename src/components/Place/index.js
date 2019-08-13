import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
    card: {
        padding: theme.spacing(3, 2),
        borderRadius: 0,
        boxShadow: 'none',
        borderBottom: '1px solid #ddd'
    },
    imageGrid: {
        padding: 0
    },
    imageContainer: {
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%',
        height: '100px'
    },
    rating: {
        width: 200,
        display: 'flex',
        alignItems: 'center',
    },
    ratingCount: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '12px'
    },
    ratingText: {
        color: '#ffb400',
        fontSize: '12px'
    }
}));

const Place = ({place}) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <Grid container>
                <Grid item xs={8}>
                    <Typography variant="subtitle1" align="left">
                        {place.name}
                    </Typography>
                    <div className={classes.rating}>
                        <Box className={classes.ratingText}>({place.rating})</Box>
                        <Rating value={place.rating} readOnly size="small" precision={0.5}/>
                        <Box className={classes.ratingCount}>({place.review_count})</Box>
                    </div>
                    <Typography variant="body2" align="left" color="textSecondary">
                        {place.categories.map(category => category.title).join(', ')}
                    </Typography>
                    <Typography variant="body2" gutterBottom align="left" color="textSecondary">
                        {place.location.formatted_address}
                    </Typography>
                </Grid>
                <Grid item xs={4} className={classes.imageGrid}>
                    <div className={classes.imageContainer}>
                        <img src={place.photos[0]} alt="" className={classes.image}/>
                    </div>
                </Grid>
            </Grid>
        </Card>
    )
};

export default Place;