import React, { useState, useEffect } from "react";

import ArrowUp from "../../../../../assets/img/Arrow-up.svg";
// import StackedBar from "./StackGraphD3";

import USA from "../../../../../assets/img/CountyRate/USA.svg";
import EU from "../../../../../assets/img/CountyRate/EU.svg";
import China from "../../../../../assets/img/CountyRate/China.svg";
import London from "../../../../../assets/img/CountyRate/London.svg";

import CustomLineChart from "../../../BankComponents/CustomLineChart";
import BarChart from "../../../BankComponents/BarChart";
import HeatmapCalendar from "../../../BankComponents/TemperatureMap";
import Lines from "../../../BankComponents/Lines";

import mockData from "../../../../../utils/LineChartMock";
import mockData2 from "../../../../../utils/LineChartMock2";

import withTooltip from '../../../../../components/barChartGroup'

import LineChart from "../../../../../pages/Layout/CompanyPage/CompanyInfo/lineChart";

import ChartStacked from "./StackChart/StackChart";
import axios from "axios";

import AMD from '../../../../../assets/img/Currency/AMD.svg';
import ARS from '../../../../../assets/img/Currency/ARS.svg';
import BYN from '../../../../../assets/img/Currency/BYN.svg';
import CAD from '../../../../../assets/img/Currency/CAD.svg';
import CHF from '../../../../../assets/img/Currency/CHF.svg';
import CNY from '../../../../../assets/img/Currency/CNY.svg';
import EUR from '../../../../../assets/img/Currency/EUR.svg';
import GBR from '../../../../../assets/img/Currency/GBR.svg';
import GEL from '../../../../../assets/img/Currency/GEL.svg';
import ILS from '../../../../../assets/img/Currency/ILS.svg';
import JPY from '../../../../../assets/img/Currency/JPY.svg';
import KGS from '../../../../../assets/img/Currency/KGS.svg';
import KZT from '../../../../../assets/img/Currency/KZT.svg';
import LE from '../../../../../assets/img/Currency/LE.svg';
import LEU from '../../../../../assets/img/Currency/LEU.svg';
import RUB from '../../../../../assets/img/Currency/RUB.svg';
import TJS from '../../../../../assets/img/Currency/TJS.svg';
import TRY from '../../../../../assets/img/Currency/TRY.svg';
import UAE from '../../../../../assets/img/Currency/UAE.svg';
import USD from '../../../../../assets/img/Currency/USD.svg';
import UZS from '../../../../../assets/img/Currency/UZS.svg';


