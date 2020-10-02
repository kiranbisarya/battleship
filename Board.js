/**
 * @class
 */
class Board {
	/**
	* @description Represents a single player's board, storing the status of each space and ship as a 2-D array of Space objects.
	* @param {number} rows The number of rows the board will have
	* @param {number} cols The number of columns the board will have
	* @param {number} numShip Number of ships in the current board
	*/
	constructor(rows, cols, numShip) {
		/*
		* @member {array} ships Array of ships in the current board
		* @member {array} cells 2D array of cell containing space objects
		* @member {number} shipSpaces of spaces/cells that are occupied by a ship
		*/
		this.ships = [];
		this.cells = [];
		this.numShips = numShip;
		this.shipSpaces = 0;
		this.rows = rows;
		this.cols = cols;
		for (let row = 0; row < rows; row++) {
			this.cells[row] = []; //Declaring cells as a 2-D array (a 1-D array who's elements point to another array).
			for (let col = 0; col < cols; col++) {
				this.cells[row][col] = new Space(row, col);
			}
		}
	}

	/**
	* @description Render the current state of the board to an HTML table element, optionally showing ships and allowing clicking
	* @param {HTMLTableElement} table The table to render the board to
	* @param {Gameplay} game to use the clickSpace method of
	* @param {boolean} isCurrentPlayer for whether all ship locations should be visible
	* @param {boolean} preventClicking to restrict a player to click again
	**/
	render(table, game, isCurrentPlayer, preventClicking) {
		table.innerHTML = ""; // Remove any existing cells

		// Add letter row
		let letter = 'A';
		let tr = document.createElement("tr");
		let th = document.createElement("th");
		tr.appendChild(th);
		for (let cell of this.cells[0]) {
			let th = document.createElement("th");
			th.innerText = letter;
			tr.appendChild(th);
			letter = String.fromCharCode(letter.charCodeAt(0) + 1); // Increment letter
		}
		table.appendChild(tr);

		let num = 1;
		for (let row of this.cells) {
			let tr = document.createElement("tr");

			// Add number column
			let th = document.createElement("th");
			th.innerText = num;
			tr.appendChild(th);
			num++;

			for (let cell of row) {
				let td = document.createElement("td");
				if (isCurrentPlayer && cell.hasShip) td.classList.add("ship");
				if (cell.isHit && !cell.hasShip) td.classList.add("miss");
				if (cell.isHit && cell.hasShip) td.classList.add("hit");
				if (!preventClicking) {
					// Each cell has its own event listenser that listens for clicks on itself
					td.addEventListener('click', e => game.clickSpace(cell, isCurrentPlayer));
				}
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
	}


	/**
	* @description Render the current state of the board to an HTML table element, optionally showing ships and allowing clicking
	* @param {HTMLTableElement} table The table to render the board to
	* @param {Gameplay} game to use the clickSpace method of
	* @param {boolean} isCurrentPlayer for whether all ship locations should be visible
	* @param {boolean} preventClicking to restrict a player to click again
	**/
	renderAI(table, game, isCurrentPlayer, preventClicking) {
		table.innerHTML = ""; // Remove any existing cells

		// Add letter row
		let letter = 'A';
		let tr = document.createElement("tr");
		let th = document.createElement("th");
		tr.appendChild(th);
		for (let cell of this.cells[0]) {
			let th = document.createElement("th");
			th.innerText = letter;
			tr.appendChild(th);
			letter = String.fromCharCode(letter.charCodeAt(0) + 1); // Increment letter
		}
		table.appendChild(tr);

		let num = 1;
		for (let row of this.cells) {
			let tr = document.createElement("tr");

			// Add number column
			let th = document.createElement("th");
			th.innerText = num;
			tr.appendChild(th);
			num++;
			//cell.row = getRandomInt(9);
			//cell.col = getRandomInt(9);

			for (let cell of row) {
				let td = document.createElement("td");
				if (isCurrentPlayer && cell.hasShip) td.classList.add("ship");
				if (cell.isHit && !cell.hasShip) td.classList.add("miss");
				if (cell.isHit && cell.hasShip) td.classList.add("hit");
				if (!preventClicking) {
					// Each cell has its own event listener that listens for clicks on itself
				//td.addEventListener('click', e => game.clickSpace(cell, isCurrentPlayer));

				//if (game.aiDiff == 1) { //randomly generates a cell to shoot for easy difficulty level
	
				//}
				td.addEventListener('click', e => game.clickSpace(cell, isCurrentPlayer));
				
				//document.getElementById("ai-attack").addEventListener("click", e => game.clickSpace(cell, isCurrentPlayer));
				}
				tr.appendChild(td);
			}
			table.appendChild(tr);
			
		}
		
	}
	
	// TODO: Validate coordinates are within bounds of board
	/**
	* @description Creates a new Ship object and updates this.ships and this.spaces accordingly
	* @param {number} length How many spaces long the ship should be
	* @param {number} row The row coordinate of the top end of the ship
	* @param {number} col The col coordinate of the left end of the ship
	* @param {boolean} isVertical Direction of ship (false = horizontal)
	**/
	placeShip(length, row, col, isVertical) {
		if (this.checkBoundaries(length, row, col, isVertical)) {
			let ship = new Ship(length, row, col, isVertical);
			let coords = ship.listIntersecting();
			if (this.isIntersecting(coords)) {
				return "This location would overlap with another ship. Try again.";
			}
			this.ships.push(ship);
			this.shipSpaces += length;
			for (let coord of coords) {
				this.cells[coord[0]][coord[1]].hasShip = true;
			}
			return true;

		} else {
			return "This location would go off the edge of the board. Try again.";
		}

	}

	checkBoundaries(length, row, col, isVertical) {
		if (length > 1) {
			if (isVertical) {
				if (row+length > this.rows) return false;
			} else {
				if (col+length > this.cols) return false;
			}
		}
		return true;
	}

	/**
	* @description Determines whether the game has been won on this board
	* @return If all ship spaces on this board have been sunk
	**/
	checkWin() {
		return this.shipSpaces == 0;
	}

	/**
	* @return Whether the given row, col coordinates intersect the ship
	**/
	isIntersecting(coords) {
		for (let coord of coords) {
			if (this.cells[coord[0]][coord[1]].hasShip) return true;
		}
		return false;
	}
}