import React, { useState } from "react";
import './style.css'

import EditIcon from "../../assets/img/EditWorker.svg";
import SortIcon from "../../assets/img/sortWorker.svg";
import DeleteIcon from "../../assets/img/NavigationIcons/Delete.svg";
import dottedMenu from "../../assets/img/Navigation.svg";

import Dropdown from "../dropdownComponent/dropdown";

import showCustomConfirm from "../../utils/showCustomConfirm";
import { deleteWorker } from "../../actions/user";
import { useDispatch } from "react-redux";

const EmployeeTable = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  const handleSort = (column) => {
    if (column === sortBy) {
      // Если уже сортируем по этой колонке, меняем порядок сортировки
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Если выбрана новая колонка для сортировки, устанавливаем её и порядок 'asc'
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy) {
      const columnA = a[sortBy];
      const columnB = b[sortBy];

      if (sortOrder === "asc") {
        return columnA.localeCompare(columnB);
      } else {
        return columnB.localeCompare(columnA);
      }
    } else {
      return employees;
    }
  });

  const filteredAndSortedEmployees = sortedEmployees.filter((employee) => {
    const { name, surname, email, position, birthday } = employee;
    const searchTerms = [name, surname, email, position, birthday].map((item) =>
      item.toString().toLowerCase()
    );

    return searchTerms.some((term) => term.includes(searchTerm.toLowerCase()));
  });

  const dispatch = useDispatch();

  async function handleDeleteWorker(id) {
    const confirm = await showCustomConfirm(
      "Are you sure you want to delete the employee? This action cannot be canceled in the future!",
      "Delete",
      "Delete employee"
    );

    if (confirm) {
      dispatch(deleteWorker(id));
    }
  }

  return (
    <div className="employees"> 
      <div className="employees-input">
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && <button className="clear" onClick={() => setSearchTerm('')}></button>}
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name <img src={SortIcon} alt="desc sort" /></th>
            <th onClick={() => handleSort("position")}>Position <img src={SortIcon} alt="desc sort" /></th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedEmployees.map((employee, index) => (
            <tr key={index}>
              <td> <img src={`http://localhost:8080/${employee.image}`} alt="" /> {employee.name} {employee.surname}</td>
              <td>{employee.position}</td>
              <td>
              <Dropdown
                        imageUrl={dottedMenu}
                        dropContent={[
                          {
                            icon: DeleteIcon,
                            text: "Delete",
                            handler: () => handleDeleteWorker(employee.id),
                          },
                        ]}
                        width={"24px"}
                        height={"24px"}
                        dropClass={"file-menu"}
                      />
                      {console.log(employee)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
