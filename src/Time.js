import React from 'react';

const Time = ({ time, timer }) => <span className='time'>{convertTime(time, timer)}</span>

function convertTime(time, timer) {
	if (time === 0 && !timer)
		return '-';
	var t = time;
	var minutes = Math.floor(t / 6000);
	t = t % 6000;
	var seconds = Math.floor(t / 100);
	t = t % 100;

	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	t = Math.trunc(t);
	t = (t < 10) ? "0" + t : t;
	return minutes + ":" + seconds + ":" + t;
}

export default Time;