import './style.css'

import React from 'react';

const CardComp = ({URL, brand, nomination, unit_name, unit_value}) => {
    return(
        <div className='preview_product'>
            <div className="preview_product-image" style={{backgroundImage: `url(https://memetricsserver.onrender.com${URL})`}}></div>
            <h2 className="preview_product-nomination">{(nomination.length > 20) ? nomination.slice(0, 20) + '...' : nomination}</h2>
            <div className='preview_product-subinfo'>
                <p className="preview_product-brand">Brand: {brand}</p>
                <p className="preview_product-unit">Unit: {unit_value}{unit_name}</p>
            </div>
        </div>
    )
}

export default CardComp;

