import React from 'react';
import ReactDOM from 'react-dom';
import CustomConfirm from '../components/customConfirm/CustomConfirm'; // Подставьте правильный путь к компоненте

const showCustomConfirm = (message, yesText, title) => {
  return new Promise((resolve) => {
    const confirmCallback = (confirmed) => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      resolve(confirmed);
    };

    const container = document.createElement('div');
    container.classList.add('confirm_container_center')
    document.querySelector('.app').appendChild(container);

    ReactDOM.render(
      <CustomConfirm message={message} yesText={yesText} title={title} onConfirm={confirmCallback} />,
      container
    );
  });
};

export default showCustomConfirm;
