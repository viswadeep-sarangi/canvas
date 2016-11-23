    // Defining the constant Global variable values
  var window_size_in_ms=100;
  var sampling_rate_in_ms=5; 

  // Declaring global variables
  var mouse = {x: 0, y: 0};
  var last_mouse = {x: 0, y: 0};
  var window_size_in_points=Math.floor(window_size_in_ms/sampling_rate_in_ms);
  var current_pOperated_value_X=0;
  var current_pOperated_value_Y=0;
  var current_pen_color='hsl(180,100%,100%)';
  var raw_points_X_timer=[];
  var raw_points_Y_timer=[];
  var sampling_function=null;
  var pOperate_timer_function=null;

  // GLOBALLY USED VARIABLES
  var canvas = document.querySelector('#paint');
  var ctx = canvas.getContext('2d');  
  var sketch = document.querySelector('#sketch');

function canvasFunction() {
  
  var canvas = document.querySelector('#paint');
  var ctx = canvas.getContext('2d');
  
  var sketch = document.querySelector('#sketch');
  var sketch_style = getComputedStyle(sketch);
  var sketch_width = parseInt(sketch_style.getPropertyValue('width'));
  var sketch_height = parseInt(sketch_style.getPropertyValue('height'));
  canvas.width = sketch_width;
  canvas.height = sketch_height;
  
  // Pencil Points
  var ppts = [];
  
  /* Mouse Capturing Work */
  canvas.addEventListener('mousemove', function(e) {
	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
  }, false);
  
  
  /* Drawing on Paint App */
  // Defining the variable values
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'blue';
  ctx.fillStyle = 'blue';
  ctx.shadowBlur = 10;
  
  canvas.addEventListener('mousedown', function(e) {

	// TIMER FUNCTIONS
	sampling_function = setInterval(timer_sampling_function, sampling_rate_in_ms);
	pOperate_timer_function = setInterval(POperate, window_size_in_ms);

	canvas.addEventListener('mousemove', onPaint, false);
	mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	
	ppts.push({x: mouse.x, y: mouse.y});	
	onPaint();
  }, false);
  

  document.addEventListener('mouseup', clearCanvasListeners, false);
  // canvas.addEventListener('mouseout', clearCanvasListeners, false);
  
  function clearCanvasListeners(){
  	// REMOVING TIMER FUNCTIONS
  	clearInterval(sampling_function);
  	clearInterval(pOperate_timer_function);
    raw_points_X_timer=[];
    raw_points_Y_timer=[];
    // REMOVING THEIR  onPaint EVENT LISTENER FUNCTION FOR mousemove
	canvas.removeEventListener('mousemove', onPaint, false);	
	//resetting variables and changes
	ppts = [];
	sketch.style.backgroundColor = '#ffffff';
	current_pOperated_value_X=0;
    current_pOperated_value_Y=0;
    current_pen_color='hsl(180,100%,100%)';
  };

  var onPaint = function() { 
	// TAKING AN AVERAGE P-OPERATOR VALUE
	var average_pop_value=(current_pOperated_value_X+current_pOperated_value_Y)/2;
	current_pen_color=getColor(average_pop_value);
	ctx.strokeStyle = ctx.fillStyle = ctx.shadowColor = current_pen_color;
	ctx.lineWidth = brushSize(average_pop_value);
	sketch.style.backgroundColor = getColorWithAlpha(average_pop_value);

	// Saving all the points in an array
	ppts.push({x: mouse.x, y: mouse.y});
	
	if (ppts.length < 10) {
	  var b = ppts[0];
	  ctx.beginPath();
	  //ctx.moveTo(b.x, b.y);
	  //ctx.lineTo(b.x+50, b.y+50);
	  ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
	  ctx.fill();
	  ctx.closePath();
	  
	  return;
	};
	
	//keeping only the last 10 items in the array
	ppts = ppts.slice(ppts.length - 10);

	ctx.beginPath();
	ctx.moveTo(ppts[0].x, ppts[0].y);
	
	for (var i = 1; i < ppts.length - 2; i++) {
	  var c = (ppts[i].x + ppts[i + 1].x) / 2;
	  var d = (ppts[i].y + ppts[i + 1].y) / 2;
	  
	  ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
	}
	
	// For the last 2 points
	ctx.quadraticCurveTo(
	  ppts[i].x,
	  ppts[i].y,
	  ppts[i + 1].x,
	  ppts[i + 1].y
	);

	ctx.stroke();
  };
}

var POperate = function() {
	var pOperated_array_X=[];
	var pOperated_array_Y=[];

	var single_diff_X=single_differentiate(raw_points_X_timer);
	var single_diff_Y=single_differentiate(raw_points_Y_timer);
	var double_diff_X=single_differentiate(single_diff_X);
	var double_diff_Y=single_differentiate(single_diff_Y);
	// performed multiplication of corresponding elements in single and double differentiation
	for (var i = 0; i < double_diff_X.length - 1; i++) {
	  pOperated_array_X.push(Math.abs(double_diff_X[i]*single_diff_X[i]));
	  pOperated_array_Y.push(Math.abs(double_diff_Y[i]*single_diff_Y[i]));
	}
	// creating the reduce function here
	function add(a,b) { return a+b; }
	//reducing the whole array in a single command
	current_pOperated_value_X=pOperated_array_X.reduce(add,0);
	current_pOperated_value_Y=pOperated_array_Y.reduce(add,0);
	//making the pOperated values width and height independant
	current_pOperated_value_X=current_pOperated_value_X/canvas.width;
	current_pOperated_value_Y=current_pOperated_value_Y/canvas.height;

	trim_raw_inputs();
}

function single_differentiate(input){
	var output=[];
	for (var i = 0; i < input.length - 2; i++) {
	  output.push(input[i+1]-input[i]);
	}
	return output;
}

var timer_sampling_function=function(){
	raw_points_X_timer.push(mouse.x);
	raw_points_Y_timer.push(mouse.y);
};

function trim_raw_inputs() {	
	if (raw_points_X_timer.length > 2*window_size_in_points) {
		raw_points_X_timer.splice(0,window_size_in_points);
		raw_points_Y_timer.splice(0,window_size_in_points);
	}
};

$(document).ready(canvasFunction());