import React from 'react';
import Time from './Time';

const TimeList = ({ timeList }) =>
	<ol reversed className='timelist'>
		{
			timeList.map(function(time, index) {
				return <li key={index}><Time time={time} /></li>
			})
		}
	</ol>

export default TimeList;