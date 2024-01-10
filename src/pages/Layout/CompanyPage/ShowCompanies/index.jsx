import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";

import selectIcon from "../../../../assets/img/selectIcon.svg";
import plusIcon from "../../../../assets/img/NavigationIcons/Add.svg";

import AddCompany from "../AddCompany";
import dottedMenu from "../../../../assets/img/Navigation.svg";
import Dropdown from "../../../../components/dropdownComponent/dropdown";

import HorizontalCalendar from "../../../../components/Calendar/calendar";

import EditIcon from "../../../../assets/img/Edit.svg";
import DeleteIcon from "../../../../assets/img/NavigationIcons/Delete.svg";

import AmountStat from "../../../../components/AmountStat/AmountStat";

import LineGraph from "../../../../components/LineChart/LineGraph";
import { addCompany, clearCompanies, removeCompany } from "../../../../reducers/companyReducer";

import { API_URL } from "../../../../config";

import showCustomConfirm from "../../../../utils/showCustomConfirm";
import EditCompany from "../EditCompany";
import WeeklyDownloadsChart from "../../../../components/SmallLineChart";

const ShowCompanies = () => {
  //   const [companies, setCompanies] = useState([]);
  const [is_selected, setIs_Selected] = useState(false);

  const [companySearchValue, setCompanySearchValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies);

  console.log(companies);

  function handleCompanyChange(e) {
    setCompanySearchValue(e.target.value);
  }

  function handleSortInfo(e) {
    console.log("sort");
  }

  const { state } = useLocation(null);

  if (state && state.status === "update") {
    window.history.replaceState({}, document.title);
    window.location.reload();
  }

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const url = `https://memetricsserver.onrender.comapi/companies/list`;
        const { data: res } = await axios.get(url, {
          params: { id: localStorage.getItem("id") },
        });
        // setCompanies(res.data);

        dispatch(clearCompanies())

        for (let item of res.data) {
          dispatch(addCompany(item));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCompanies();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  function handleEdit(item){
    setEditId(isEditing ? null : item.id);
    setIsEditing(!isEditing);
  }

  const handleDelete = async (event) => {
    event.preventDefault();
    const checks = Array.from(document.querySelectorAll(".company_select"));
    if (checks.map((el) => el.checked).includes(true)) {
      try {
        // el  - любой элемент последовательности
        const data = checks.filter((el) => el.checked).map((el) => el.id);

        await Promise.all(
          data.map(async (id) => {
            const { data: res } = await axios.delete(
              `https://memetricsserver.onrender.comapi/companies/delete/`,
              { params: { userId: localStorage.getItem("id"), companyId: id } }
            );
          })
        );
      } catch (error) {
        console.log(error);
      }

      //   window.location.reload();
    } else {
      alert("Select some company...");
    }
  };

  async function handleDeleteSingle(companyObj) {
    try {
      const isDelete = await showCustomConfirm(
        "Are you sure you want to delete the company" + companyObj.name + "? This action is irreversible and will result in the deletion of all company-related data.",
        "Delete",
        "Delete company?"
      );

      if (isDelete) {
        const { data: res } = await axios.delete(
          `https://memetricsserver.onrender.comapi/companies/delete/`,
          { params: { userId: localStorage.getItem("id"), companyId: companyObj.id } }
        );

        dispatch(removeCompany(companyObj.id));
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleSelect = () => {
    if (
      Array.from(document.querySelectorAll(".company_select"))
        .map((el) => el.checked)
        .includes(true)
    ) {
      return setIs_Selected(true);
    }
    setIs_Selected(false);
  };

  function handleChangeAdding() {
    setIsAdding(!isAdding);
  }

  const hugeTitleStyle = {
    fontSize: "16px",
    lineHeight: "28px",
  };

  const hugeCurrentStyle = {
    fontSize: "28px",
    lineHeight: "32px",
    fontWeight: "600",
  };

  const hugePercentStyle = {
    fontSize: "14px",
    lineHeight: "20px",
  };

  const commonTitleStyle = {
    fontSize: "12px",
    lineHeight: "16px",
  };

  const commonCurrentStyle = {
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "400",
  };

  const commonPercentStyle = {
    fontSize: "10px",
    lineHeight: "20px",
  };

  const chartData = [9500, -2000, 3800, 4150, 15000, 13540, 16000].map(
    (el, index) => [index + 1, el]
  );
  const props = {
    data: chartData,
    smoothing: 1,
    strokeWidth: 5,
    hover: false,
  };

  return (
    <div className="companies_hub">
      <div className="companies_header">
        <div className="companies_header_search">
          <input
            className="companies_header_seract__input"
            placeholder="Search"
            type="text"
            onChange={handleCompanyChange}
            value={companySearchValue}
          />
          {companySearchValue && (
            <div
              className="companies_header_seract__clear"
              onClick={() => setCompanySearchValue("")}
            ></div>
          )}
        </div>
        <div className="companies_header_filter">
          <h2 className="companies_header_filter_title">Sort by:</h2>
          <ul className="companies_header_filter_list">
            <li
              className="companies_header_filter_list__item selected"
              onClick={handleSortInfo}
              id="none"
            >
              None
            </li>
            <li
              className="companies_header_filter_list__item"
              onClick={handleSortInfo}
              id="none"
            >
              Name
            </li>
            <li
              className="companies_header_filter_list__item"
              onClick={handleSortInfo}
              id="none"
            >
              Budget
            </li>
            <li
              className="companies_header_filter_list__item"
              onClick={handleSortInfo}
              id="none"
            >
              Date
            </li>
          </ul>
        </div>
        <div className="companies_header_control">
          <button className="companies_header_control_btn">
            <img src={selectIcon} alt="iconButton" />
          </button>
          <button
            className="companies_header_control_btn btn_blue"
            onClick={handleChangeAdding}
          >
            <img src={plusIcon} alt="iconButton" />
            Add company
          </button>
        </div>
      </div>
      <div className="companies_body">
        {companies.length > 0 ? (
        companies.map((el, index) => {
          if (index % 3 === 0) {
            return (
              <ul className="companies_body_list" key={index}>
                {companies.slice(index, index + 3).map((item, subIndex) => (
                  <li
                    className="companies_body_item"
                    key={`list_item_${subIndex}`}
                    style={{
                      boxShadow: `30px 80px 80px 10px rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.055) inset`,
                    }}
                  >
                    <div className="companies_body_item-header">
                      <h2 className="companies_body_item-header__title">
                        <img
                          width={64}
                          height={64}
                          src={API_URL + item.url}
                          alt="company_icon"
                        />
                        <span>
                          {console.log(item)}
                          {item.name}
                          <span>{item.description}</span>
                        </span>
                      </h2>
                      {/* <div className="companies_body_item-header--drop">
                            <button className="companies_body_item-header--drop_icon"></button>
                        </div> */}
                      <Dropdown
                        imageUrl={dottedMenu}
                        dropContent={[
                          {
                            icon: EditIcon,
                            text: "Edit",
                            handler: () => handleEdit(item),
                          },
                          {
                            icon: DeleteIcon,
                            text: "Delete",
                            handler: (e) => handleDeleteSingle(item),
                          },
                        ]}
                        width={"24px"}
                        height={"24px"}
                        dropClass={"file-menu"}
                      />
                    </div>
                    <div className="companies_body_item-analytic">
                      <div className="companies_body_item-analytic_balance">
                        <div className="companies_body_item-analytic_balance--stat">
                          <AmountStat
                            titleValue={"Net profit:"}
                            currentValue={9542}
                            prevValue={10050}
                            prefixValue={"$"}
                            imageHeight={20}
                            imageWidth={20}
                            titleStyle={hugeTitleStyle}
                            currentStyle={hugeCurrentStyle}
                            percentStyle={hugePercentStyle}
                          />
                        </div>
                        <div className="companies_body_item-analytic_balance--graph">
                          {/* <LineGraph
                            {...props}
                            accent={"#DB371F"}
                            fillBelow={"#ffb5b5"}
                          /> */}
                          <WeeklyDownloadsChart id={10} isDrop={false} isMenu={false}/>
                          {/* <LineGraph {...props} accent={'#2EBDAB'} fillBelow={'#71d1c4'} /> */}
                        </div>
                      </div>
                      <ul className="companies_body_item-analytic_list">
                        <li className="companies_body_item-analytic_list--item">
                          <AmountStat
                            titleValue={"Net profit:"}
                            currentValue={9542}
                            prevValue={8641}
                            prefixValue={"$"}
                            imageHeight={20}
                            imageWidth={20}
                            titleStyle={commonTitleStyle}
                            currentStyle={commonCurrentStyle}
                            percentStyle={commonPercentStyle}
                          />
                        </li>
                        <li className="companies_body_item-analytic_list--item">
                          <AmountStat
                            titleValue={"Net profit:"}
                            currentValue={9542}
                            prevValue={9620}
                            prefixValue={"$"}
                            imageHeight={20}
                            imageWidth={20}
                            titleStyle={commonTitleStyle}
                            currentStyle={commonCurrentStyle}
                            percentStyle={commonPercentStyle}
                          />
                        </li>
                        <li className="companies_body_item-analytic_list--item">
                          <AmountStat
                            titleValue={"Net profit:"}
                            currentValue={9542}
                            prevValue={8641}
                            prefixValue={"$"}
                            imageHeight={20}
                            imageWidth={20}
                            titleStyle={commonTitleStyle}
                            currentStyle={commonCurrentStyle}
                            percentStyle={commonPercentStyle}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className="companies_body_item-info">
                      <p className="companies_body_item-info_date">
                        08.09.2023
                      </p>
                      <a
                        href={`/company/${item.id}`}
                        className="companies_body_item-info_link"
                      >
                        Show more
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }
          return null;
        })
        ) : (
          <div className="empty_company">
            <p>You don't have any companies yet, you need to add <br /> a company to get started.</p>
            <div className="image_empty"></div>
          </div>
        )}
      </div>

      {isAdding && <AddCompany handleClose={() => handleChangeAdding()} />}
      {isEditing && <EditCompany handleClose={() => handleEdit()} companyId={editId} />}
    </div>
  );
};

export default ShowCompanies;
