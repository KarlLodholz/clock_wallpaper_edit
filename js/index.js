"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//wallpaper properties
var hourticks = true,
	minsecticks = true,
	_24hourdial = true,
	_24hourdigitial = true,
	dialsize = 600,
	dialoffset = 110,
	secondradius = 5,		// second hand radius
	minuteradius = 10,		// minute hand radius
	hourradius	 = 15,		// hour hand radius
	tickcolor = "#f4f4f4",
	facecolor = "#252525",
	dialcolor = "#f4f4f4",
	outerdialcolor = "#f4f4f4",
	handcolor = "#45d9fd";

window.wallpaperPropertyListener = {
	applyUserProperties: function (properties) {
		//dial options
		if(properties.hourticks) {
			hourticks = properties.hourticks.value;
		}
		if(properties.minsecticks) {
			minsecticks = properties.minsecticks.value;
		}
		if(properties._24hourdial) {
			_24hourdial = properties._24hourdial.value;
		}
		if(properties._24hourdigitial) {
			_24hourdigitial = properties._24hourdigitial.value;
		}
		if(properties.dialsize) {
			dialsize = properties.dialsize.value;
		}
		if(properties.dialoffset) {
			dialoffset = properties.dialoffset.value;
		}
		//colors
		if(properties.dialcolor) {
			var c = properties.dialcolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			dialcolor = colorString;
		}
		if(properties.outerdialcolor) {
			var c = properties.outerdialcolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			outerdialcolor = colorString;
		}
		if(properties.tickcolor) {
			var c = properties.tickcolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			tickcolor = colorString;
		}
		if(properties.handcolor) {
			var c = properties.handcolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')'; 
			handcolor = colorString;
		}
		if(properties.facecolor) {
			var c = properties.facecolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			facecolor = colorString;
		}
		if(properties.backgroundcolor) {
			var c = properties.backgroundcolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			document.getElementsByTagName("body")[0].style.setProperty('background-color',colorString);
		}
		if(properties.trianglecolor) {
			var c = properties.trianglecolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			document.getElementsByClassName("triangle")[0].style.setProperty('fill',colorString);			
		}
		if(properties.digitalcolor) {
			var c = properties.digitalcolor.value.split(' ').map(function(c) {
				return Math.ceil(c * 255)
			});
			var colorString = 'rgb(' + c + ')';
			document.getElementsByClassName("textTime")[0].style.setProperty('fill',colorString);
		}
	},
};

// utils
// deg to radian
var rad = function rad(a) {
	return Math.PI * (a - 90) / 180;
};

// relative polar coordinates
var rx = function rx(r, a, c) {
	return c + r * Math.cos(rad(a, c));
};

var ry = function ry(r, a, c) {
	return c + r * Math.sin(rad(a));
};

// get hours, minutes, and seconds
var HMS = function HMS(t) {
	return {
		h: t.getHours(),
		m: t.getMinutes(),
		s: t.getSeconds()
	};
};

var pathStringVars = function pathStringVars(c, r, time) {
	// center, radius and time = this.props		
	var _HMS = HMS(time);

	var h = _HMS.h;
	var m = _HMS.m;
	var s = _HMS.s;

	// divide 360 deg by 12hrs, 60min, and 60s

	var hAngFact = 15 * (_24hourdial ? 1 : 2);
	var mAngFact = 6;
	var sAngFact = 6;

	// calc relative coordinates 		
	var hx = rx(r + 12, hAngFact * h, c);
	var hy = ry(r + 12, hAngFact * h, c);
	var mx = rx(r - 38, mAngFact * m, c);
	var my = ry(r - 38, mAngFact * m, c);
	var sx = rx(r - 62, sAngFact * s, c);
	var sy = ry(r - 62, sAngFact * s, c);

	return { hx: hx, hy: hy, mx: mx, my: my, sx: sx, sy: sy };
};

var TextTime = function TextTime(i) {
	var str = i.time.toTimeString().slice(0, 8).replace(/:/g, " : ");
	if(!_24hourdigitial) {
		str = i.time.getHours()%12 + " : " 
		  + ("0"+i.time.getMinutes()).slice(-2) + " : " 
		  + ("0"+i.time.getSeconds()).slice(-2);
	}
	return React.createElement("text", { x: i.x, y: i.y, className: "textTime" }, str);
};

