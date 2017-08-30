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
		average5 = getAverage(timeList, 5);;
		average10 = getAverage(timeList, 10);;
	}
	return (
		<ul className='stats'>
			<li><p className='stats-label'>best</p>
				<p><Time time={best} /></p>
			</li>
			<li><p className='stats-label'>average</p>
				<p><Time time={average} /></p>
			</li>
			<li><p className='stats-label'>average of 5</p>
				<p><Time time={average5} /></p>
			</li>
			<li><p className='stats-label'>average of 10</p>
				<p><Time time={average10} /></p>
			</li>
		</ul>
	);
}

const getAverage = (list, size) => {
	if (list.length < size)
		return 0;
	else {
		size = size || list.length;
		const newList = list.slice(0, size);
		return newList.reduce(function (a, b) {
			return a + b;
		}) / size;
	}
}

export default Stats;