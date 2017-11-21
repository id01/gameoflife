function createHoles() {
	for (var y=0; y<gridh; y++) {
		for (var x=0; x<gridw; x++) {
			if((x+y)%2 ==  0){
				cells[pos(x,y)]=HOLE;	
			}
		}
	}
	draw();
}
console.log("Loaded Checkerboard");
