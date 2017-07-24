var React = require('react');
var logo = require('./logo.svg');
require('./App.css');
var Scramble = require('./Scramble');
var Time = require('./Time');
var Stats = require('./Stats');
var TimeList = require('./TimeList');

var FastClick = require('fastclick');
FastClick.attach(document.body);

// by default, start/stop timer using keyboard
var timerElement = document;
var eventStart = 'keydown';
var eventEnd = 'keyup';

var excludedKeyCodes = [
  91,  // left command key
  93  // right command key
];

var App = React.createClass({
  getInitialState: function() {
    return {
      scramble: Scramble.s(),
      time: 0,
      timerRunning: false,
      timerClass: '',
      timeList: [],
      interval: ''
    };
  },
  componentDidMount: function() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      // on mobile, start/stop timer by touching screen
      timerElement = document.getElementsByClassName('app-body')[0];
      eventStart = 'touchstart';
      eventEnd = 'touchend';
    }
    this.chao();
  },
  newScramble: function() {
    this.setState({
        scramble: Scramble.s()
      })
  },
  chao: function() {
    timerElement.removeEventListener(eventEnd, this.chao);
    var lastKeyUpAt = 0;
    var timeHeldDown = 1000;
    var timerReady = false;

    timerElement.addEventListener(eventStart, chao1);
    timerElement.addEventListener(eventEnd, chao2);
    var that = this;
    that.setState({
      timerClass: ''
    });

    function chao1(e) {
      // check if keypressed is in excludedKeyCodes list
      var excludedKeyPressed = false;
      if (e.altKey || e.ctrlKey || e.shiftKey)
        excludedKeyPressed = true;
      if (!excludedKeyPressed) {
        excludedKeyCodes.forEach(function(keyCode) {
          if (e.keyCode == keyCode) {
            excludedKeyPressed = true;
            return;
          }
        })
      }
      if (excludedKeyPressed)
        return;

      // Set key down time to the current time
      var keyDownAt = new Date();
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
  },
  handleKeyUp: function(e) {
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
  },
  handleKeyDown: function() {
    if (this.state.timerRunning) {
      timerElement.addEventListener(eventEnd, this.chao);
      timerElement.removeEventListener(eventStart, this.handleKeyDown);
      clearInterval(this.state.interval);
      var currentTimeList = this.state.timeList;
      currentTimeList.unshift(this.state.time);
      this.newScramble();
      this.setState({
        timerRunning: false,
        timeList: currentTimeList
      })
    }
  },
  startTimer: function() {
    var currentTime = this.state.time;
    var nextTime = currentTime + 1;
    this.setState({
      time: nextTime
    });
  },
  render: function() {
    var appClass = 'app';
    var logoClass = 'app-logo';
    if (this.state.timerRunning) {
      appClass += ' timerActive';
      logoClass += ' animate';

    }
    return (
      <div className={appClass}>
        <div className="app-header">
          <img src={logo} className={logoClass} alt="logo" onClick={this.newScramble} />
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

});

module.exports = App;