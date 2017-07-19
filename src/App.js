var React = require('react');
var logo = require('./logo.svg');
require('./App.css');
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
      interval: ''
    };
  },
  componentWillMount: function() {
    this.chao();
  },
  chao: function() {
    document.removeEventListener('keyup', this.chao);
    var lastKeyUpAt = 0;
    var timeHeldDown = 1000;
    var timerReady = false;

    document.addEventListener('keydown', chao1);
    document.addEventListener('keyup', chao2);
    var that = this;
    that.setState({
      timerClass: ''
    });

    function chao1() {
      // Set key down time to the current time
      var keyDownAt = new Date();
      that.setState({
        timerClass: ' down'
      });

      // Use a timeout with 1000ms (this would be your X variable)
      setTimeout(function() {
          // Compare key down time with key up time
          if (+keyDownAt > +lastKeyUpAt) {
            //console.log('held down for ' + (timeHeldDown / 1000) + ' seconds')// Key has been held down for x seconds
            if (!timerReady) {
              console.log('timer ready');
              timerReady = true;
              that.setState({
                timerClass: ' down ready'
              });
              document.removeEventListener('keydown', chao1);
              document.removeEventListener('keyup', chao2);
              document.addEventListener('keyup', that.handleKeyUp);
            }
          }
          else
            console.log('still not yet')// Key has not been held down for x seconds
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
      document.addEventListener('keyup', this.chao);
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
  // foo: function() {
  //   document.addEventListener('keyup', this.handleKeyUp);
  //   document.removeEventListener('keyup', this.foo);
  // },
  startTimer: function() {
    var currentTime = this.state.time;
    var nextTime = currentTime + 1;
    this.setState({
      time: nextTime
    });
  },
  convertTime: function(time) {
    var t = time;
    var minutes = Math.floor(t / 6000);
    t = t % 6000; //t - (minutes * 60000);
    var seconds = Math.floor(t / 100);
    t = t % 100;//t - (seconds * 1000);
    //t = Math.floor(t / 10);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    t = Math.trunc(t);
    t = (t < 10) ? "0" + t : t;
    return minutes + ":" + seconds + ":" + t;
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
          {this.convertTime(this.state.time)}
        </p>
        <Stats convertTime={this.convertTime} timeList={this.state.timeList} />
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