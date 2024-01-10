import React from 'react'
import { Dropdown, Popover, Whisper, Button } from 'rsuite';
import AdminIcon from '@rsuite/icons/Admin';

const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location = '/';
}

const renderSpeaker = ({ onClose, left, top, className, ...rest }, ref) => {

    const handleSelect = eventKey => {
      onClose();
      console.log(eventKey);
    };


    return (
        <Popover ref={ref} className={className} style={{ left, top }}>
            <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Item eventKey={3}>Drop element</Dropdown.Item>
                <Dropdown.Item eventKey={4}>Drop element</Dropdown.Item>
                <Dropdown.Item eventKey={5}>Drop element</Dropdown.Item>
                <Dropdown.Item eventKey={6}>Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} eventKey={7}>Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Popover>
    );
};


export default function Userdropdown({ onClose, left, top, className, ...rest }, ref) {

    return (
        <div className='userDropCown'>
            <Whisper placement="bottomEnd" trigger="click" speaker={renderSpeaker}>
                <Button startIcon={<AdminIcon style={{fontSize: '1.5em'}}/>}>User nickname</Button>
            </Whisper>
        </div>
    )
}
