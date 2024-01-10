import React from 'react';
import { Table } from 'react-bootstrap';

const UserTable = () => {
  const users = [
    
  ];

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Фото</th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Должность</th>
          <th>Рейтинг</th>
          <th>Почта</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{/* Фото пользователя */}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.position}</td>
            <td>{user.rating}</td>
            <td>{user.email}</td>
            <td>{user.online ? 'Онлайн' : 'Офлайн'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;