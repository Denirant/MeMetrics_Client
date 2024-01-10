import React, {useEffect} from 'react'
import Userdropdown from '../components/UserDropdown/userdropdown'
import axios from 'axios';

export default function Worker() {

  useEffect(() => {
    const updateOnlineStatus = async () => {
      console.log('Online')
      await axios.post('https://memetricsserver.onrender.comapi/workers/online', {id: localStorage.getItem('id')})
    };

    updateOnlineStatus();

    const interval = setInterval(() => {
      updateOnlineStatus();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <div>
      Worker page

      <Userdropdown/>
    </div>
  )
}
