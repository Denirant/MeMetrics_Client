import React, { useEffect, useState } from "react";
import Dropdown from "../dropdownComponent/dropdown";
import dottedMenu from "../../assets/img/Navigation.svg";

import EditIcon from "../../assets/img/EditWorker.svg";
import TaskIcon from "../../assets/img/taskWorker.svg";
import MessengerIcon from "../../assets/img/MessengerWorker.svg";
import sortIcon from "../../assets/img/sortWorker.svg";

import DeleteIcon from "../../assets/img/NavigationIcons/Delete.svg";

import "./index.css";
import showCustomConfirm from "../../utils/showCustomConfirm";
import { useDispatch } from "react-redux";
import { deleteWorker } from "../../actions/user";


function filterDataByQuery(data, searchQuery){
  const filteredData = searchQuery
  ? data
      .map((el, index) => {
        return {
          id: index,
          name: el.name + " " + el.surname,
          email: el.email,
          company: el.company,
          position: el.position,
          status: (new Date() - new Date(el.lastOnline) <= 60000) ? 'Active' : 'Inactive',
          image: el.image,
          native: el,
          selected: false,
        };
      })
      .filter(
        (user) =>
          user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user?.position
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user?.status?.toLowerCase().includes(searchQuery.toLowerCase())
      ).filter((el) => el.position !== "CEO")
  : data
      .map((el, index) => {
        return {
          id: index,
          name: el.name + " " + el.surname,
          email: el.email,
          company: el.company,
          position: el.position,
          status: (new Date() - new Date(el.lastOnline) <= 60000) ? 'Active' : 'Inactive',
          image: el.image,
          native: el,
          selected: false,
        };
      })
      .filter((el) => el.position !== "CEO");

    return filteredData;
}

const SelectTableComponent = ({ onSelect, data, handleEdit, searchQuery }) => {
  const [list, setList] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [masterChecked, setMasterChecked] = useState(false);
  const [selectedList, setSelectedList] = useState([]);

  console.log(data)

  useEffect(() => {
    setList(filterDataByQuery(data, searchQuery));
  }, [data, searchQuery]);

  const onMasterCheck = (e) => {
    const tempList = list.map((user) => ({
      ...user,
      selected: e.target.checked,
    }));

    setMasterChecked(e.target.checked);
    setList(tempList);
    setSelectedList(tempList.filter((e) => e.selected));

    onSelect(tempList.filter((e) => e.selected));
  };

  const onItemCheck = (e, item) => {
    const tempList = list.map((user) => {
      if (user.id === item.id) {
        return { ...user, selected: e.target.checked };
      }
      return user;
    });

    const totalItems = list.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;

    setMasterChecked(totalItems === totalCheckedItems);
    setList(tempList);
    setSelectedList(tempList.filter((e) => e.selected));

    onSelect(tempList.filter((e) => e.selected));
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    const compareFunction = (a, b) => {
      const compareStrings = (strA, strB) => {
        return sortOrder === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      };

      switch (sortColumn) {
        case "name":
          return compareStrings(a.name, b.name);
        case "email":
          return compareStrings(a.email, b.email);
        case "company":
          return compareStrings(a.company, b.company);
        case "position":
          return compareStrings(a.position, b.position);
        case "status":
          return compareStrings(a.status, b.status);
          case "department":
            return compareStrings(a.native.department, b.native.department);
        default:
          return 0;
      }
    };

    return list.slice().sort(compareFunction);
  };

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
    <div className="container worker_table">
      <div className="row">
        <div className="col-md-12">
          {list.length === 0 ? (
            <p className="empty_table-message">
              {searchQuery
                ? "Nothing found. Please, try something else"
                : "No employee yet! Add some and see info"}
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">
                    <label className="checkmark-table-container">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={masterChecked}
                        id="mastercheck"
                        onChange={(e) => onMasterCheck(e)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </th>
                  <th scope="col" onClick={() => handleSort("name")}>
                    Name <img src={sortIcon} alt="sort_icon" />
                  </th>
                  <th scope="col" onClick={() => handleSort("email")}>
                    Email <img src={sortIcon} alt="sort_icon" />
                  </th>
                  <th scope="col" onClick={() => handleSort("company")}>
                    Company <img src={sortIcon} alt="sort_icon" />
                  </th>
                  <th scope="col" onClick={() => handleSort("position")}>
                    Position <img src={sortIcon} alt="sort_icon" />
                  </th>
                  <th scope="col" onClick={() => handleSort("department")}>
                    Department <img src={sortIcon} alt="sort_icon" />
                  </th>
                  <th scope="col" onClick={() => handleSort("status")}>
                    Status <img src={sortIcon} alt="sort_icon" />
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().map((user) => (
                  <tr key={user.id} className={user.selected ? "selected" : ""}>
                    <th scope="row">
                      <label className="checkmark-table-container">
                        <input
                          type="checkbox"
                          checked={user.selected}
                          className="form-check-input"
                          id={`rowcheck${user.id}`}
                          onChange={(e) => onItemCheck(e, user)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </th>
                    <td>
                      <img
                        src={`http://localhost:8080/${user.image}`}
                        alt="icon-worker"
                      />
                      {user.name}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.company}</td>
                    <td>{user.position}</td>
                    <td>{user.native.department}</td>
                    {console.log(user)}
                    <td>
                      <span
                        className={`status_indicator ${
                          user.status.toLocaleLowerCase() === "active"
                            ? "active"
                            : "offline"
                        }`}
                      ></span>
                      {user.status.toLocaleLowerCase() === "active"
                        ? "Active"
                        : "Offline"}
                    </td>
                    <td>
                      <Dropdown
                        imageUrl={dottedMenu}
                        dropContent={[
                          {
                            icon: EditIcon,
                            text: "Edit",
                            handler: () => handleEdit(user.native),
                          },
                          {
                            icon: MessengerIcon,
                            text: "Send message",
                            handler: () => alert(1),
                          },
                          {
                            icon: TaskIcon,
                            text: "Create task",
                            handler: () => alert(1),
                          },
                          {
                            icon: DeleteIcon,
                            text: "Delete",
                            handler: () => handleDeleteWorker(user.native.id),
                          },
                        ]}
                        width={"24px"}
                        height={"24px"}
                        dropClass={"file-menu"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectTableComponent;
