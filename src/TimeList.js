import React from 'react';
import Time from './Time';

const TimeList = ({ timeList, onRemoveTime }) =>
	<ul reversed className='timelist'>
		{
			timeList.map((time, index) => <li key={index}><Time time={time} /><button onClick={() => onRemoveTime(index)}>Remove</button></li>)
		}
	</ul>

export default TimeList;