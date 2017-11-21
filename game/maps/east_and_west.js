function createHoles() {
	for (var i=0; i<gridw; i++) {
		cells[pos(gridw/2,i)]=cells[pos(gridw/2-1,i)]=HOLE;
	}
	draw();
}

console.log("Loaded east and west");