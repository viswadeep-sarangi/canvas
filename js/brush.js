function brushSize(pop_value){
	var size_brush= 15 - (0.135*pop_value);
	if (size_brush < 1.5) { return 1.5;}
	return size_brush;
}
