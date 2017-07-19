var React = require('react');

var Stats = React.createClass({

	render: function() {
		var timeList = this.props.timeList;
		var convertTime = this.props.convertTime;
		var best = 0,
			average = 0,
			average5 = 0,
			average10 = 10;
		if (timeList.length > 0) {
			best = Math.min(...timeList);
			average = getAverage(timeList);
			average5 = getAverage(timeList.slice(0, 5));;
			average10 = getAverage(timeList.slice(0, 10));;
		}
		// var best = timeList.length > 0 ? Math.min(...timeList) : 0;
		// var average = timeList.length > 0 ? getAverage(timeList) : 0;
		// var average5 = timeList.length > 0 ? getAverage(timeList.slice(0, 5)) : 0;;
		// var average10 = timeList.length > 0 ? getAverage(timeList.slice(0, 10)) : 0;;
		return (
			<ul className='stats'>
				<li><p>best</p>
					<p>{convertTime(best)}</p>
				</li>
				<li><p>average</p>
					<p>{convertTime(average)}</p>
				</li>
				<li><p>average of 5</p>
					<p>{convertTime(average5)}</p>
				</li>
				<li><p>average of 10</p>
					<p>{convertTime(average10)}</p>
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