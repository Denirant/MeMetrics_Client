import React, { useRef, useState } from "react";
import "./style.css";

import * as XLSX from "xlsx";

import { Chart, getElementAtEvent } from "react-chartjs-2";
import Lines from "../../../BankComponents/Lines";

import Download from "../../../../../assets/img/DropDown/Download.svg";
import Filter from "../../../../../assets/img/filterOff.svg";

import transactions from "../../../../../utils/transactions";

import arrowicon from "../../../../../assets/img/StatInfo/Arrow down.svg";

function BankTable({ dataProp }) {
  const chartRef = useRef();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  dataProp = [
    {
      size: 32,
      color: "#f7d202",
      name: "Spending",
    },
    {
      size: 68,
      color: "#2EBDAB",
      name: "Admission",
    },
  ];

  const state = {
    datasets: [
      {
        data: dataProp.map((el) => el.size),
        backgroundColor: dataProp.map((el) => el.color),
        offset: 0,
        borderRadius: 20,
        borderWidth: 8,
        hoverBorderWidth: 4,
        borderColor: "#F9FAFB",
        hoverBorderColor: "#F9FAFB",
      },
    ],
  };

  const options = {
    cutout: 55,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    onHover: (event, activeElements) => {
      const chartContainer = document.querySelector(".chart_container");
      if (activeElements && activeElements.length > 0) {
        setHoveredSegment(activeElements[0].index);
        chartContainer.children[0].style.cursor = "pointer";
      } else {
        setHoveredSegment(null);
        chartContainer.children[0].style.cursor = "default";
      }
    },
  };

  const segmentBackgroundColors = state.datasets[0].backgroundColor.map(
    (color, index) => {
      if (hoveredSegment === null || hoveredSegment === index) {
        return color;
      } else {
        return `${color}80`;
      }
    }
  );

  const stateWithBackgroundColors = {
    ...state,
    datasets: [
      {
        ...state.datasets[0],
        backgroundColor: segmentBackgroundColors,
      },
    ],
  };

  function handleDownload() {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "TransactionHistory.xlsx";
    link.click();
  }




  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const handleCheckboxChange = (transaction) => {
    setSelectedTransactions((prevSelectedTransactions) =>
      prevSelectedTransactions.includes(transaction)
        ? prevSelectedTransactions.filter((selectedTransaction) => selectedTransaction !== transaction)
        : [...prevSelectedTransactions, transaction]
    );
  };
  
  const handleSelectAll = () => {
    setSelectedTransactions((prevSelectedTransactions) =>
      prevSelectedTransactions.length === transactions.length
        ? [] // Если все уже были выбраны, снимаем выделение
        : [...transactions] // Иначе выбираем все элементы
    );
  };
  

  function handleAssign(){
    console.log(selectedTransactions);
  }

  return (
    <div className="bank_body">
      <div className="bank_body-table">
        <div className="bank_body-header-control">
          <div className="bank_body-header-search">
            <input placeholder="Search" type="text" />
            <button>
              {" "}
              <img src={Filter} alt="search_icon" />
            </button>
          </div>
          {selectedTransactions.length > 0 && <div onClick={handleAssign} className="bank_body-header-assign">
            Assign a category
          </div>}
          <div onClick={handleDownload} className="bank_body-header-download">
            <img src={Download} alt="search_icon" /> Download
          </div>
        </div>
        <div className="scrollable-container">
          <table>
            <thead>
              <tr>
                <th className="header_select">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === transactions.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Date</th>
                <th>Category</th>
                <th>Values</th>
                <th>Status</th>
              </tr>
            </thead>
          </table>
          <div className="table-body">
            <table>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction)}
                        onChange={() => handleCheckboxChange(transaction)}
                      />
                    </td>
                    <td>{transaction.name}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.category}</td>
                    <td>{transaction.values}</td>
                    <td>
                      <span
                        style={{
                          color:
                            transaction.status === "success"
                              ? "green"
                              : transaction.status === "in progress"
                              ? "yellow"
                              : transaction.status === "error"
                              ? "red"
                              : "black", // Здесь можно установить цвет по умолчанию
                        }}
                      >
                        <span></span>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bank_body-info">
        <div className="doughnut-chart">
          <h1 className="bank_body-header">Result of operations</h1>
          <div className="chart_row">
            <div
              className="chart_container"
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <Chart
                ref={chartRef}
                data={stateWithBackgroundColors}
                options={options}
                type={"doughnut"}
              />
              <div className="disk_analytics">
                {hoveredSegment === null ? (
                  <div className="disk_analytics--unhover">
                    <p className="disk_analytics_title">Total</p>
                    <h2 className="disk_analytics_space">+220 млн</h2>
                  </div>
                ) : (
                  <div className="disk_analytics--hover">
                    <p className="disk_analytics_all">
                      {dataProp[hoveredSegment].name}
                    </p>
                    <h2 className="disk_analytics_space">
                      {dataProp[hoveredSegment].name === "Spending"
                        ? "-50 млн"
                        : "+180 млн"}
                    </h2>
                  </div>
                )}
              </div>
            </div>
            <div className="chart_inspect">
              <h1>Total spending</h1>
              <p>$20,456</p>
              <ul>
                {dataProp.map((el, index) => (
                  <li>
                    <span
                      className="dot_container"
                      style={{ backgroundColor: el.color }}
                    >
                      <span
                        className="dot_inner"
                        style={{ backgroundColor: el.color }}
                      ></span>
                    </span>
                    <p>{el.name}</p>

                    <span>
                      <img src={arrowicon} alt="arrow_icon" /> 80%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="history-lines">
          <div className="categorty_title">
            <h1 className="bank_body-header">Spending categories</h1>
            <div className="add_category"></div>
          </div>
          <Lines
            dataArray={[
              {
                name: "Markering",
                value: 45,
                color: "#6B2FE0",
              },
              {
                name: "Salaries",
                value: 78,
                color: "#FFA41B",
              },
              {
                name: "Purchases",
                value: 60,
                color: "#ee6b6e",
              },
              {
                name: "Taxes",
                value: 130,
                color: "#31f207",
              },
              {
                name: "Other",
                value: 240,
                color: "#f7d202",
              },
              {
                name: "Other",
                value: 240,
                color: "#f7d202",
              },
              {
                name: "Other",
                value: 240,
                color: "#f7d202",
              },
              {
                name: "Other",
                value: 240,
                color: "#f7d202",
              },
              {
                name: "Other",
                value: 240,
                color: "#f7d202",
              },
              {
                name: "Other",
                value: 240,
                color: "#f7d202",
              },
            ]}
            withoutTitle={true}
          />
        </div>
      </div>
    </div>
  );
}

export default BankTable;

// В чарте за указанную дату

// Выбор 1 и более счетов
// Попап
