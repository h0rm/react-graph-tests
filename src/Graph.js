import React, { Component } from 'react';
import { LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea, Legend, ResponsiveContainer } from 'recharts';

let equal = require('deep-equal');
const colors = [ '#1f77b4',  // muted blue
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'   // blue-teal
  ];

const getAxisXDomain = (data, from, to, ref) => {

  if ( from > to )
    [ from, to ] = [ to, from ];

  let left = null
  let right = null

  data.forEach( (d,idx) => {
    if ( !left && d[ref] > from ) left = idx;
    if ( d[ref] < to ) right = idx;
  });

  return [ left-1, right+2 ]
};

class Graph extends Component {
  state = {
    original_data: this.props.data,
    data: this.props.data,
    left : 'dataMin',
    right : 'dataMax',
    refAreaLeft : '',
    refAreaRight : '',
    xaxis: this.props.xaxis,
    yaxis: this.props.yaxis,
    top : 'dataMax+1',
    bottom : 'dataMin-1',
    top2 : 'dataMax+20',
    bottom2 : 'dataMin-20',
    animation : true
  };

  componentWillReceiveProps = (props) => {
    if (!equal(props.data, this.state.data, {strict: true})) {
      this.setState({data: props.data, original_data: props.data,
                    xaxis: props.xaxis, yaxis:props.yaxis})
    }
  }

  zoom = () => {
    let { refAreaLeft, refAreaRight, data } = this.state;

		if ( !refAreaRight || !refAreaLeft ||
      refAreaLeft === refAreaRight || refAreaRight === '' ) {
      this.setState( () => ({
        refAreaLeft : '',
        refAreaRight : ''
      }) );
      return;
    }

    let [left, right ] =
        getAxisXDomain(data, refAreaLeft, refAreaRight, this.state.xaxis)

    this.setState( () => ({
      refAreaLeft : '',
      refAreaRight : '',
      data : data.slice(left, right),//
      left : refAreaLeft,
      right : refAreaRight,
    } ) );
  };

	zoomOut = () => {
    this.setState( () => ({
      data : this.state.original_data.slice(),
      refAreaLeft : '',
      refAreaRight : '',
      left : 'dataMin',
      right : 'dataMax',
      top : 'dataMax+10',
      bottom : 'dataMin',
    }) );
  }

  onMouseDown = (event) => {
    if (event)
      this.setState({refAreaLeft:event.activeLabel});
  };

  onMouseUp = (event) => {
    if (event && this.state.refAreaLeft)
      this.setState({refAreaRight:event.activeLabel})
  };

  render() {
    return (
      <div className="App-chart" onDoubleClick={this.zoomOut}>
        <ResponsiveContainer height={200} width="100%">
          <LineChart
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            data={this.state.data}
            onMouseDown = { this.onMouseDown }
            onMouseMove = { this.onMouseUp }
            onMouseUp = { this.zoom }
            onDoubleClick = { this.zoomOut}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
              allowDataOverflow={false}
              dataKey={this.state.xaxis}
              domain={[this.state.left, this.state.right]}
              type="number"
            />
            <YAxis
              allowDataOverflow={false}
              type="number"
              yAxisId="1"
             />
            <Tooltip/>
            {
              this.state.yaxis && this.state.data &&
                this.state.yaxis.map( (name,id) => {
                  return <Line yAxisId="1" type='natural'
                               connectNulls={true} dataKey={name}
                               stroke={colors[id%colors.length]}
                               animationDuration={200} key={id}/>;
                })
            }
            <Legend verticalAlign="top" height={36}/>
            {
              this.state.refAreaLeft && this.state.refAreaRight &&
              <ReferenceArea yAxisId="1"
                x1={this.state.refAreaLeft}
                x2={this.state.refAreaRight} strokeOpacity={0.3} />
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Graph;
