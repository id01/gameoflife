function createHoles() {
	for (var i=0; i<gridh; i++) {
		cells[pos(i,gridh/2)]=cells[pos(i,gridh/2-1)]=HOLE;
	}
	draw();
}

console.log("Loaded north and south");
