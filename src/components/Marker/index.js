import React from 'react';

import InfoWindow from '../InfoWindow';

const Marker = ({place, show}) => {
    const markerStyle = {
        height: 32,
        width: 32,
        cursor: 'pointer',
        zIndex: 10,
    };

    return (
        <div>
            <div>
                <img src="/marker.png" alt="" style={markerStyle}/>
            </div>
            {show && <InfoWindow place={place}/>}
        </div>
    );
};

export default Marker;