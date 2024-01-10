import React from 'react';
import ReactDOM from 'react-dom';
import ErrorAlert from '../components/customError/CustomError'; // Подставьте правильный путь к компоненте

const showErrorAlert = (errorMessage, isCoverPage = false) => {
  return new Promise((resolve) => {
    const closeAlert = () => {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      resolve();
    };

    const container = document.createElement('div');
    container.classList.add('error_alert_container')
    document.querySelector('.app').appendChild(container);

    ReactDOM.render(
      <ErrorAlert message={errorMessage} cover={isCoverPage} onClose={closeAlert} />,
      container
    );
  });
};

export default showErrorAlert;
