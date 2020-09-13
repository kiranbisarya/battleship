/**
* @class
* @description Represents a single space on a board
*/
class Space {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.hasShip = false;
		this.isHit = false;
	}
}