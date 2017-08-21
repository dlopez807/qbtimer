import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Time from './Time';
import Stats from './Stats';
import TimeList from './TimeList';

import Cube from 'cube-scrambler';
import FastClick from 'fastclick';
import { Box, List, Trash, CornerDownLeft } from 'react-feather';

FastClick.attach(document.body);
const cubeScramble = () => Cube().scramble().join(" ");

// by default, start/stop timer using keyboard
let timerElement = document;
let eventStart = 'keydown';
let eventEnd = 'keyup';

const scrambleShortcut = 9; // tab
const excludedKeyCodes = [ // keys excluded from starting timer
  scrambleShortcut,
  91,  // left command key
  93  // right command key
];

export default class App extends Component {
  constructor(props) {
    super(props);
    let timeList, showTimeLog;
    if (storageAvailable('localStorage')) {
      timeList = JSON.parse(localStorage.getItem('timeList')) || [];
      showTimeLog = JSON.parse(localStorage.getItem('showTimeLog')) || false;
    }
    else {

    }

    this.state = {
      scramble: cubeScramble(),
      time: 0,
      timerRunning: false,
      timerClass: '',
      timeList: timeList,
      interval: '',
      showTimeLog: showTimeLog
    };
    this.setScrambleState = this.setScrambleState.bind(this);
    this.setTimeListState = this.setTimeListState.bind(this);
    this.toggleShowTimeLogState = this.toggleShowTimeLogState.bind(this);
    this.initializeTimerEvents = this.initializeTimerEvents.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.onRemoveTime = this.onRemoveTime.bind(this);
  }
  setScrambleState() {
    this.setState({
        scramble: cubeScramble()
      })
  }
  setTimeListState(timeList) {
    this.setState({ timeList: timeList });
    if (storageAvailable('localStorage')) {
      localStorage.setItem('timeList', JSON.stringify(timeList));
    }
  }
  toggleShowTimeLogState() {
    const showTimeLogState = this.state.showTimeLog;
    this.setState({
      showTimeLog: !showTimeLogState
    })
    if (storageAvailable('localStorage')) {
      localStorage.setItem('showTimeLog', !showTimeLogState);
    }
  }
  componentDidMount() {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      // on mobile, start/stop timer by touching screen
      timerElement = document.getElementsByClassName('app-body')[0];
      eventStart = 'touchstart';
      eventEnd = 'touchend';
    }
    if (!this.state.showTimeLog)
      this.initializeTimerEvents();
  }
  initializeTimerEvents() {
    timerElement.removeEventListener(eventEnd, this.initializeTimerEvents);
    let lastKeyUpAt = 0;
    const timeHeldDown = 1000;
    let timerReady = false;

    timerElement.addEventListener(eventStart, handleEventStartBeforeTimerReady);
    timerElement.addEventListener(eventEnd, handleEventEndBeforeTimerReady);
    const that = this;
    that.setState({
      timerClass: ''
    });

    function handleEventStartBeforeTimerReady(e) {
      // check if keypressed is in excludedKeyCodes list
      let excludedKeyPressed = false;
      if (e.altKey || e.ctrlKey || e.shiftKey)
        excludedKeyPressed = true;
      if (!excludedKeyPressed) {
        excludedKeyCodes.forEach(function(keyCode) {
          if (e.keyCode === keyCode) {
            excludedKeyPressed = true;
            return;
          }
        })
      }
      if (e.keyCode === scrambleShortcut) {
        e.preventDefault();
        that.setScrambleState();
      }
      if (excludedKeyPressed)
        return;

      // Set key down time to the current time
      const keyDownAt = new Date();
      that.setState({
        timerClass: ' down'
      });

      // Use a timeout with 1000ms (this would be your X variable)
      setTimeout(function() {
          // Compare key down time with key up time
          if (+keyDownAt > +lastKeyUpAt) {
            if (!timerReady) {

              timerReady = true;
              that.setState({
                timerClass: ' down ready'
              });
              timerElement.removeEventListener(eventStart, handleEventStartBeforeTimerReady);
              timerElement.removeEventListener(eventEnd, handleEventEndBeforeTimerReady);
              timerElement.addEventListener(eventEnd, handleEventEnd);
            }
          }
      }, timeHeldDown);
    }
    function handleEventEndBeforeTimerReady() {
      // Set lastKeyUpAt to hold the time the last key up event was fired
      lastKeyUpAt = new Date();
      that.setState({
        timerClass: ''
      });
    }
    function handleEventEnd() {
      if (!that.state.timerRunning) {
        timerElement.removeEventListener(eventEnd, handleEventEnd);
        timerElement.addEventListener(eventStart, handleEventStart);
        that.setState({
          timerRunning: true,
          timerClass: '',
          time: 0,
          interval: setInterval(that.startTimer, 10)
        })      
      }
    }
    function handleEventStart() {
      if (that.state.timerRunning) {
        timerElement.addEventListener(eventEnd, that.initializeTimerEvents);
        timerElement.removeEventListener(eventStart, handleEventStart);
        clearInterval(that.state.interval);
        let currentTimeList = that.state.timeList;
        currentTimeList.unshift(that.state.time);
        that.setScrambleState();
        that.setTimeListState(currentTimeList);
        that.setState({
          timerRunning: false
        })
      }
    }
  }
  startTimer() {
    const nextTime = this.state.time + 1;
    this.setState({
      time: nextTime
    });
  }
  onRemoveTime(index) {
    const updatedList = this.state.timeList;
    updatedList.splice(index, 1);
    this.setTimeListState(updatedList);
  }
  render() {
    let appClass = 'app';
    let logoClass = 'app-logo';
    if (this.state.timerRunning) {
      appClass += ' timerActive';
      logoClass += ' animate';

    }
    if (this.state.showTimeLog)
      return (
        <div className={appClass}>
          <div className="app-header">
            <img
              src={logo}
              className={logoClass}
              alt="logo"
              onClick={this.setScrambleState}
            />
            <h2>{this.state.scramble}</h2>
          </div>
          <div className="app-body">
            <TimeList
              timeList={this.state.timeList}
              onRemoveTime={this.onRemoveTime}
            />
          </div>
          <div className="app-footer">
            <div className='button-container one-half'>
              <button className='clear-times' onClick={() => {this.setTimeListState([]) } }>
                <span className='button-label-text'>Clear Times</span>
                <Trash className='button-label-icon' />
              </button>
            </div>
            <div className='button-container one-half'>
              <button className='back-button' onClick={this.toggleShowTimeLogState}>
                <span className='button-label-text'>Back</span>
                <CornerDownLeft className='button-label-icon' />
              </button>
            </div>
          </div>
        </div>  
      );
    return (
      <div className={appClass}>
        <div className="app-header">
          <img
            src={logo}
            className={logoClass}
            alt="logo"
            //onClick={this.setScrambleState}
          />
          <h2>{this.state.scramble}</h2>
        </div>
        <div className='app-body'>
          <p className={'time-container' + this.state.timerClass}>
            <Time time={this.state.time} />
          </p>
          <Stats timeList={this.state.timeList} />
        </div>
        <div className="app-footer">
          <div className='button-container one-half'>
            <button onClick={this.setScrambleState}>
              <span className='button-label-text'>New Scramble</span>
              <Box className='button-label-icon' />
            </button>
          </div>
          <div className='button-container one-half'>
            <button onClick={this.toggleShowTimeLogState}>
              <span className='button-label-text'>Time Log ({this.state.timeList.length})</span>
              <List className='button-label-icon' />
            </button>
          </div>
          
        </div>
      </div>
    );
  }
}

// from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}