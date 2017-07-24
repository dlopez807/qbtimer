var React = require('react');

var Scramble = React.createClass({
	statics: {
		s: function() {
			return scramble();
		}
	},
	render: function() {
		return (
			<span>{this.s()}</span>
		);
	}

});

module.exports = Scramble;

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

function scramble(len = 25) {
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