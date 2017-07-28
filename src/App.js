import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Time from './Time';
import Stats from './Stats';
import TimeList from './TimeList';

import Cube from 'cube-scrambler';
import FastClick from 'fastclick';

FastClick.attach(document.body);
const cubeScramble = () => Cube().scramble().join(" ");

// by default, start/stop timer using keyboard
let timerElement = document;
let eventStart = 'keydown';
let eventEnd = 'keyup';

const excludedKeyCodes = [
  91,  // left command key
  93  // right command key
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scramble: cubeScramble(),
      time: 0,
      timerRunning: false,
      timerClass: '',
      timeList: [],
      interval: ''
    };
    this.setScrambleState = this.setScrambleState.bind(this);
    this.chao = this.chao.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }
  setScrambleState() {
    this.setState({
        scramble: cubeScramble()
      })
  }
  componentDidMount() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      // on mobile, start/stop timer by touching screen
      timerElement = document.getElementsByClassName('app-body')[0];
      eventStart = 'touchstart';
      eventEnd = 'touchend';
    }
    this.chao();
  }
  chao() {
    timerElement.removeEventListener(eventEnd, this.chao);
    let lastKeyUpAt = 0;
    const timeHeldDown = 1000;
    let timerReady = false;

    timerElement.addEventListener(eventStart, chao1);
    timerElement.addEventListener(eventEnd, chao2);
    const that = this;
    that.setState({
      timerClass: ''
    });

    function chao1(e) {
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
              timerElement.removeEventListener(eventStart, chao1);
              timerElement.removeEventListener(eventEnd, chao2);
              timerElement.addEventListener(eventEnd, that.handleKeyUp);
            }
          }
      }, timeHeldDown);
    }
    function chao2() {
      // Set lastKeyUpAt to hold the time the last key up event was fired
      lastKeyUpAt = new Date();
      that.setState({
        timerClass: ''
      });
    }
  }
  handleKeyUp(e) {
    if (!this.state.timerRunning) {
      timerElement.removeEventListener(eventEnd, this.handleKeyUp);
      timerElement.addEventListener(eventStart, this.handleKeyDown);
      this.setState({
        timerRunning: true,
        timerClass: '',
        time: 0,
        interval: setInterval(this.startTimer, 10)
      })      
    }
  }
  handleKeyDown() {
    if (this.state.timerRunning) {
      timerElement.addEventListener(eventEnd, this.chao);
      timerElement.removeEventListener(eventStart, this.handleKeyDown);
      clearInterval(this.state.interval);
      let currentTimeList = this.state.timeList;
      currentTimeList.unshift(this.state.time);
      this.setScrambleState();
      this.setState({
        timerRunning: false,
        timeList: currentTimeList
      })
    }
  }
  startTimer() {
    const nextTime = this.state.time + 1;
    this.setState({
      time: nextTime
    });
  }
  render() {
    let appClass = 'app';
    let logoClass = 'app-logo';
    if (this.state.timerRunning) {
      appClass += ' timerActive';
      logoClass += ' animate';

    }
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
        <div className='app-body'>
          <p className={'time-container' + this.state.timerClass}>
            <Time time={this.state.time} />
          </p>
          <Stats timeList={this.state.timeList} />
          <TimeList timeList={this.state.timeList} />
        </div>
      </div>
    );
  }
}