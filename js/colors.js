function getHue(value){
	var hue_value=180;
	if (value <= 57) {
		hue_value = value*value/25;
	} else if (value <=160) {
		hue_value = ((-2)*value*value/375) + (8*value/5) + 60 ;
	}

	hue_value = 180 - hue_value;
	return hue_value;
}

function getLightness(value) {
	var lightnessValue = 65 - ((value-80)*(value-80)*(value-80)/20480);
	if (lightnessValue < 50 ) { return 50;}
	return lightnessValue;
}

function getAlpha(value){
	var alpha = value*(0.006);
	if (alpha > 0.6) { return 0.6; }
	return alpha;
}




function getColor(pop_value) {
	var hue=getHue(pop_value);
	var lightness=getLightness(pop_value);
	var color_value = 'hsl('+hue+',100%,'+lightness+'%)';
	return color_value;
}
function getColorWithAlpha(pop_value){
	var simple_color=getColor(pop_value);
	simple_color=simple_color.replace("l","la");
	simple_color=simple_color.substring(0,simple_color.length-1);
	var alpha=getAlpha(pop_value);
	var color=simple_color+','+alpha+')';
	return color;
}