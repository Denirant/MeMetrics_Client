import InputPickerComp from "../InputPicker/picker";
import RadioPicker from "../Radio/radio";
import CheckboxPicker from "../checkBoxSelector";
import { useState, useRef } from "react";

import { IconButton } from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';

import './style.css'
import axios from "axios";
import MarketSelector from '../ShopSelector/shopSelector';

import {useToaster, Notification} from 'rsuite';

const paramsArray = ['Price', 'Review', 'Comments'];
const types = [
    {
        value: 'Lines',
        disabled: false
    },
    {
        value: 'Radial',
        disabled: true
    },
    {
        value: 'Bullet',
        disabled: true
    },
    {
        value: 'Bubbles',
        disabled: true
    },
    {
        value: 'Flower',
        disabled: true
    },
]


const AddChart = ({onClose}) => {


    const [brand, setBrand] = useState('');
    const [nomination, setNomination] = useState('');
    const [shops, setShops] = useState([]);
    const [params, setParams] = useState([paramsArray[0]]);
    const [type, setType] = useState('Lines');


    const inputEls = useRef([]);

    const toaster = useToaster();



    const message = (type, header, message) => (
        <Notification type={type} header={header} closable>
            <hr />
            <p>{message}</p>
        </Notification>
    );




    async function searchShops(brand, nomination){
        try{
            const {data: res} = await axios.post('http://localhost:8080/charts/lineChart/get/shops', {nomination: nomination, brand: brand, email: localStorage.getItem('email')})

            setShops(res.array)
        }catch(error){
            console.log(error);
        }
    }


    function handleBrand(event){
        setBrand(event);
        console.log(event);
    }

    function handleNomination(event){
        setNomination(event);

        searchShops(brand, event);
    }

    async function handleRadio(event){
        await setType(event);
    }

    async function handleCheck(value){
        await setParams(value);   
    }



    async function addOnClick(index){
        let item = inputEls.current[index]
        
        try{
            console.log(item.getName().shop);
        }catch(error){
            console.log(error);
        }
    }

    async function handleChartAdd(event){
        event.preventDefault();

        try{

            const data = {
                brand: brand,
                nomination: nomination,
                params: params,
                type: type,
                markets: inputEls.current.filter((element) => element.getStatus()).map((element) => element.getName().shop + ' ' + element.getName().color)
            }

            const {data: res} = await axios.post('http://localhost:8080/charts/lineChart/add', data);

            toaster.push(
                message(res.message.status, res.message.title, res.message.text), 
                {
                    placement: 'topEnd',
                    duration: 4500
                }
            );

            toaster.push(
                message('warning', res.message.title, res.message.text), 
                {
                    placement: 'topEnd',
                    duration: 4500
                }
            );

            toaster.push(
                message('error', res.message.title, res.message.text), 
                {
                    placement: 'topEnd',
                    duration: 4500
                }
            );

            toaster.push(
                message('info', res.message.title, res.message.text), 
                {
                    placement: 'topEnd',
                    duration: 4500
                }
            );

            onClose(event);

        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="_chart-wrapper">
            <div className="_chart-add-form">
                <div className="_close-btn" onClick={onClose}></div>
                <div className="_chart-add-header">
                    <div className="_chart-add-inuts">
                        <InputPickerComp placeholder={'Select brand'} handler={handleBrand} inputWidth={'100%'} search={{type: 'brand', value: ''}}/>
                        <InputPickerComp placeholder={'Select nomination'} disabled={(brand.length > 0 ? false : true)} handler={handleNomination} inputWidth={'100%'} search={{type: 'nomination', value: ''}}/>

                        <div className="_chart-add-radio">
                            <RadioPicker handleChange={handleRadio} text={'Chart type'} data={types}/>
                        </div>
                    </div>

                    <div className="_chart-add-controls">
                        <CheckboxPicker valueChange={handleCheck} array={paramsArray}/>
                    </div>
                </div>

                {shops.length > 0 && <div className="_chart-add-suggetions">
                    <h2 className="_chart-add-subtitle">List of shops</h2>
                    <ul className="_chart-add-list">
                        {shops.map((element, index) => 
                            <MarketSelector 
                                ref={(el) => (inputEls.current[index] = el)}
                                handler={addOnClick} 
                                index={index} 
                                key={`shop_${index}`}
                                text={element.shop}
                            />
                        )}
                    </ul>
                </div>}
                
                <div className="_chart-add-button">
                    <IconButton onClick={handleChartAdd} icon={<PlusIcon />} href={'#'} disabled={shops.length > 0 ? false : true} appearance="primary">Add</IconButton>
                </div>

            </div>
        </div>
    )
}

export default AddChart;