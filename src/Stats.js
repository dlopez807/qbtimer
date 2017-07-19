var React = require('react');
var Time = require('./Time');

var Stats = React.createClass({

	render: function() {
		var timeList = this.props.timeList;
		var best = 0,
			average = 0,
			average5 = 0,
			average10 = 0;
		if (timeList.length > 0) {
			best = Math.min(...timeList);
			average = getAverage(timeList);
			average5 = getAverage(timeList.slice(0, 5));;
			average10 = getAverage(timeList.slice(0, 10));;
		}
		return (
			<ul className='stats'>
				<li><p>best</p>
					<p><Time time={best} /></p>
				</li>
				<li><p>average</p>
					<p><Time time={average} /></p>
				</li>
				<li><p>average of 5</p>
					<p><Time time={average5} /></p>
				</li>
				<li><p>average of 10</p>
					<p><Time time={average10} /></p>
				</li>
			</ul>
		);
	}

});

function getAverage(timelist) {
	return timelist.reduce(function (a, b) {
		return a + b;
	}) / timelist.length;
}


module.exports = Stats;