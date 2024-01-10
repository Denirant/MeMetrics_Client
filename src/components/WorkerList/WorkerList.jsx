import React, { useState } from 'react';
import './worker.css'; // Подключаем файл со стилями

const users = [
  {
    id: 1,
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
    name: 'John Doe',
    active: true,
    position: 'Developer',
    lastActive: '2021-09-15 10:30',
  },
  {
    id: 2,
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
    name: 'Jane Smith',
    active: false,
    position: 'Designer',
    lastActive: '2021-09-14 15:45',
  },
  {
    id: 3,
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
    name: 'Jane Smith',
    active: false,
    position: 'Designer',
    lastActive: '2021-09-14 15:45',
  },
  {
    id: 4,
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
    name: 'Jane Smith',
    active: false,
    position: 'Designer',
    lastActive: '2021-09-14 15:45',
  },
  {
    id: 5,
    photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
    name: 'Jane Smith',
    active: false,
    position: 'Designer',
    lastActive: '2021-09-14 15:45',
  },
  // Добавьте других пользователей по аналогии
];

const NameList = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // setCurrentPage(1);
  };

  const handleBackClick = async () => {
    await setSelectedUser(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = async (page) => {
    await setCurrentPage(page);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.startsWith(search) || name.includes(` ${search}`);
  });

  const totalPages = Math.ceil(filteredUsers.length / 3);
  const startIndex = (currentPage - 1) * 3;
  const endIndex = startIndex + 3;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="container">
      {!selectedUser && (
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      )}
      {!selectedUser ? (
        <>
          <ul className="user-list">
            {paginatedUsers.map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user)}>
                <img src={user.photo} alt={user.name} />
                <div>
                  <h3>{user.name}</h3>
                  <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                  <p>{user.position}</p>
                  <p>Last active: {user.lastActive}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className={`page ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="card">
          <button className='back_btn' onClick={handleBackClick}></button>

          <div className='card_content'>
            <div className='card_image'>
              <img src={selectedUser.photo} alt={selectedUser.name} />
              <span className={`status ${selectedUser.active ? 'active' : 'inactive'}`}>
                {/* {selectedUser.active ? 'Active' : 'Inactive'} */}
              </span>
            </div>
            
            <div className='card_info'>
              <h2>{selectedUser.name}</h2>
              <p>{selectedUser.position}</p>
            </div>
          </div>

          
          
          
          {/* <p>Last active: {selectedUser.lastActive}</p> */}
        </div>
      )}
    </div>
  );
};

export default NameList;
