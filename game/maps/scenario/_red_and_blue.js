function createHoles() {
	for (var i=0; i<grids; i++) {
		cells[i]=HOLE;
	}
	for (var g=0; g<gridw; g++) {
                cells[pos(g,0)]=BLUE;
                cells[pos(g,20)]=RED;
		cells[pos(g,3)]=BLUE;
		cells[pos(g,23)]=RED;
        }
	draw();
}

console.log("Red and Blue");
