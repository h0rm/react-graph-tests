import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Graph from './Graph';

class App extends React.Component {
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
  };
  render() {
    var rows = [];
    this.state.rows.forEach( (row) => {
        rows.push(
          <tr>
            <td>{row}</td>
            <td><Graph data={this.state.data}/></td>
          </tr>
        );
    });

    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default App;
