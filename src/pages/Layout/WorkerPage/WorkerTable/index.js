import React from "react";
import ReactDOM from "react-dom";
import { Table, Checkbox } from "semantic-ui-react";

import './style.css'

const users = [
  {
    id: 1,
    name: "Ivan Ivanov",
    img: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    email: "shnappy@mail.ru",
    company: "Apple",
    position: "Designer",
    status: true,
  },
  {
    id: 2,
    name: "Ivan Ivanov",
    img: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1hbnxlbnwwfHwwfHx8MA%3D%3D',
    email: "shnappy@mail.ru",
    company: "Apple",
    position: "Designer",
    status: false,
  },
];

const TableRow = React.memo(({ selected, id, data, handleSelect }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Checkbox id={id} checked={selected} onChange={handleSelect} />
      </Table.Cell>
      <Table.Cell><img src={data.img} width={28} height={28} alt="account_photo"/>{data.name}</Table.Cell>
      <Table.Cell>{data.email}</Table.Cell>
      <Table.Cell>{data.company}</Table.Cell>
      <Table.Cell>{data.position}</Table.Cell>
      <Table.Cell>{data.status ? 'active' : 'offline'}</Table.Cell>
      <Table.Cell>dots</Table.Cell>
    </Table.Row>
  );
});

function DataTable() {
  const [state, setState] = React.useState({});

  const handleSelect = React.useCallback((e, { id, checked }) => {
    //e.persist();
    setState((state) => {
      const selected = { ...state };
      selected[id] = checked;
      return selected;
    });
  }, []);

  console.log("state:", state);

  return (
    <div className="worker_table">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Position</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <TableRow
              key={user.id}
              id={user.id}
              data={user}
              selected={state[user.id]}
              handleSelect={handleSelect}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default DataTable;
