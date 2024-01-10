import React, {useState, forwardRef, useImperativeHandle} from 'react';

import './selector.css';

const Selector = forwardRef(({index, handleAdd, name, brand, from, price, fromStatus=false}, ref) => {

    const [status, setStatus] = useState(fromStatus);

    useImperativeHandle(ref, () => ({
        getStatus: () => {
            return status;
        },
        getName: () => {
            return {
                name: name,
                brand: brand,
                shop: from
            };
        }
    }));

    async function handleSelect(event) {
        await setStatus(!status);
        handleAdd(index);
    }

    return (
        <li className={`selector_container ${(status) ? 'selector_container__active' : ''}`} onClick={handleSelect}>
            <div className={`selector_check ${(status) ? 'selector_check__active' : ''}`}></div>
            <div>
                <p className='selector_text'>{name}</p>
                <p className='selector_text'>{brand}</p>
                <p className='selector_text'>{from}</p>
                <p className='selector_text'>{price}</p>
            </div>
        </li>
    )
});


export default React.memo(Selector);