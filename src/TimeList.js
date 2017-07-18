var React = require('react');

var TimeList = React.createClass({

	render: function() {
		var timeList = this.props.timeList.map(function(time, index) {
			return <li key={index}>{time}</li>
		});
		return (
			<ul>{timeList}</ul>
		);
	}

});

module.exports = TimeList;