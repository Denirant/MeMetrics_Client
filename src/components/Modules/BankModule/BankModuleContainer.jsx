import React, {useEffect, useRef, useState} from 'react';

import AlfaIcon from '../../../assets/img/BankIcons/alfaBank.svg';
import TinkoffIcon from '../../../assets/img/BankIcons/logo-1.svg';
import SberIcon from '../../../assets/img/BankIcons/logo-2.svg';

import BankHeader from './BankHeader/BankHeader'

import './style.css'
import BankAnalytics from './BankBody/BankAnalytics/BankAnalytics';
import BankTable from './BankBody/BankTable/BankTable';


const transactions = [];

for (let i = 0; i < 200; i++) {
  const transaction = {
    name: `Transaction ${i + 1}`,
    date: getRandomDate(new Date(2023, 0, 1), new Date()),
    group: getRandomTransactionGroup(),
    amount: getRandomAmount(10, 1000),
    status: getRandomTransactionStatus(),
  };
  transactions.push(transaction);
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomTransactionGroup() {
  const transactionGroups = ['Groceries', 'Shopping', 'Dining', 'Entertainment', 'Utilities'];
  const randomIndex = Math.floor(Math.random() * transactionGroups.length);
  return transactionGroups[randomIndex];
}

function getRandomAmount(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function getRandomTransactionStatus() {
  const transactionStatuses = ['Pending', 'Completed', 'Failed'];
  const randomIndex = Math.floor(Math.random() * transactionStatuses.length);
  return transactionStatuses[randomIndex];
}

console.log(transactions);



function BankModuleContainer() {
    
    const headerRef = useRef(null);

	const [isDashboard, setIsDashboard] = useState(true);


	const handleIsDashboardChange = (newIsDashboard) => {
		setIsDashboard(newIsDashboard);
	  };
	


    const arrayMock = [
        {
            icon: AlfaIcon,
            color: '#FC6464',
        },
        {
            icon: TinkoffIcon,
            color: '#FFFD74',
        },
        {
            icon: SberIcon,
            color: '#E1FDDE',
        },
    ]

    return (    
        <div className='bank_container'>
            <BankHeader ref={headerRef} banksArray={arrayMock} onIsDashboardChange={handleIsDashboardChange} />
            {isDashboard && <BankAnalytics/>}
			{!isDashboard && <BankTable/>}
        </div>
    )
}

export default BankModuleContainer
