var React = require('react');
var logo = require('./logo.svg');
require('./App.css');
var Time = require('./Time');
var Stats = require('./Stats');
var TimeList = require('./TimeList');

var App = React.createClass({
  getInitialState: function() {
    return {
      scramble: genScramble3(),
      time: 0,
      timerRunning: false,
      timerClass: '',
      timeList: [],
      timerReady: false,
      interval: '',
      lastKeyUpAt: 0
    };
  },
  componentWillMount: function() {
    this.setupTimer();
  },
  setupTimer: function() {
    this.setState({
      timerClass: '',
      timerReady: false,
      lastKeyUpAt: 0
    });
    var lastKeyUpAt = 0;
    console.log('bacon')
    document.removeEventListener('keyup', this.setupTimer);
    document.addEventListener('keydown', this.handleKeyDownBeforeTimerReady);
    document.addEventListener('keyup', this.handleKeyUpBeforeTimerReady);
  },
  handleKeyDownBeforeTimerReady: function() {
    // Set key down time to the current time
    var keyDownAt = new Date();
    var timeHeldDown = 1000;
    this.setState({
      timerClass: ' down'
    });
    var that = this;

    console.log(keyDownAt, this.state.lastKeyUpAt)
    // Use a timeout with 1000ms (this would be your X variable)
    setTimeout(function() {
        console.log('in timeout')
        // Compare key down time with key up time
        if (+keyDownAt > +that.state.lastKeyUpAt) {
          //console.log('held down for ' + (timeHeldDown / 1000) + ' seconds')// Key has been held down for x seconds
          if (!that.state.timerReady) {
            console.log('timer ready');
            that.setState({
              timerClass: ' down ready',
              timerReady: true
            });
            document.removeEventListener('keydown', that.handleKeyDownBeforeTimerReady);
            document.removeEventListener('keyup', that.handleKeyUpBeforeTimerReady);
            document.addEventListener('keyup', that.handleKeyUp);
          }
        }
        else
          console.log('still not yet')// Key has not been held down for x seconds
    }, timeHeldDown);
  },
  handleKeyUpBeforeTimerReady: function() {
    // Set lastKeyUpAt to hold the time the last key up event was fired
    var newDate = new Date();
    this.setState({
      timerClass: '',
      lastKeyUpAt: newDate
    });
  },
  handleKeyUp: function(e) {
    if (!this.state.timerRunning) {
      document.removeEventListener('keyup', this.handleKeyUp);
      document.addEventListener('keydown', this.handleKeyDown);
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
      document.addEventListener('keyup', this.setupTimer);
      document.removeEventListener('keydown', this.handleKeyDown);
      clearInterval(this.state.interval);
      var currentTimeList = this.state.timeList;
      currentTimeList.unshift(this.state.time);
      this.setState({
        scramble: genScramble3(),
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
    var appClass = 'App';
    var logoClass = 'App-logo';
    if (this.state.timerRunning) {
      appClass += ' timerActive';
      logoClass += ' animate';

    }
    return (
      <div className={appClass}>
        <div className="App-header">
          <img src={logo} className={logoClass} alt="logo" />
          <h2>{this.state.scramble}</h2>
        </div>
        <p className={'App-intro' + this.state.timerClass}>
          <Time time={this.state.time} />
        </p>
        <Stats timeList={this.state.timeList} />
        <TimeList timeList={this.state.timeList} />
      </div>
    );
  }

});

module.exports = App;

/*
  scramble
 */
Array.prototype.selectRandom = function() {
  return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function(val){
  for (var x in this) {
    if (this[x] == val) {this.splice(this.indexOf(val), 1)}
  }
}

var opposite = new Object;
opposite["R"] = "L"; opposite["L"] = "R";
opposite["U"] = "D"; opposite["D"] = "U";
opposite["F"] = "B"; opposite["B"] = "F";

function genScramble3(len = 25) {
  var final = [];
  var alter = ["", "'", "2"];
  var before; var beforeThat;
  
  while (len > 0) {
    var poss = ["R", "L", "U", "D", "F", "B"];
    poss.remove(before); // Avoids things like R2 R'
    if (opposite[before] == beforeThat) { poss.remove(beforeThat); }
        // Avoids things like F' B2 F'
    
    var move = poss.selectRandom();
    beforeThat = before; before = move;
    final.push(move);
    len -= 1; 
        
  }
    
  for (var m = 0; m < final.length; m++) {
    if (m < 10) {
      if (final[m] == "U" || final[m] == "D"){
        final[m] = final[m] + alter.selectRandom();
      }
      else { 
        final[m]  = final[m] + "2";
      }
    }
    
    else {
      final[m] = final[m] + alter.selectRandom();
    }
  }
  
  return final.join(" ");
}