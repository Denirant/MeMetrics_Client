import { Table, Checkbox } from 'rsuite';
import { useState ,forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import './table.css'

const { Column, HeaderCell, Cell } = Table;

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: '46px' }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys.some(item => item === rowData[dataKey])}
      />
    </div>
  </Cell>
);


const TableUI = forwardRef(({array = []}, _ref) => {

  const navigate = useNavigate();

    const data = array.map((el, index) => {
        return {
            id: index + 1,
            brand: el.brand,
            nomination: el.nomination,
            unit: el.unit.name,
            value: el.unit.value,
            noteId: el.card_id
        }
    });

    useImperativeHandle(_ref, () => {
        return {
            getChecks: () => {
                return array.filter((el, index) => checkedKeys.includes(index + 1));
            }
        }
    })
        
    const [checkedKeys, setCheckedKeys] = useState([]);
    let checked = false;
    let indeterminate = false;

    if (checkedKeys.length === data.length) {
        checked = true;
    } else if (checkedKeys.length === 0) {
        checked = false;
    } else if (checkedKeys.length > 0 && checkedKeys.length < data.length) {
        indeterminate = true;
    }

    const handleCheckAll = (value, checked) => {
        const keys = checked ? data.map(item => item.id) : [];
        setCheckedKeys(keys);
    };
    const handleCheck = (value, checked) => {
        const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
        setCheckedKeys(keys);
    };



    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    const [loading, setLoading] = useState(false);

    const getData = () => {
        if (sortColumn && sortType) {
          return data.sort((a, b) => {
            let x = a[sortColumn];
            let y = b[sortColumn];
            if (typeof x === 'string') {
              x = x.charCodeAt();
            }
            if (typeof y === 'string') {
              y = y.charCodeAt();
            }
            if (sortType === 'asc') {
              return x - y;
            } else {
              return y - x;
            }
          });
        }
        return data;
    };

    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setSortColumn(sortColumn);
          setSortType(sortType);
        }, 500);
    };

    

    return (
        <div ref={_ref}>
            <Table 
                height={600} 
                data={getData()} 
                id="table"
                onRowClick={(data, event) => {
                    if(!event.target.classList.contains('rs-checkbox-wrapper')){
                        navigate(`/matrix/${data.noteId}`)
                    }
                }}
                sortColumn={sortColumn}
                sortType={sortType}
                onSortColumn={handleSortColumn}
                loading={loading}
            >
                <Column width={50} align="center">
                    <HeaderCell style={{ padding: 0 }}>
                    <div style={{ lineHeight: '40px' }}>
                        <Checkbox
                        inline
                        checked={checked}
                        indeterminate={indeterminate}
                        onChange={handleCheckAll}
                        />
                    </div>
                    </HeaderCell>
                    <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
                </Column>


                <Column width={350} align="center" sortable>
                    <HeaderCell>Brand</HeaderCell>
                    <Cell dataKey="brand" />
                </Column>

                <Column width={450} align="center" sortable>
                    <HeaderCell>Nomination</HeaderCell>
                    <Cell dataKey="nomination" />
                </Column>

                <Column width={150} align="center" sortable>
                    <HeaderCell>Unit</HeaderCell>
                    <Cell dataKey="unit" />
                </Column>

                <Column width={200} align="center" sortable>
                    <HeaderCell>Value</HeaderCell>
                    <Cell dataKey="value" />
                </Column>


            </Table>
        </div>
    );
});

export default TableUI;