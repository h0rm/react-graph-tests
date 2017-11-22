import React, { Component } from 'react';
import './App.css';
import Graph from './Graph';
import mydata from './data/convertcsv.json'

class HideableGraph extends Component {
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


class App extends Component {
  state = {
    data: [
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
    ],
    rows: [1, 2, 3, 4, 5],
    csv: mydata,
  };
  componentDidMount() {
    console.log(mydata[0])
  }

  render() {
    let rows = this.state.csv.map((entry, index) => {
        let columns = []

        columns.push(
          <td><HideableGraph data={this.state.data}  shown={true}/></td>
        );

        for (let key in entry) {
          columns.push(
            <td>{entry[key]}</td>
          );
        }

        return (
          <tr>
          {columns}
          </tr>
        );
    });

    let header = []
    for (let key in this.state.csv[0]) {
        header.push(<td>{key}</td>);
    }
    return (
      <table>
        <tbody>{header}{rows}</tbody>
      </table>
    );
  }
}

export default App;
