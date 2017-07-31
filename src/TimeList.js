import React from 'react';
import Time from './Time';

const TimeList = ({ timeList }) =>
	<ol reversed className='timelist'>
		{
			timeList.map((time, index) => <li key={index}><Time time={time} /></li>)
		}
	</ol>

export default TimeList;