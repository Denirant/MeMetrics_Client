import './style.css';
import AddTag from './addTag/addtag';
import { useParams } from 'react-router-dom';
import axios from 'axios';


// добавить ссылки на теги, по нажатию - переходим в вывод всех элементов по тегу
const Tags = ({list}) => {

    const params = useParams();

    const handleTagDelete = async(event) => {
        event.preventDefault();

        try {
            await axios.delete(`https://memetricsserver.onrender.comproduct/${params.id}/tag/${event.currentTarget.parentNode.innerText}/remove`);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ul className="tags_list">
            {list.map((element, index) => {
                return (
                    <li key={`tag_${index}`} className='tags_item'>
                        {element[0].toUpperCase() + element.slice(1)}
                        <div className='tag_delete' onClick={handleTagDelete}></div>    
                    </li>
                )
            })}

            {list.length <= 10 && <AddTag/>}
        </ul>   
    )
}

export default Tags;