import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class Selector extends React.Component {
  state = {
    value: "firstName",
  };

  render() {
    return (<select value={this.state.value_name}
      onChange={(event) => {this.props.handleChange(event.target.value)}}>
      <option value="lastName">lastName</option>
      <option value="firstName">firstName</option>
      <option value="age">age</option>
      <option value="status">status</option>
    </select>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData(),
      value_name: {},
    };
  }
  handleChange = (value, id) => {
    this.setState( (prevState) => {
      prevState.value_name[id] = value;
      console.log(prevState.value_name[id]);
      return { prevState };
    });
  }

  render() {
    const { data } = this.state;
    console.log(this.state.value_name)
    return (
      <div>

        <input type="submit" value="Submit" />
        <ReactTable
          showPagination={true}
          data={data}
          columns={[
            {
              Header: <Selector handleChange={ (value) => this.handleChange(value, 1)}/>,
              id: "1",
              accessor: (d) => {return d[this.state.value_name[1]];},
            },
            {
              Header: <Selector handleChange={(value) => this.handleChange(value, 2)} />,
              id: "2",
              accessor: (d) => { return d[this.state.value_name[2]]; },
            },
            {
              Header: <Selector handleChange={(value) => this.handleChange(value, 3)} />,
              id: "3",
              accessor: (d) => { return d[this.state.value_name[3]]; },
            },
            {
              Header: <Selector handleChange={(value) => this.handleChange(value, 4)} />,
              id: "4",
              accessor: (d) => { return d[this.state.value_name[4]]; },
            },
          ]}
          defaultPageSize={100}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
