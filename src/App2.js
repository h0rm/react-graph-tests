import React from "react";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import update from 'react-addons-update';
import './App.css';
import Graph from './Graph';
// import mydata from './data/convertcsv.json'
import mydata from './data/processed-torch.csv.json'
import JSONTree from 'react-json-tree'
import '../node_modules/react-json-inspector/json-inspector.css';

let Inspector = require('react-json-inspector')

const JSONtheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

let _ = require('lodash');

let data = [
      { name: 1, cost: 4.11, impression: 100 },
      { name: 2, cost: 2.39, impression: 120 },
      { name: 3, cost: 1.37, impression: 150 },
      { name: 4, cost: 1.16, impression: 180 },
      { name: 5, cost: 2.29, impression: 200 },
      { name: 6, cost: 3, impression: 499 },
      { name: 7, cost: 0.53, impression: 50 },
      { name: 8, cost: 2.52, impression: 100 },
      { name: 9, cost: 1.79, impression: 200 },
      { name: 10, cost: 2.94, impression: 222},
      { name: 11, cost: 4.3, impression: 210 },
      { name: 12, cost: 4.41, impression: 300 },
      { name: 13, cost: 2.1, impression: 50 },
      { name: 14, cost: 8, impression: 190 },
      { name: 15, cost: 0, impression: 300 },
      { name: 16, cost: 9, impression: 400 },
      { name: 17, cost: 3, impression: 200 },
      { name: 18, cost: 2, impression: 50 },
      { name: 19, cost: 3, impression: 100 },
      { name: 20, cost: 7, impression: 100 }
    ];

class HideableGraph extends React.Component {
  state = {
    shown: this.props.shown,
  };

  click = () => {
    ;
  };

  render() {
    return (
      <table>
      <tbody><tr>
        <td>
          <button
            className="btn btn-default"
            onClick={() => this.setState({shown: !this.state.shown})}
            >{ this.state.shown ? "Hide" : "Show" }</button>
        </td>
        <td>
          {/*<div style={{ display: (this.state.shown ? 'block' : 'none') }}>
              <Graph data={this.props.data}/>
          </div>}*/}
          {this.state.shown ? <Graph data={this.props.data} /> : null}
        </td>
      </tr></tbody>
      </table>  
    );
  }
};

class Selector extends React.Component {
  onClick = (e) => {
    e.preventDefault()
  }

  render = () => (
    <select 
      onChange={event => this.props.handleChange(event.target.value)}
      onClickCapture={this.onClick} 
    >
    { this.props.list.map( 
          (val, idx) => <option value={val} key={idx}>{val}</option> )}
    </select>
  )
}

let csv_data = mydata.map( obj => Object.assign(obj, {trainin_graph: {graph: data }} ));

class App extends React.Component {
  state = {
      data: csv_data,
      value_name: [],
      n_cols: 5,
      list: Object.keys(csv_data[0]),
  };
  
  handleChange = (value, id) => {
    this.setState({
      value_name: update(this.state.value_name, {[id]: {$set: value}})
    });
  };

  renderCell = (row) => {
    // return <JSONTree data={row.value} theme={JSONtheme} hideRoot={true}/>;
    
    if (row.value && typeof row.value === 'object') {
      return <Inspector  data={row.value} search={false}/>
    }
    else {
      return <div>{row.value}</div>;
      
    //   // return <HideableGraph data={row.value.graph}  shown={false}/>;
    //   // return <Graph data={row.value.graph}/>;
    //   // return <div>graph</div>;
    // }
    // else {
    // return <div>{JSON.stringify(row.value)}</div>;
    // }
    }
  }

  render = () => {
    let cols = _.range(this.state.n_cols).map(
      id => ({
        Header: <Selector 
                    handleChange={ value => this.handleChange(value, id) } 
                    list={this.state.list}  />,
        id: id.toString(),
        accessor: d => d[this.state.value_name[id]],
        Cell: this.renderCell
      })
    );

    return (
      <div className='App'>
        <ReactTable
          showPagination={true}
          data={this.state.data}
          columns={cols}
          defaultPageSize={20}
          filterable
          className="-striped -highlight -wrap"
          SubComponent= {row => {
            return (
              <div>
                <Graph data={row.original.trainin_graph.graph} />
                {
                  // <JSONTree data={row.original} theme={JSONtheme} hideRoot={false}/>
                }
                <Inspector data={row.original}/>
              </div>
            );
          }}
        />
        <br />
      </div>
    );
  }
}

export default App 
