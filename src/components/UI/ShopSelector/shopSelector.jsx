import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import ColorPallet from '../ColorPallet/pallet';

import './shopSelector.css';

const MarketSelector = forwardRef(({index, handler, text, selected=false}, ref) => {

    const [status, setStatus] = useState(selected);
    const palette = useRef(null);

    useImperativeHandle(ref, () => ({
        getStatus: () => {
            return status;
        },
        getName: () => {
            return {
                shop: text,
                color: palette.current.getColor()
            };
        }
    }));

    async function handleSelect(event) {
        if(!document.getElementById(`paletteIndex${index}`).contains(event.target)){

            await setStatus(!status);
            handler(index);
        }
        
    }

    return (
        <li className={`selector-short-container ${(status) ? 'selector-short-container__active' : ''}`} onClick={handleSelect}>
            <div className={`selector-short-check ${(status) ? 'selector-short-check__active' : ''}`}></div>
            <div className='selector-short-content'>
                <img className='selector-short-image' src={`./images/${text}.png`} alt="shop_image" />
                <p className='selector-short-text'>{text}</p>

                <div id={`paletteIndex${index}`} className="selector-short-pallete">
                    <ColorPallet ref={palette}/>
                </div>
            </div>
        </li>
    )
});


export default React.memo(MarketSelector);