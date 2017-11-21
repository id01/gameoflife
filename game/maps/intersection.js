function createHoles() {
	for (var y=0; y<gridw; y++) {
		cells[pos(gridw/2,y)]=cells[pos(gridw/2-1,y)]=HOLE;
	}
	 for (var x=0; x<gridh; x++) {
                cells[pos(x,gridh/2)]=cells[pos(x,gridh/2-1)]=HOLE;
        }

	draw();
}

console.log("Loaded Intersection");
