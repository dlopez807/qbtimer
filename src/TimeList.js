var React = require('react');
var Time = require('./Time');

var TimeList = React.createClass({

	render: function() {
		var timeList = this.props.timeList.map(function(time, index) {
			return <li key={index}><Time time={time} /></li>
		});
		return (
			<ol reversed className='timelist'>{timeList}</ol>
		);
	}

});

module.exports = TimeList;