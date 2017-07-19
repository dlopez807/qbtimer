var React = require('react');

var TimeList = React.createClass({

	render: function() {
		var timeList = this.props.timeList.map(function(time, index) {
			return <li key={index}>{time}</li>
		});
		return (
			<ol reversed className='timelist'>{timeList}</ol>
		);
	}

});

module.exports = TimeList;