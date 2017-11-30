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
// const getAxisYDomain = (data, from, to, ref, offset) => {
// 	const refData = data.slice(from-1, to);
//   let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
//   refData.forEach( d => {
//   	if ( d[ref] > top ) top = d[ref];
//     if ( d[ref] < bottom ) bottom = d[ref];
//   });

//   return [ (bottom|0) - offset, (top|0) + offset ]
// };

class Graph extends Component {
  state = {
    data: this.props.data,
    left : 'dataMin',
    right : 'dataMax',
    refAreaLeft : '',
    refAreaRight : '',
    xaxis: this.props.xaxis,
    yaxis: this.props.yaxis,
    // top : 'dataMax+1',
    // bottom : 'dataMin-1',
    // top2 : 'dataMax+20',
    // bottom2 : 'dataMin-20',
    animation : true
  };

  componentWillReceiveProps = (props) => {
    if (!equal(props.data, this.state.data, {strict: true})) {
      this.setState({data: props.data, xaxis: props.xaxis, yaxis:props.yaxis})
    }
  }

  zoom = () => {
    let { refAreaLeft, refAreaRight, data } = this.state;

		if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
      this.setState( () => ({
        refAreaLeft : '',
        refAreaRight : ''
      }) );
      return;
    }

		// xAxis domain
    if ( refAreaLeft > refAreaRight )
      [ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];

     // getAxisYDomain(this.props.data, refAreaLeft, refAreaRight, 'Training', 1 );
		// yAxis domain
    // const [ bottom, top ] = getAxisYDomain(this.props.data, refAreaLeft, refAreaRight, '1', 1 );
    // const [ bottom2, top2 ] = getAxisYDomain(this.props.data, refAreaLeft, refAreaRight, '2', 50 );

    this.setState( () => ({
      refAreaLeft : '',
      refAreaRight : '',
      data : data.slice(),
      left : refAreaLeft,
      right : refAreaRight,
      // bottom, top, bottom2, top2
    } ) );
  };

	zoomOut = () => {
    const { data } = this.state;
    this.setState( () => ({
      data : data.slice(),
      refAreaLeft : '',
      refAreaRight : '',
      left : 'dataMin',
      right : 'dataMax',
      // top : 'dataMax+10',
      // bottom : 'dataMin',
      // top2 : 'dataMax+50',
      // bottom2: 'dataMin+50'
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
    const { data, left, right, refAreaLeft, refAreaRight, top, bottom, top2, bottom2 } = this.state;
    // "Epoch", 'Training', 'Validation','Score1','Score2'
    return (
      <div className="App-chart" onDoubleClick={this.zoomOut}>
        <ResponsiveContainer height={200} width="100%">
          <LineChart
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            data={data}
            onMouseDown = { this.onMouseDown }
            onMouseMove = { this.onMouseUp }
            onMouseUp = { this.zoom }
            onDoubleClick = { this.zoomOut}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
              allowDataOverflow={false}
              dataKey={this.state.xaxis}
              domain={[left, right]}
              type="number"
            />
            <YAxis
              allowDataOverflow={false}
              // domain={[bottom, top]}
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
              (refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Graph;
