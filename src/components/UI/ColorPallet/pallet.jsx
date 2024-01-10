import { useDetectOutsideClick } from '../DropDownComp/useDetectOutsideClick';
import './palletStyle.css';

import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react'

const ColorPallet = forwardRef((props, _ref) => {

    useImperativeHandle(_ref, () => ({
        getColor: () => {
            return `hsl(${currentColor} 95% 48%)`;
        }
    }))



    const [currentColor, setCurrentColor] = useState((Math.floor(Math.random() * (360 - 0 + 1)) + 0));
    const [selected, setSelected] = useState(false);
    // const [isActive, setIsActive] = useState(false);s



    const paletteRef = useRef(null);
    const colorContainerRef = useRef(null);




    function makeHslRange(start = 0, end = 360){
        let array = [];

        for(let i = start; i <= end; i+= 60){
            array.push(`hsl(${i} 95% 48%)`);
        }

        return array
    }
    const hslColorsRange = makeHslRange();




    const cyrcleRadius = 10;


    const cyrcleToggleStyle = {
        position: 'absolute',
        left: `${currentColor / 1.5 - cyrcleRadius}px`,
        top: `calc(50% - ${cyrcleRadius}px)`,
        width: `${cyrcleRadius * 2}px`,
        height: `${cyrcleRadius * 2}px`,
        border: '1px solid white',
        borderRadius: '50%',
        boxSizing: 'border-box',
        backgroundColor: `hsl(${currentColor} 95% 48%)`,
        cursor: 'pointer'
    }




    const handleDown = async (event) => {
        event.preventDefault();

        await setSelected(true);

    }

    window.onmouseup =  async(event) => {
        event.preventDefault();
        if(selected){
            await setSelected(false);
        }
    }

    window.onmousemove = async(event) => {
        event.preventDefault();
        if(selected){
            let offsetX = event.clientX - colorContainerRef.current.getBoundingClientRect().x,
                palette = paletteRef.current,
                positionAbsolute = 0;

            if(offsetX >= 0 && offsetX <= 240){
                palette.style.left = `${offsetX - cyrcleRadius}px`;
                positionAbsolute = offsetX;
            }else{
                if(offsetX < 0){
                    palette.style.left = `${0 - cyrcleRadius}px`;
                    positionAbsolute = 0;
                }

                if(offsetX > 240){
                    palette.style.left = `${240 - cyrcleRadius}px`;
                    positionAbsolute = 240;
                }
            }

            positionAbsolute = positionAbsolute * 1.5

            await setCurrentColor(positionAbsolute);
        }
    }

    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

    function handleOpenDrop(event){
        setIsActive(!isActive)
    }


    return (
        <div className='_color-container' ref={dropdownRef}>
            {!isActive &&<div className='_color-preview' onClick={handleOpenDrop}>
                <p className='_color-text'>Color: </p>
                <div className='_color-preview-cyrcle' style={{backgroundColor: `hsl(${currentColor} 95% 48%)`}}></div>
            </div>}
            {isActive && 
                <div className='_color-drop'>
                    <div ref={colorContainerRef} className='_color-palette'>
                        <div className='_color-palette-line' style={{backgroundImage: `linear-gradient(to right, ${hslColorsRange.join(', ')})`}}></div>
                        <div ref={paletteRef} className='_color-palette-cyrcle' style={cyrcleToggleStyle} onMouseDown={handleDown}></div>
                    </div>
                    <div onClick={handleOpenDrop} className='_color-button'>OK</div>
                </div>
            }
        </div>
        
    )
});


export default React.memo(ColorPallet);