import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Selector from "../Selector/selector_comp";
import { Store } from "react-notifications-component";

const MatrixCharts = ({id, name, brand, unit}) => {
    const [items, setItems] = useState([]);

    const inputEls = useRef([]);

    function showNotification(title, message){
        Store.addNotification({
            title: title,
            message: message,
            type: "success",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        });
    }

    async function addOnClick(index){
        let item = inputEls.current[index]

        try{
            let action; 

            if(item.getStatus()){
                // Handle add item
                action = 'add';
            }else{
                // Handle remove item
                action = 'remove';
            }

            item = item.getName();

            const {data: res} = await axios.post(`http://localhost:8080/product/${id}/suggetions/${action}`, item)

            console.log(res.message);

            showNotification(res.message);

        }catch(error){
            console.log(error);
        }
    }

    async function searchItems(){
        try{
            const {data: res} = await axios.post(`http://localhost:8080/product/${id}/find/suggetions`, { name: name, brand: brand });

            console.log(res)

            setItems(res.array);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        searchItems()
    }, [])

    


    return (
        <div>
            <ul className="selector_list" style={{ maxHeight: '60vh', overflowY: 'auto'}}>
                {items && items.map((element, index) => <Selector ref={(el) => (inputEls.current[index] = el)} handleAdd={addOnClick} index={index} key={`shop_${index}`} fromStatus={element.status} name={element.name} brand={element.brand} from={element.shop} price={element.price}/>)}    
            </ul>
            {/* <button onClick={handleAddButton} style={{margin: '0 auto', display: 'block'}} type="button">Update</button> */}
        </div>
    )
}


export default MatrixCharts;