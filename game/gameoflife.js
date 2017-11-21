// Global constants and vars
const HOLE = -1;
const DEAD = 0;
const RED = 1;
const BLUE = 2;
const NATURAL = 3;
var gridw = 24; // Grid width
var gridh = 24; // Grid height
var grids = gridw*gridh; // Grid size
var cells = new Int8Array(grids); // The grid
var turn = 0; // Whose turn is it? This is set to 1 in the finish script.
var burning = false; // Am I burning?
var actionButton = null; // Action Button
var gameLog = null; // Game Log

function createHoles() { console.log("Using Classic Map."); } // This will be declared in final

// Returns where the specified x and y are in the cells array.
function pos(x, y) {
	return x+y*gridw;
}

// Changes the turn
function changeTurn() {
	turn = (turn<<1)%3;
	actionButton.onclick = void(0);
	actionButton.style.backgroundColor = "#ffffff";
	actionButton.innerHTML = "Select a cell";
	actionButton.disabled = true;
}

// Function for individual cells to be selected or deselected
function select() {
	actionButton.disabled = false;
	if (burning && !this.classList.contains("deadcell")) { // If burning and this is a live cell, select for burning
		if (turn == RED && this.classList.contains("redcell")) {
			this.classList.add("toburn");
		} else if (turn == BLUE && this.classList.contains("bluecell")) {
			this.classList.add("toburn");
		} else {
			gameLog.innerHTML += "You can only burn your own cells!<br/>\n";
		}
	} else { // Otherwise, set burning to false, deselect all cells, and select this one.
		burning = false;
		var cells = document.querySelectorAll(".cell");
		for (var i=0; i<cells.length; i++) {
			cells[i].classList.remove("selected");
			cells[i].classList.remove("toburn");
		}
		// Change actionButton to say and do what we want
		if (this.classList.contains("deadcell")) {
			actionButton.innerHTML = "Burn!";
			actionButton.onclick = burn;
			actionButton.style.backgroundColor = "#f49242";
		} else {
			actionButton.innerHTML = "Kill!";
			actionButton.onclick = kill;
			actionButton.style.backgroundColor = "#999999";
		}
		this.classList.add("selected");
	}
}

// Returns an array of [ALL, RED, BLUE] neighbors.
function getNeighbors(cellx, celly) {
	var neighbors = [0, 0, 0];
	for (var x=cellx-1; x<=cellx+1; x++) {
		for (var y=celly-1; y<=celly+1; y++) {
			if (x != cellx || y != celly) {
				if (!(x<0 || y<0 || x>=gridw || y>=gridh)) {
					if (cells[pos(x,y)] > 0) {
						neighbors[0]++;
						neighbors[cells[pos(x,y)]]++;
					}
				}
			}
		}
	}
	return neighbors;
}

