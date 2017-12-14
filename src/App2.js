import React from 'react';

// Import React Table
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './App.css';
import Graph from './Graph';
import '../node_modules/react-json-inspector/json-inspector.css';

import isEqual from 'lodash/isEqual'
import DropdownContainer from './DropdownContainer'
let Inspector = require('react-json-inspector');

const table_file = 'table.json'

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
  let full_name = parent === undefined ? name : parent + "." + name;
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
      all_data = mergeDeep(all_data, getTypes(data));
    }

    let tree = [];
    for (let idx in all_data) {
      tree.push(getTree(all_data[idx], idx));
    }

    return tree;
}

class GraphLoader extends React.Component {

  state = {
    data: this.props.data,
    graph: [],
  };

  componentWillReceiveProps = (props) => {
    if (!isEqual(props.data, this.state.data)) {
      this.loadData(props.data)
    }
  }

  loadData = async (data) => {
    let d = data
    let server = ''
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
       server = "http://localhost:5000/"
    }
    var url = server + 'data/'+ d.json

    fetch(url, {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json' }
     })
    .then(function(response) {
      if (response.status >= 400) {
        console.log("Bad response from server graph file.");
        return
      }
      return response.json();
    })
    .then( data => {
      if (data) {
        let graph = data;
        for (let i in graph) {
          for (let j in graph[i])
            graph[i][j] = graph[i][j] === "" ? null : graph[i][j]
        }

        this.setState({data: d, graph: graph });
      }
    });
  }
  componentDidMount = () => {
      this.loadData(this.state.data)
  }

  render () {
    return (
      <Graph data={this.state.graph}
             xaxis={this.state.data.xaxis}
             yaxis={this.state.data.yaxis} />
    );
  }
}

class App extends React.Component {
  state = {
      data: [],
      tree: [],
      selected: [],
      name: 'test',
  };

  componentDidMount = () => {
      let server = ''
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
         server = "http://localhost:5000/"
      }
      var url = server + 'data/' + table_file

      fetch(url, {
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json' }
       })
      .then( response => {
        if (response.status >= 400) {
          console.log("Bad response from server");
          return
        }
        return response.json();
      })
      .then( data => {
        if (data) {
          let tree = createTree(data)
          this.setState({ data: data, tree: tree});
        }
      });
  }

  onChange = (current, selected) => {
    this.setState({selected});
  };

  renderCell = (row) => {
    if (row.value && typeof row.value === 'object') {
      return (row.value.hasOwnProperty('$graph')
            ? <GraphLoader data={row.value["$graph"]}/>
            : <Inspector  data={row.value} search={false}/>);
    }
    // (key,id) => {
    //   let data = row.original[key]
    //   return data.hasOwnProperty('$graph') ?
    //     <GraphLoader data={data["$graph"]} key={id}/> : null;
    // })

    else {
      return <div>{row.value}</div>;
    }
  }

  accessor = (data, path) => {
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

  selectGraph = (data) => {
    if ( data.hasOwnProperty('$graph') ) {
        return data["$graph"];
    }
  }

  render() {
    return (

      <div className='App'>
        {
           this.state.tree.length > 0 &&
           <DropdownContainer data={this.state.tree}
                               onChange={this.onChange}/>
        }
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
                {
                  Object.keys(row.original).map(
                  (key,id) => {
                    let data = row.original[key]
                    return (data.hasOwnProperty('$graph') ?
                      <GraphLoader data={data["$graph"]} key={id}/> : null);
                  })
                }
                <Inspector data={row.original}/>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default App