// hour hands
var tickNodes = function tickNodes(c, r) {
	var increment = 15 * (_24hourdial ? 1 : 2);
	var nodes = [];
	var range;
	// hour ticks
	if (hourticks) {
		range = 12 * (_24hourdial ? 2 : 1) + 1
		for (var i = 1; i < range; i++) {
			var ang = i * increment;
			var temp = React.createElement("line", {
				className: "tick",
				stroke: tickcolor,
				x1: rx(r - 5, ang, c),
				x2: rx(r - 22, ang, c),
				y1: ry(r - 5, ang, c),
				y2: ry(r - 22, ang, c),
				key: i
			});
			nodes.push(temp);
		}
	}
	// minute/second ticks
	if (minsecticks) {
		increment = 6;
		for (var i = 1; i < 120; i++) {
			var ang = i * increment;
			var temp = React.createElement("line", {
				className: "tick",
				stroke: tickcolor,
				x1: rx(r - 50, ang, c),
				x2: rx(r - 55, ang, c),
				y1: ry(r - 50, ang, c),
				y2: ry(r - 55, ang, c),
				key: i
			});
			nodes.push(temp);
		}
	}
	return nodes;
};

// populate Ticks
var Ticks = function Ticks(i) {
	return React.createElement(
		"g",
		null,
		tickNodes(i.c, i.r)
	);
};

// triangle component
var Triangle = function Triangle(i) {
	var p = pathStringVars(i.c, i.r, i.time);
	var path = "M" + p.hx + "," + p.hy + " L" + p.mx + "," + p.my + " L" + p.sx + "," + p.sy + " L" + p.hx + "," + p.hy;
	return React.createElement("path", {
		className: "triangle",
		d: path
	});
};

// Secondary circles
var Hands = function Hands(i) {
	var p = pathStringVars(i.c, i.r, i.time);
	return React.createElement(
		"g",
		null,
		React.createElement("circle", { fill: handcolor, stroke: facecolor, cx: p.hx, cy: p.hy, r: hourradius, className: "hands" }),		
		React.createElement("circle", { fill: handcolor, stroke: facecolor, cx: p.mx, cy: p.my, r: minuteradius, className: "hands" }),		
		React.createElement("circle", { fill: handcolor, stroke: facecolor, cx: p.sx, cy: p.sy, r: secondradius, className: "hands" }),		
	);
};

// main container
var Clock = function (_React$Component) {
	_inherits(Clock, _React$Component);

	function Clock() {
		_classCallCheck(this, Clock);

		var _this = _possibleConstructorReturn(this, _React$Component.call(this));

		_this.state = {
			time: new Date()
		};
		return _this;
	}

	Clock.prototype.render = function render() {
		var _this2 = this;

		// var size = dialsize;

		var viewBox = "0 0 " + dialsize + " " + dialsize;

		var mid = dialsize / 2;

		var paddedRadius = (dialsize - dialoffset) / 2 - 40;

		window.setTimeout(function () {
			_this2.setState({
				time: new Date()
			});
		}, 1000);

		return React.createElement(
			"svg", 
			{ xmlns: "http://www.w3.org/svg/2000",
			viewBox: viewBox, width: dialsize, height: dialsize },
			// dashed outer circle
			React.createElement("circle", { stroke: outerdialcolor, cx: mid, cy: mid, r: mid-5, className: "outerRing" }),
			// crown
			React.createElement("circle", { fill: facecolor, stroke: dialcolor, cx: mid, cy: mid, r: mid-15, className: "crown" }),
			// shape connecting the hands make
			React.createElement(Triangle, { c: mid, r: paddedRadius, time: this.state.time }),
			// hands
			React.createElement(Hands, { c: mid, r: paddedRadius, time: this.state.time }),
			// ticks
			React.createElement(Ticks, { c: mid, r: paddedRadius }),
			// digital clock
			React.createElement(TextTime, { time: this.state.time, x: mid, y: mid })
		);
	};

	return Clock;
}(React.Component);

ReactDOM.render(React.createElement(Clock, null), document.querySelector('.clock'));