import React from 'react';
import Time from './Time';

const Stats = ({ timeList }) => {
	let best = 0,
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

const getAverage = timelist => 
	timelist.reduce(function (a, b) {
		return a + b;
	}) / timelist.length;

export default Stats;