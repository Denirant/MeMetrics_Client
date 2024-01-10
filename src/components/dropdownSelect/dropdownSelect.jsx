import React from "react";
import { connect } from 'react-redux';
import './dropdownSelect.css'
import { setVisibleFiles } from "../../reducers/fileReducer";


class DropdownSelect extends React.Component {
  constructor(props) {
    super(props);
    console.log(this)
    this.state = {
      selected: this.props.optionsList.map(el => el.name),
      showOptionList: false,
      optionsList: this.props.optionsList,
    };
  }


  componentDidMount() {
    // Add Event Listner to handle the click that happens outside
    // the Custom Select Container
    
    document.addEventListener("mousedown", this.handleClickOutside);
    this.setState({
      defaultSelectText: this.props.defaultText
    });
  }

  componentWillUnmount() {
    
    // Remove the event listner on component unmounting
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // This method handles the click that happens outside the
  // select text and list area
  handleClickOutside = e => {
    if (
      !e.target.classList.contains("custom-dropselect-option") &&
      !e.target.classList.contains("dropdownselect_check") &&
      !e.target.classList.contains("dropselect-text") && 
      !e.target.classList.contains("dropselect-item-text") && 
      !e.target.classList.contains("dropdownselect_image")
    ) {
      this.setState({
        showOptionList: false
      });
    }
  };

  // This method handles the display of option list
  handleListDisplay = () => {
    this.setState(prevState => {
      return {
        showOptionList: !prevState.showOptionList
      };
    });
  };

  // This method handles the setting of name in select text area
  // and list display on selection
  handleOptionClick = (e) => {
    e.stopPropagation();

    const clickedOptionName = e.currentTarget.dataset.name;
    const isChecked = !e.currentTarget.querySelector('input[type="checkbox"]').checked;

    const allOptionNames = this.state.optionsList.map((option) => option.name);

    this.setState(
      (prevState) => {
        // Создаем копию предыдущего состояния
        const updatedState = { ...prevState };

        if (clickedOptionName === allOptionNames[0]) {
          if (isChecked) {
            updatedState.selected = allOptionNames;
          } else {
            updatedState.selected = [];
          }
        } else {
          if (isChecked) {
            if (prevState.selected.length === allOptionNames.length - 2) {
              updatedState.selected = [...allOptionNames];
            } else {
              updatedState.selected = [...prevState.selected, clickedOptionName];
            }
          } else {
            const updatedSelected = prevState.selected.filter((name) => name !== clickedOptionName);
            if (updatedSelected.includes(allOptionNames[0])) {
              updatedState.selected = updatedSelected.filter((name) => name !== allOptionNames[0]);
            } else {
              updatedState.selected = updatedSelected;
            }
          }
        }

        return updatedState;
      },
      () => {
        // Вызываем action creator и автоматически отправляем действие в Redux store
        const { dispatch } = this.props;
        dispatch(setVisibleFiles(this.state.selected));
      }
    );
  };




  handleDropSelectChange = e => {
    alert(e.target.value)
  }

  render() {
    const { showOptionList, defaultSelectText, optionsList } = this.state;

    return (
      <div className="custom-dropselect-container">
        <div
          className={`dropselect-text ${showOptionList ? "active" : ""} ${this.state.selected.length ? "blue" : ""}`}
          onClick={this.handleListDisplay}
        >
          {(!this.state.selected.length) ? defaultSelectText : this.state.selected.filter(el => el !== 'All files').join(', ').slice(0, 20) + '...'}
        </div>
        {showOptionList && (
          <ul className="dropselect-options">
            {optionsList.map((option) => {
              const isActive = this.state.selected.includes(option.name);

              return (
                <li
                  className={`custom-dropselect-option ${isActive ? "active" : ""}`}
                  data-name={option.name}
                  key={option.id}
                  onClick={this.handleOptionClick}
                >
                  <input
                    type="checkbox"
                    name="type"
                    id={`dropselect_${option.name}`}
                    value={option.name}
                    checked={isActive}
                    onChange={() => {}}
                  />
                  <label className="dropdownselect_check" htmlFor={`dropselect_${option.name}`}></label>
                  <img className="dropdownselect_image" src={option.image} alt="icon" />
                  <p className="dropselect-item-text">{option.name}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );

  }
}

export default connect()(DropdownSelect);

