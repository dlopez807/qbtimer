import React from 'react';
import Time from './Time';

import { X } from 'react-feather';

const TimeList = ({ timeList, onRemoveTime }) =>
	<ul reversed className='timelist'>
		{
			timeList.map((time, index) => <li key={index}><Time time={time} /><button onClick={() => onRemoveTime(index)}><X /></button></li>)
		}
	</ul>

export default TimeList;