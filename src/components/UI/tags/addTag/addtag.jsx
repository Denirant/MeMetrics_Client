import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './style.css';

// добавить ссылки на теги, по нажатию - переходим в вывод всех элементов по тегу
const AddTag = () => {

    const [value, setValue] = useState('');

    const params = useParams();

    const handleTagChange = (event) => {
        event.preventDefault();
        setValue(event.target.value);
    }

    const handlePress = async(event) => {
        // alert(event.key);
        if(event.key === 'Enter'){
            try{
                await axios.put(`https://memetricsserver.onrender.comproduct/${params.id}/tags/add`, {tag: value})
            }catch(error){
                console.log(error);
            }

            
            window.location.reload();
        }
    }

    return (
        <>
            <input 
                className='tag_add' 
                type="text" 
                placeholder='Add tag...' 
                name="tag_add" 
                value={value} 
                id="tag_add"  
                onChange={handleTagChange}
                onKeyPress={handlePress}
            />
        </>
    )
}

export default AddTag;