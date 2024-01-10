import './style.css'
import React from "react";
import ShowCompanies from './ShowCompanies'; 
import AddCompany from './AddCompany';
import CompanyInfo from './CompanyInfo';

import { Outlet } from "react-router-dom";


const CompanyPage = () => {
    return(
        <div className="main">
            <Outlet/>
        </div>
    );
}

export {
    CompanyPage, 
    ShowCompanies, 
    AddCompany,
    CompanyInfo
};