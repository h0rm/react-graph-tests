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
import '../node_modules/react-dropdown-tree-select/dist/styles.css';
import DropdownTreeSelect from 'react-dropdown-tree-select'

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

const isObject = (item) => {
      return (item && typeof item === 'object' && !Array.isArray(item));
    }

const mergeDeep = (target, source) => {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

const toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}


const getTypes = (val) => {
  if (isObject(val)) {
    let ret = {}
    for (let v in val) {
      Object.assign(ret, {[v]: getTypes(val[v])});
    }
    return ret;
  }
  else {
    return toType(val)
  }
}

const getTree = (val, name) => {
  let children = undefined;
  if (isObject(val)) {  
    children = []
    for (let idx in val ) {
      children.push(getTree(val[idx], idx));
    }
  }
  return {label: name, value: false, children: children};
};

const createTree = (input_data) => {
    let all_data = {};
    for (let data of input_data) {
      let elem = data;
      all_data = mergeDeep(all_data, getTypes(data));
    }

    let tree = [];
    for (let idx in all_data) {
      tree.push(getTree(all_data[idx], idx));
    }

    return tree;
}

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

const tree = createTree(csv_data);

class App extends React.Component {
  state = {
      data: csv_data,
      tree: createTree(csv_data),
      columns: [],
      selected: [],
      name: "test",
  };
  
  // handleChange = (value, id) => {
  //   this.setState({
  //     value_name: update(this.state.value_name, {[id]: {$set: value}})
  //   });
  // };

  addSelectd = async (selected) => {
    this.setState({selected: selected})
  }

  onChange = (current, selected) => {

    console.log(JSON.stringify(selected));
    // setTimeout(() => this.setState( prev => ({name: "test2"})), 2000)
    this.setState({selected: selected})

    // this.addSelectd(selected);

    // this.forceUpdate();
    return true;
  };

  renderCell = (row) => {
    if (row.value && typeof row.value === 'object') {
      return <Inspector  data={row.value} search={false}/>
    }
    else {
      return <div>{row.value}</div>;
    }
  }

  selector = (data) => {
    let name = data.label;
    return ({
        Header: name,
        accessor: name,
        Cell: this.renderCell
      });
  };

  render() {
    return ( 
      <div className='App'>
        <ReactTable
          showPagination={true}
          data={this.state.data}
          columns={this.state.selected.map(this.selector)}
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
        <DropdownTreeSelect data={this.state.tree}  onChange={this.onChange}/>
      </div>
    );
  }
}

export default App 