// Draws the grid and bottom bar
function draw() {
	var cellTable, newRow, newElement, neighbors;
	cellTable = document.getElementById('celltable');
	cellTable.innerHTML = "";
	// Generate table
	for (var y=0; y<gridh; y++) {
		newRow = document.createElement('tr');
		for (var x=0; x<gridw; x++) {
			// Get neighbors
			neighbors = getNeighbors(x, y);
			// Create element
			newElement = document.createElement('td');
			newElement.onclick = select;
			newElement.setAttribute("x", x);
			newElement.setAttribute("y", y);
			// Change classes according to array
			if (cells[pos(x,y)] == RED) {
				newElement.setAttribute("class", "cell redcell");
				if (neighbors[0] == 3 || neighbors[0] == 2) {
					newElement.style.color = "#dddddd";
				} else {
					newElement.style.color = "#000000";
				}
				newElement.innerHTML = neighbors[0];
			} else if (cells[pos(x,y)] == BLUE) {
				newElement.setAttribute("class", "cell bluecell");
				if (neighbors[0] == 3 || neighbors[0] == 2) {
					newElement.style.color = "#dddddd";
				} else {
					newElement.style.color = "#000000";
				}
				newElement.innerHTML = neighbors[0];
			} else if (cells[pos(x,y)] == DEAD) {
				newElement.setAttribute("class", "cell deadcell");
				if (neighbors[0] == 3) {
					if (neighbors[RED] >= 2) {
						newElement.style.color = "#ff0000";
					} else if (neighbors[BLUE] >= 2) {
						newElement.style.color = "#0000ff";
					} else {
						newElement.style.color = "#00ff00";
					}
				} else {
					newElement.style.color = "#000000";
				}
				newElement.innerHTML = neighbors[0];
			} else if (cells[pos(x,y)] == NATURAL) {
				newElement.setAttribute("class", "cell naturalcell");
				if (neighbors[0] == 3 || neighbors[0] == 2) {
					newElement.style.color = "#dddddd";
				} else {
					newElement.style.color = "#000000";
				}
				newElement.innerHTML = neighbors[0];
			} else {
				newElement.setAttribute("class", "hole");
				newElement.onclick = void(0);
			}
			// Append element to row
			newRow.appendChild(newElement);
		}
		// Finalize row and append to celltable
		newElement = document.createElement("br");
		newRow.appendChild(newElement);
		cellTable.appendChild(newRow);
	}
	// Draw turn
	document.getElementById('turnspan').innerHTML = "Turn: ";
	if (turn == RED) {
		document.getElementById('turnspan').innerHTML += "RED";
		document.getElementById('turnspan').style.color = "red";
	} else {
		document.getElementById('turnspan').innerHTML += "BLUE";
		document.getElementById('turnspan').style.color = "blue";
	}
	// Draw stats
	var redNum = document.querySelectorAll(".redcell").length, blueNum = document.querySelectorAll(".bluecell").length, natNum = document.querySelectorAll(".naturalcell").length;
	document.getElementById("redcount").innerHTML = redNum;
	document.getElementById("bluecount").innerHTML = blueNum;
	document.getElementById("natcount").innerHTML = natNum;
	document.getElementById("allcount").innerHTML = redNum+blueNum+natNum;
	// Change bar width
	var redBar = document.getElementById('redbar'), blueBar = document.getElementById('bluebar'), natBar = document.getElementById('natbar');
	redBar.style.width = ((redNum/(redNum+blueNum+natNum))*800) + "px";
	natBar.style.width = ((natNum/(redNum+blueNum+natNum))*800) + "px";
	blueBar.style.width = ((blueNum/(redNum+blueNum+natNum))*800) + "px";
	// Check if player has won
	if (redNum + blueNum == 0) {
		if (natNum == 0) {
			document.body.innerHTML = "The world has been destroyed!";
		} else {
			document.body.innerHTML = "Nature rules all!";
		}
	} else if (blueNum == 0) {
			document.body.innerHTML = "The red cells have dominated!";
	} else if (redNum == 0) {
		document.body.innerHTML = "The blue cells are victorious!";
	}
}

// Single iteration
function iterate() {
	// Declare vars
	var aftergrid = new Int8Array(grids);
	var currNeighbors;
	var currPos;
	// Generate aftergrid
	for (var y=0; y<gridh; y++) {
		for (var x=0; x<gridw; x++) {
			// Get position and neighbors for each cell
			currPos = pos(x,y);
			currNeighbors = getNeighbors(x, y);
			// Evaluate next turn
			if (cells[currPos] == 0) { // Dead
				if (currNeighbors[0] == 3) {
					if (currNeighbors[RED] >= 2) {
						aftergrid[currPos] = RED;
					} else if (currNeighbors[BLUE] >= 2) {
						aftergrid[currPos] = BLUE;
					} else {
						aftergrid[currPos] = NATURAL;
					}
				} else {
					aftergrid[currPos] = 0;
				}
			} else if (cells[currPos] > 0) { // Alive
				if (!(currNeighbors[0] == 2 || currNeighbors[0] == 3)) {
					aftergrid[currPos] = 0;
				} else {
					aftergrid[currPos] = cells[currPos];
				}
			} else {
				aftergrid[currPos] = cells[currPos];
			}
		}
	}
	cells = aftergrid; // Apply changes
	burning = false; // Un-burn
	draw(); // Draws grid
}

