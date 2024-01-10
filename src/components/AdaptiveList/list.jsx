import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './index.css'; // Подключаем файл стилей
import axios from 'axios';

const ListItem = ({ id, name, surname, icon, isOnline, title, isSelected, isHidden, onClick, onClose}) => {
  return (
    <div
      className={`list-item ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden' : ''}`}
      onClick={() => onClick((isSelected) ? null : id)}
    >
        {
            !isHidden && 
            <div className='list-item-content'>
              {isSelected && <button onClick={() => onClose()}>Close</button>}
                <div className={`image-container ${isOnline ? '__active' : '__inactive'}`}>
                  <img src={icon} alt={name} />
                </div>
                <div className='text-caonainer'>
                  <h3>{name} {surname}</h3>
                  <p>{title}</p>
                </div>
            </div>
        }
    </div>
  );
};


const List = () => {


  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const listRef = useRef(null);

  const [data, setData] = useState(null);

  const params = useParams();
  const location = useLocation()

  const toggleUpdate = async (event, obj) => {

    if(data !== null){
      await setData(null);
    }else{
      await setData(obj);
    }

    await getWorkers();  
  }

  const handleDelete = async(event, id) => {
    try{
      const url = `https://memetricsserver.onrender.comapi/workers/`;
      await axios.delete(url, {params: {id: id}});
    }catch(error){
      console.log(error);
    }

    await getWorkers();
  }

  const getWorkers = async() => {
    try{
        const company = params.id;
        console.log(company);

        const url = `https://memetricsserver.onrender.comapi/workers/companyList`;
        const {data: res} = await axios.get(url, {params: {headId: localStorage.getItem('id'), companyId: company}});

        console.log(res.array)

        setUsers(res.array);
    }catch(error){
        console.log(error);
    }
  }

  useEffect(() => {
      getWorkers()

      const interval = setInterval(() => {
        getWorkers();
      }, 60000);
  
      return () => {
        clearInterval(interval);
      };

    }, [location.key])


  const handleItemClick = (id) => {

    if(id !== null){
        setSelectedId(id)
    }
    
  };

  const handleClose = () => {
    const element = listRef.current.querySelector('.selected');


    setTimeout(() => {
        element.scrollIntoView({behavior: 'auto'});
    }, 0);

    setSelectedId(null);
  }

  return (
    <div className='employee-container'>
        <h1>Worker list</h1>
        <div className="list-container">
            <div className="list" ref={listRef}>
                {users && users.map((user, index) => {
                if (selectedId !== null && selectedId !== index) {
                    return (
                        <ListItem
                          key={index}
                          id={index}
                          icon={user.photo}
                          name={user.name}
                          surname={user.surname}
                          title={user.title}
                          isOnline={(new Date() - new Date(user.lastOnline) <= 60000) ? true : false}
                          isSelected={selectedId === index}
                          isHidden={true}
                          onClick={handleItemClick}
                          onClose={handleClose}
                        />
                    );
                }
                return (
                    <ListItem
                      key={index}
                      id={index}
                      icon={user.photo}
                      name={user.name}
                      surname={user.surname}
                      title={user.title}
                      isOnline={(new Date() - new Date(user.lastOnline) <= 60000) ? true : false}
                      isSelected={selectedId === index}
                      onClick={handleItemClick}
                      onClose={handleClose}
                    />
                );
                })}
            </div>
        </div>
    </div>
  );
};

export default List;