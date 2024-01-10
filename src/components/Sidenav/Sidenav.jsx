import React, {useState, useEffect} from 'react';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import PlusIcon from '@rsuite/icons/Plus';
import GroupIcon from '@rsuite/icons/legacy/Group';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import CreditCardPlusIcon from '@rsuite/icons/CreditCardPlus';
import ListIcon from '@rsuite/icons/List';
import TreemapIcon from '@rsuite/icons/Treemap';
import axios from 'axios';
import Exit from '@rsuite/icons/Exit';
import Plus from '@rsuite/icons/Plus';
import StorageIcon from '@rsuite/icons/Storage';

import { Link } from 'react-router-dom';

import './index.css'

const NavLink = React.forwardRef(({ href, children, ...rest }, ref) => {
    return (
        <Link ref={ref} to={href} {...rest}>
            {children}
        </Link>
    )
});

export default function SideNavigation({activeNumber}) {
    const [activeKey, setActiveKey] = useState(String(activeNumber));
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const getCompanies = async() => {
            try{
                const url = `http://localhost:8080/api/companies/list`;
                const {data: res} = await axios.get(url, {params: {id: localStorage.getItem('id')}});
                setCompanies(res.data);
            }catch(error){
                console.log(error);
            }
        }

        getCompanies()
    }, [])

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location = '/';
    }

    return (
        <div style={{ width: 240 }}>
            <Sidenav defaultOpenKeys={['3', '4']}>
                <Sidenav.Body>
                    <Nav style={{height: '100%'}} activeKey={activeKey} onSelect={(event) => setActiveKey((event !== undefined) ? event : activeKey)}>
                        <Nav.Item eventKey="1" icon={<DashboardIcon />}>
                            Dashboard
                        </Nav.Item>
                        <Nav.Item eventKey="3" icon={< CreditCardPlusIcon />}>
                            Wallet
                        </Nav.Item>
                        <Nav.Item eventKey="4" icon={<StorageIcon />} as={NavLink} href="/cloud">Cloud</Nav.Item>
                        <Nav.Item eventKey={`5`} icon={<GroupIcon />} as={NavLink} href={`/worker`}>
                            Workers
                            {/* <button className='sidenav_btn sidenav_btn_add' onClick={() => alert('Add workers')}>
                                <Plus/>
                            </button> */}
                        </Nav.Item> 
                        <Nav.Menu eventKey="4" title="Companies" icon={<ListIcon />}>
                            <Nav.Item eventKey="4-1" icon={<TreemapIcon />} as={NavLink} href="/company">All companies</Nav.Item>

                            {companies && companies.map((elem, index) => {
                                return (
                                    <Nav.Item key={`company_nav_${index}`} eventKey={`4-${index + 2}`} icon={<ArrowRightLineIcon />} as={NavLink} href={`/company/${elem.id}`}>{elem.name}</Nav.Item> 
                                )
                            })}

                            <Nav.Item eventKey={`4-${companies.length + 2}`} icon={<PlusIcon />} as={NavLink} href="/company/add">Add company</Nav.Item>
                        </Nav.Menu>
                        {/* <Nav.Menu eventKey="5" title="Worker" icon={<GearCircleIcon />}>
                            <Nav.Item eventKey="5-1">All workers</Nav.Item>
                            <Nav.Item eventKey="5-2">Profile</Nav.Item>
                            <Nav.Item eventKey="5-3">Versions</Nav.Item>
                        </Nav.Menu> */}


                        {/* <Nav.Item eventKey={`6`} icon={<GearCircleIcon />} as={NavLink} href={`/worker/add`}>Add worker</Nav.Item>  */}
                        <Nav.Item eventKey={`7`} icon={<Exit />} onClick={handleLogout} style={{display: 'block', marginTop: 'auto'}}>Logout</Nav.Item> 
                        {/* <Nav.Item eventKey={`7`} icon={<ProjectIcon />} as={NavLink} href={`/kanban`}>Kanban</Nav.Item> 
                        <Nav.Item eventKey={`8`} icon={<ProjectIcon />} as={NavLink} href={`/todo`}>Todo</Nav.Item>  */}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </div>
    )
}
