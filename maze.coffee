class Cell
  constructor: (@x,@y, @visited = false, @wall = false, @lastPushed = false)->

  getNeighbors: (maze) ->
    neighbors = new Array()
    if @y+1<10 and !maze[@x][@y+1].wall and !maze[@x][@y+1].visited
      neighbors.push(maze[@x][@y+1])
    if @y-1>=0 and !maze[@x][@y-1].wall and !maze[@x][@y-1].visited
      neighbors.push(maze[@x][@y-1])
    if @x+1<10 and !maze[@x+1][@y].wall and !maze[@x+1][@y].visited
      neighbors.push(maze[@x+1][@y])
    if @x-1>=0 and !maze[@x-1][@y].wall and !maze[@x-1][@y].visited
      neighbors.push(maze[@x-1][@y])
    return neighbors

  colorElement: (color) ->
    DomElem = document.getElementById("#{@x}-#{@y}")
    DomElem.innerHTML = "●"
    DomElem.style.color = color

class Maze
  constructor: ->  
    @cells = new Array(10)
    for i in [0...@cells.length]
      @cells[i] = new Array(10)
    @stack = []
    
    mazeString = "<table id='maze'>"
    for i in [0...10]
      mazeString += "<tr>"
      for j in [0...10]
        @cells[j][i] = new Cell(j,i)
        mazeString += "<td id='#{j}-#{i}' style='width:20px; height:20px; border: 1px solid #ddd; text-align:center;'></td>"
        if j == 10
          mazeString += "<tr/>"

    document.getElementById("contener").innerHTML = mazeString
    
  create: ->
    for i in [0...10]
      for j in [0...10] 
        @cells[j][i].visited = @cells[j][i].wall = false
        DomElem = document.getElementById(j+"-"+i)
        DomElem.innerHTML = ""
        DomElem.style.color = "gray"
    
    @stack = []

    wallsAmount = Math.floor((Math.random()*10))+20

    while wallsAmount
      x = Math.floor(Math.random()*9)
      y = Math.floor(Math.random()*9)
      if (@cells[x][y].wall == false) and !((x == y == 0) or (x == y == 9))
        @cells[x][y].wall = true
        document.getElementById(x+"-"+y).innerHTML = "▤"
        wallsAmount--

    @stack.push(@cells[0][0])

  solve: ->
    while @stack.length
      currentCell = @stack.shift()
      currentCell.visited = true
      currentCell.colorElement("#ddd")
      
      for i in currentCell.getNeighbors(@cells)
        i.lastPushed = currentCell
        @stack.push(i)

      if(currentCell.x == currentCell.y == 9)
        currentCell.colorElement("red")
        while true
          i = currentCell.lastPushed
          i.colorElement("red")
          if i.x == 0 && i.y == 0
            break
          currentCell = i
        return

m = new Maze()
document.getElementById('generateMaze').onclick =  -> m.create()
document.getElementById('solveMaze').onclick =  -> m.solve()