function ListItem({ label, isActive, toggleActive, contentList }) {
  const itemClass = isActive ? "active" : "";

  return (
    <div className={`list-item ${itemClass}`}>
      <div className="list-item_header" onClick={toggleActive}>
        <span>{label}</span>
        <img src={ArrowUp} alt="check-arrow" />
      </div>
      <div className="list-item_control">
        <div className={`list-item_search ${itemClass}`}>
          <input type="text" placeholder="Search..." />
        </div>
        <div className="list-item_info">
          <span>Currency</span>
          <span>Rate</span>
        </div>
      </div>
      <ul className="list-item_list">
        {contentList.map((el) => (
          <li className="list-item_list--element">
            <img
              src={el.logo}
              className="list-item_list--element__image"
              alt="icon"
            />
            <p className="list-item_list--element__title">{el.name}</p>
            <div className="list-item_list--element__rate">
              <span className="list-item_list--element__current">
                {el.rate}
              </span>
              <span className="list-item_list--element__prev">{el.prev}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


function BankAnalytics() {
  const DataMockDiag = [
    { name: "Пн", value: 30 },
    { name: "Вт", value: 20 },
    { name: "Ср", value: 70 },
    { name: "Чт", value: 25 },
    { name: "Пт", value: 23 },
    { name: "Сб", value: 42 },
    { name: "Вс", value: 12 },
  ];

  const currencyObj = {
    'AMD': AMD,
    'ARS': ARS,
    'BYN': BYN,
    'CAD': CAD,
    'CHF': CHF,
    'CNY': CNY,
    'EUR': EUR,
    'GBR': GBR,
    'GEL': GEL,
    'ILS': ILS,
    'JPY': JPY,
    'KGS': KGS,
    'KZT': KZT,
    'LE': LE,
    'LEU': LEU,
    'RUB': RUB,
    'TJS': TJS,
    'TRY': TRY,
    'UAE': UAE,
    'USD': USD,
    'UZS': UZS,
  }

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isIncome, setIsIncome] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Year");

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  function handleIncomeChange() {
    setIsIncome(!isIncome);
  }

  const toggleItem = (index) => {
    if (activeIndex === index) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(index);
    }
  };

  const [arrayList, setExchangeData] = useState(null);

  const generateExchangeObject = (exchangeRates) => {
    const exchangeArray = Object.entries(exchangeRates).map(([name, rate]) => ({
      logo: China,
      name: name,
      rate: `${(rate).toFixed(2)} ₽`,
      prev: 0,
    })).filter((el => Object.keys(currencyObj).includes(el.name))).map(el => {
      return {
        ...el,
        logo: currencyObj[el.name],
      }
    });

    console.log(exchangeArray)
  
    return [
      {
        name: "Exchange rate",
        array: exchangeArray,
      },
      {
        name: "Crypto rate",
        array: exchangeArray,
      }
    ];
  };


  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(
          `https://open.er-api.com/v6/latest/RUB`
        );
        
          const rubleExchangeRates = {};

          for (const currency in response.data.rates) {
            const rublePrice = 1 / response.data.rates[currency];
            rubleExchangeRates[currency] = rublePrice;
          }

        setExchangeData(generateExchangeObject(rubleExchangeRates));
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchData();

  }, []);



  function generateRandomData(daysCount, maxValuesCount) {
    function generateRandomValues() {
      const valuesCount = Math.floor(Math.random() * (maxValuesCount - 4)) + 5; // Генерируем случайное количество элементов от 5 до maxValuesCount
      const values = [];
      for (let i = 0; i < valuesCount; i++) {
        values.push(Math.floor(Math.random() * 20000)); // Генерируем случайные значения от 0 до 20000
      }
      return values;
    }

    const data = [];
    const uniqueDays = new Set(); // Создаем множество для уникальных дней
    while (data.length < daysCount) {
      const day = Math.floor(Math.random() * 30) + 1; // Генерируем случайный день от 1 до 30
      const month = 12; // Фиксируем месяц сентябрь
      const year = 2023; // Фиксируем год 2023
      const date = `${day.toString().padStart(2, "0")}.${month
        .toString()
        .padStart(2, "0")}.${year}`;

      // Проверяем, что день уникален
      if (!uniqueDays.has(date)) {
        const values = generateRandomValues();
        data.push({ date, values });
        uniqueDays.add(date); // Добавляем день в множество уникальных дней
      }
    }

    return data;
  }

  return (
    <div className="bank_body-analytic">
      <div className="bank_body-analytic--content">
        <div className="row">
          <div className="lineChart">
           
            <div className="dashboard_line_header">
              <h1 className="dashboard_line_header-title">Statistics income and outgoing</h1>
              <div className="dashboard_line_header-change">

              </div>
              <div className="dashboard_line_header-view"></div>
            </div>
            <LineChart/>
          </div>
        </div>
        <div className="row">
          <div>
            <div className="category_bar">
              <h1 className="category_bar-total">Total spend by Category </h1>
              <div className="category_bar-settings"></div>
            </div>
            <ChartStacked/>
          </div>
          <div>
            <HeatmapCalendar dataProp={generateRandomData(20, 30)} />
          </div>
        </div>
      </div>
      <div className="bank_body-analytic--rate">
        <div className="list">
          {arrayList && arrayList.map((el, index) => (
            <ListItem
              key={index}
              label={el.name}
              isActive={activeIndex === index}
              toggleActive={() => toggleItem(index)}
              contentList={el.array}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BankAnalytics;

// Пытаемся по выборке взять 2 недели - 2 месяца. Чем меньше общее количество дней - тем больше данных в процентном соотношении берем.

// 2 недели - 60%
// 1 месяц - 50%
// 1.5 месяц - 40%
// 2 месяц - 30%

// (на начало - 7 дней)

// Вообще нет данных - анализируем актуальные

// 8 оттенков

// 50 000 - 4 800 000
