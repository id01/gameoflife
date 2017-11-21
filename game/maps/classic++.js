function createHoles() {
	cells[pos(4,4)]=cells[pos(19,4)]=cells[pos(4,19)]=cells[pos(19,19)]=HOLE;
	draw();
}

console.log("Loaded classic++");