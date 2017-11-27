import React from 'react';

// Import React Table
import ReactTable from "react-table";
import 'react-table/react-table.css';
import update from 'react-addons-update';
import './App.css';
import Graph from './Graph';
import mydata from './data/processed-torch.csv.json';
import JSONTree from 'react-json-tree';
import '../node_modules/react-json-inspector/json-inspector.css';
import DropdownTreeSelect from './react-dropdown-tree-select/src/index';

let Inspector = require('react-json-inspector');

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

const getTree = (val, name, parent) => {
  let full_name = parent == undefined ? name : parent + "." + name;
  let children = undefined;
  if (isObject(val)) {  
    children = []
    for (let idx in val ) {
      children.push(getTree(val[idx], idx, full_name));
    }
  }
  return {label: name, value: full_name, children: children, checked: false};
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

// let csv_data = mydata.map( obj => Object.assign(obj, {trainin_graph: {graph: data }} ));
let csv_data = mydata

const tree = createTree(csv_data);

class GraphLoader extends React.Component {

  state = { 
    file: this.props.data,
    graph: null
  }; 


  componentWillMount = () => {
    let graph = require('./data/' + this.state.file + '.json')
    for (let i in graph) {
      for (let j in graph[i])
        graph[i][j] = graph[i][j] == "" ? null : graph[i][j]
    }
    this.setState({graph})
    console.log('loaded '+ this.state.file)
  }

  render () {
    return <Graph data={this.state.graph} />
  }
}
class App extends React.Component {
  state = {
      data: csv_data,
      tree: createTree(csv_data),
      selected: [],
      name: 'test',
  };
  
  // handleChange = (value, id) => {
  //   this.setState({
  //     value_name: update(this.state.value_name, {[id]: {$set: value}})
  //   });
  // };


  onChange = (current, selected) => {

    // let path = current.value.split(".");
    // let r = this.state.tree;
    // let check = current.checked;
    this.setState({selected});

    // const updateTree = (node, stack, idx) => {
    //   let curr_stack = stack ? stack : [];
    //   curr_stack.push(node);

    //   for (let idx in node) {

    //   }

    // };

    // const fnc = (path, current) => {
    //   let p = path[0];

    //   if (path.length > 1) {

    //     return {[p]: fnc(path.slice(1))};
    //   }
    //   else {
    //     return {[p]: {checked: {$set: check}}};
    //   }
    // };

    // let up = fnc(path, this.state.tree);
    
    // this.setState({
    //   tree: update(this.state.tree, {network: {checked: {$set: true}}})
    // });

    // this.setState({name: "test2"});

    // setTimeout(() => this.setState( prev => ({name: "test2"})), 2000)
    // this.setState({selected: selected})
    // return (current, selected);
  };

  renderCell = (row) => {
    if (row.value && typeof row.value === 'object') {
      return <Inspector  data={row.value} search={false}/>
    }
    else {
      return <div>{row.value}</div>;
    }
  }


  accessor = (data, path) => {
    console.log(JSON.stringify(path))
    let p = path.split(".")
    let n = data

    for (let idx of p) {
      if (!(idx in n)) {
        return
      }
      n = n[idx]
    }

    return n
  }

  selector = (data) => {
    let name = data.label;
    return ({
        Header: name,
        id: data.value,
        accessor: (d) => this.accessor(d, data.value),
        Cell: this.renderCell
      });
  };

  render() {
    return ( 
      <div className='App'>
      
        <DropdownTreeSelect data={tree}  onChange={ this.onChange}/>
        <br/>
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
                <GraphLoader data={row.original.guid} />
                {
                  // <JSONTree data={row.original} theme={JSONtheme} hideRoot={false}/>
                }
                <Inspector data={row.original}/>
              </div>
            );
          }}
        />
          {
        // <Inspector data={this.state.tree}/>
        }
      </div>
    );
  }
}

export default App 
