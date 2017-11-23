import React, { Component } from 'react';
import { LineChart, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';


const getAxisYDomain = (data, from, to, ref, offset) => {
	const refData = data.slice(from-1, to);
  let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
  refData.forEach( d => {
  	if ( d[ref] > top ) top = d[ref];
    if ( d[ref] < bottom ) bottom = d[ref];
  });

  return [ (bottom|0) - offset, (top|0) + offset ]
};

class Graph extends Component {
  state = {
    data: this.props.data,
    left : 'dataMin',
    right : 'dataMax',
    refAreaLeft : '',
    refAreaRight : '',
    top : 'dataMax+1',
    bottom : 'dataMin-1',
    top2 : 'dataMax+20',
    bottom2 : 'dataMin-20',
    animation : true
  };

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

		// yAxis domain
    const [ bottom, top ] = getAxisYDomain(this.props.data, refAreaLeft, refAreaRight, 'cost', 1 );
    const [ bottom2, top2 ] = getAxisYDomain(this.props.data, refAreaLeft, refAreaRight, 'impression', 50 );

    this.setState( () => ({
      refAreaLeft : '',
      refAreaRight : '',
    	data : data.slice(),
      left : refAreaLeft,
      right : refAreaRight,
      bottom, top, bottom2, top2
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
      top : 'dataMax+1',
      bottom : 'dataMin',
      top2 : 'dataMax+50',
      bottom2: 'dataMin+50'
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

    return (
      <div className="App-chart" onDoubleClick={this.zoomOut}>
          <LineChart
            width={1000}
            height={200}
            data={data}
            onMouseDown = { this.onMouseDown }
            onMouseMove = { this.onMouseUp }
            onMouseUp = { this.zoom }
            onDoubleClick = { this.zoomOut}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
              allowDataOverflow={true}
              dataKey="name"
              domain={[left, right]}
              type="number"
            />
            <YAxis
              allowDataOverflow={true}
              domain={[bottom, top]}
              type="number"
              yAxisId="1"
             />
            <YAxis
              orientation="right"
              allowDataOverflow={true}
              domain={[bottom2, top2]}
              type="number"
              yAxisId="2"
             />
            <Tooltip/>
            <Line yAxisId="1" type='natural' dataKey='cost' stroke='#8884d8' animationDuration={300}/>
            <Line yAxisId="2" type='natural' dataKey='impression' stroke='#82ca9d' animationDuration={300}/>
            {
            	(refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
            }
          </LineChart>
      </div>
    );
  }
}

export default Graph;
