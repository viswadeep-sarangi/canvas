// TESTING PURPOSES
var maximum_pOperated_value_X=0;
var maximum_pOperated_value_Y=0;

function console_test(){
	var canvas = document.getElementById('test');

	setInterval( function(){
	update_maximum_pOperated_values();
	var innerHTML_statement='Current color -- '+current_pen_color+' -- POp X ='+current_pOperated_value_X+' , POp Y='+current_pOperated_value_Y+' , max X='+maximum_pOperated_value_X+' , max Y='+maximum_pOperated_value_Y;
	canvas.innerHTML=innerHTML_statement;
	}, 10);
}

// TESTING FUNCTION
function update_maximum_pOperated_values(){
	if (current_pOperated_value_X > maximum_pOperated_value_X){
		maximum_pOperated_value_X = current_pOperated_value_X;
	}
	if (current_pOperated_value_Y > maximum_pOperated_value_Y){
		maximum_pOperated_value_Y = current_pOperated_value_Y;
	}
}

$(document).ready(console_test());



function randomColor(){
	var colors=["blue","red","green","black","yellow"];
	var color=colors[Math.floor(Math.random()*colors.length)];
	return color;
}