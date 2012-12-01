var Cell, Maze, m;

Cell = (function() {

  function Cell(x, y, visited, wall, lastPushed) {
    this.x = x;
    this.y = y;
    this.visited = visited != null ? visited : false;
    this.wall = wall != null ? wall : false;
    this.lastPushed = lastPushed != null ? lastPushed : false;
  }

  Cell.prototype.getNeighbors = function(maze) {
    var neighbors;
    neighbors = new Array();
    if (this.y + 1 < 10 && !maze[this.x][this.y + 1].wall && !maze[this.x][this.y + 1].visited) {
      neighbors.push(maze[this.x][this.y + 1]);
    }
    if (this.y - 1 >= 0 && !maze[this.x][this.y - 1].wall && !maze[this.x][this.y - 1].visited) {
      neighbors.push(maze[this.x][this.y - 1]);
    }
    if (this.x + 1 < 10 && !maze[this.x + 1][this.y].wall && !maze[this.x + 1][this.y].visited) {
      neighbors.push(maze[this.x + 1][this.y]);
    }
    if (this.x - 1 >= 0 && !maze[this.x - 1][this.y].wall && !maze[this.x - 1][this.y].visited) {
      neighbors.push(maze[this.x - 1][this.y]);
    }
    return neighbors;
  };

  Cell.prototype.colorElement = function(color) {
    var DomElem;
    DomElem = document.getElementById("" + this.x + "-" + this.y);
    DomElem.innerHTML = "●";
    return DomElem.style.color = color;
  };

  return Cell;

})();

Maze = (function() {

  function Maze() {
    var i, j, mazeString, _i, _j, _k, _ref;
    this.cells = new Array(10);
    for (i = _i = 0, _ref = this.cells.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.cells[i] = new Array(10);
    }
    this.stack = [];
    mazeString = "<table id='maze'>";
    for (i = _j = 0; _j < 10; i = ++_j) {
      mazeString += "<tr>";
      for (j = _k = 0; _k < 10; j = ++_k) {
        this.cells[j][i] = new Cell(j, i);
        mazeString += "<td id='" + j + "-" + i + "' style='width:30px; background-color: white; height:30px; border: 1px solid #ddd; text-align:center;'></td>";
        if (j === 10) {
          mazeString += "<tr/>";
        }
      }
    }
    document.getElementById("contener").innerHTML = mazeString;
  }

  Maze.prototype.create = function() {
    var DomElem, i, j, wallsAmount, x, y, _i, _j;
    for (i = _i = 0; _i < 10; i = ++_i) {
      for (j = _j = 0; _j < 10; j = ++_j) {
        this.cells[j][i].visited = this.cells[j][i].wall = false;
        DomElem = document.getElementById(j + "-" + i);
        DomElem.innerHTML = "";
        DomElem.style.color = "gray";
      }
    }
    this.stack = [];
    wallsAmount = Math.floor(Math.random() * 10) + 20;
    while (wallsAmount) {
      x = Math.floor(Math.random() * 9);
      y = Math.floor(Math.random() * 9);
      if ((this.cells[x][y].wall === false) && !(((x === y && y === 0)) || ((x === y && y === 9)))) {
        this.cells[x][y].wall = true;
        document.getElementById(x + "-" + y).innerHTML = "▤";
        wallsAmount--;
      }
    }
    return this.stack.push(this.cells[0][0]);
  };

  Maze.prototype.solve = function() {
    var currentCell, i, _i, _len, _ref, _ref1;
    while (this.stack.length) {
      currentCell = this.stack.shift();
      currentCell.visited = true;
      currentCell.colorElement("#ddd");
      _ref = currentCell.getNeighbors(this.cells);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        i.lastPushed = currentCell;
        this.stack.push(i);
      }
      if ((currentCell.x === (_ref1 = currentCell.y) && _ref1 === 9)) {
        currentCell.colorElement("red");
        while (true) {
          i = currentCell.lastPushed;
          i.colorElement("red");
          if (i.x === 0 && i.y === 0) {
            break;
          }
          currentCell = i;
        }
        return;
      }
    }
  };

  return Maze;

})();

m = new Maze();

document.getElementById('generateMaze').onclick = function() {
  return m.create();
};

document.getElementById('solveMaze').onclick = function() {
  return m.solve();
};