// Function to spawn the grid
function spawn() {
	// Do this for the first half of cells, and mirror.
	for (var i=0; i<grids/2; i++) {
		cells[i] = Math.floor(Math.random()*6); // Get random integer between 0 and 2
		if (cells[i] >= 4) { cells[i] = 0; }
		if (cells[i] == 3 && Math.random() > 0.65) { cells[i] = 0; }
		cells[grids-i-1] = (2*cells[i]-(3*Math.floor(cells[i]/2))); // Dead doesn't change, Red becomes Blue, Blue becomes Red
	}
	// Do one iteration to stabalize everything a bit
	iterate();
	// Check how many cells there are. If there are not enough, respawn
	if (document.querySelectorAll(".redcell").length + document.querySelectorAll(".bluecell").length < Math.pow(gridw*gridh, 0.75)*0.9 || document.querySelectorAll(".naturalcell").length < Math.pow(gridw*gridh, 0.75)*0.4) {
		setTimeout(spawn, 50);
	} else {
		// Makes up for blues having the second turn
		var deadCells = document.querySelectorAll(".deadcell");
		var toChange = deadCells[Math.floor(Math.random()*deadCells.length)];
		var changeX = parseInt(toChange.getAttribute('x')), changeY = parseInt(toChange.getAttribute('y'));
		cells[pos(changeX, changeY)] = BLUE;
		gameLog.innerHTML += "Blue Extra Cell @ (" + changeX + ", " + changeY + ")";
	}
	// Create the holes
	createHoles();
	draw();
}

// Function to kill things
function kill() {
	// Kills selected cell, then iterates.
	var selectedElement = document.querySelector(".selected");
	if (selectedElement != null) {
		if (selectedElement.classList.contains("deadcell")) {
			gameLog.innerHTML += "You cannot kill a dead cell.<br/>\n";
		} else {
			// Do kill
			var x = parseInt(selectedElement.getAttribute('x')), y = parseInt(selectedElement.getAttribute('y'));
			cells[pos(x,y)] = DEAD;
			if (turn == RED) {
				gameLog.innerHTML += "RED killed a cell at (" + x + ", " + y + ")<br/>\n";
			} else {
				gameLog.innerHTML += "BLUE killed a cell at (" + x + ", " + y + ")<br/>\n";
			}
			draw();
			// Change turn
			changeTurn();
			setTimeout(iterate, 333);
		}
	}
}

// Function to burn things
function burn() {
	if (!burning) { // Enters "burn mode" if not burning
		var selectedElement = document.querySelector(".selected");
		if (selectedElement != null && selectedElement.classList.contains("deadcell")) {
			gameLog.innerHTML += "Player is burning!<br/>\n";
			burning = true;
		} else {
			gameLog.innerHTML += "Select an empty tile to start burn.<br/>\n";
		}
	} else { // If burning, check burn.
		var burningElements = document.querySelectorAll(".toburn");
		if (burningElements.length >= 2) { // If legal burn, burn.
			var selectedElement = document.querySelector(".selected");
			var x = parseInt(selectedElement.getAttribute('x')), y = parseInt(selectedElement.getAttribute('y'));
			if (turn == RED) {
				gameLog.innerHTML += "RED burned some cells to create one at (" + x + ", " + y + ")<br/>\n";
			} else {
				gameLog.innerHTML += "BLUE burned some cells to create one at (" + x + ", " + y + ")<br/>\n";
			}
			cells[pos(x,y)] = turn;
			for (var i=0; i<burningElements.length; i++) {
				x = parseInt(burningElements[i].getAttribute('x')), y = parseInt(burningElements[i].getAttribute('y'));
				cells[pos(x,y)] = DEAD;
			}
			// Change turn
			draw();
			changeTurn();
			setTimeout(iterate, 333);
		} else { // If illegal, print message.
			gameLog.innerHTML += "Not enough cells! Select at least 2 cells for burning.<br/>\n";
		}
	}
}

// Setup Board
function setupFunction() {
	actionButton = document.getElementById("actionbutton");
	gameLog = document.getElementById("gamelog");
	changeTurn(); turn = RED;
	var mapScript = document.createElement("script");
	mapScript.onload = void(0);
	if (window.location.search.replace('?', '') != "") {
		mapScript.src = "maps/"+window.location.search.replace('?', '')+".js";
		mapScript.onload = spawn;
		document.body.appendChild(mapScript);
	} else {
		setTimeout(spawn, 1);
	}
}