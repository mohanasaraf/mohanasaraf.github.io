class aStar{
	constructor(grid, startPos, endPos, obstacles)
	{
		this.grid = grid;
		this.startPos=startPos;
		this.endPos=endPos; 
		this.obstacles = obstacles;
		this.coordinates = [];//to store the x and y coordinates of each cell
	}

	search(){
		var parent = []; //to store the parent of each node
		var distFromStart = []; 
		var f =[];
		var Heuristic = []; //To store Heuristic distance of each node - distance from the current node to the end node 
		var map = []; //to keep a track of all the nodes
		var current = 0;
		var path = [];

		// console.log("Grid:");
		// console.log(grid);
		// console.log("Start: " + startPos);
		// console.log("Goal: " + endPos);
		// console.log("Obstacles:");
		// console.log(obstacles);

		
		

		/*for initalizing the parent and distance from start and F for each node */
		for(var i =0; i< grid.length; i++){
			map[i] = 1; //indicating this is a free cell - first we mark all the cells as 1
			distFromStart[i] = Infinity;
			f[i] = Infinity;
			parent[i] = null;

		}

		for(var i = 0; i< obstacles.length; i++){
			var j = obstacles[i];
			map[j-1] = 2; //indicating this is an obstacle - (and -1 as the indices of an array starts from 0)
		}

		map[startPos-1]= 5; //indicating in map the start node
		map[endPos-1] = 6; //indicating in map the end node

		/*for calculating the X and Y coordinates of each cell*/
		for(var i=0; i<grid.length; i++){
			var x = ((grid[i]-1)/10)|0;
			var y = ((grid[i]-1)%10)|0;
			this.coordinates.push([x,y]);
		}


		/*Computing H for each grid cell*/
		var k = endPos-1 //-1 as inidces of an array starts from 0
		var endX = this.coordinates[k][0];
		var endY = this.coordinates[k][1];

		for(var l =0; l<grid.length; l++){
			var i = grid[l]-1;
			var H = math.abs(this.coordinates[i][0] - endX) + math.abs(this.coordinates[i][1] - endY);
			Heuristic.push(H);
		}

		/*Initializing for the start node*/
		distFromStart[startPos-1] = 0;
		f[(startPos-1)] = Heuristic[(startPos-1)];

		while(true){

			/*Finding the node with minimum F*/
			var minValue = math.min(f);
			for(var j = 0; j<f.length; j++){
				if(f[j] == minValue){
					current= j+1; //because we want the node number and j would just give the location in the array
					break;
				}
			}

			if(current == endPos || minValue == Infinity){
				break;
			}

			f[current-1] = Infinity; //marking the node visited and not considering it the next time (the inside nodes)
			map[current-1] = 3; //indicating in map a visited node

			var neighbours = this.Neighbours(current);
			
			if(neighbours.length!=0){
				for(var i = 0; i<neighbours.length; i++){
					if(map[(neighbours[i]-1)] == 1 || map[(neighbours[i]-1)] == 4 || map[(neighbours[i]-1)] == 6){

						if(distFromStart[(neighbours[i]-1)] > (distFromStart[(current-1)]+1)){

							distFromStart[(neighbours[i]-1)] = distFromStart[(current-1)] + 1;
							f[(neighbours[i]-1)] = distFromStart[(neighbours[i]-1)] + Heuristic[(neighbours[i]-1)];
							parent[(neighbours[i]-1)] = current;
							map[(neighbours[i]-1)] = 4;

						}
					}
				}
			}

		}//end of while loop

		/*Construct path from dest to start by following the parent links */
		if(parent[endPos-1] == null){
			path = [];
		}
		else{
			path.push(endPos);//endPos should always be there in the path
			var n = endPos; //while tracing back the path n is the current node
			while(n!=startPos){
				var next = parent[(n-1)];
				path.push(next);
				n = next;
			}
		}
		return path;

	} //end of Search Function

	/*Function to compute neighbours of the current node*/
	Neighbours(current){
		var k = current-1 //-1 as inidces of an array starts from 0
		var c_x = this.coordinates[k][0];
		var c_y = this.coordinates[k][1];
		var max_x = 9;
		var max_y = 9;
		var next = [];
		for(var dx = (c_x > 0 ? -1 : 0); dx<=(c_x < max_x ? 1 : 0); ++dx){
			for(var dy = (c_y > 0 ? -1 : 0); dy<=(c_y < max_y ? 1 : 0); ++dy){
				if((dx!=0 || dy!=0) && (dx!=1 || dy!=-1) && (dx!=-1 || dy!=1) && (dx!=1 || dy!=1) && (dx!=-1 || dy!=-1)) //ignoring the diagonal enteries
				{
					var nextX = c_x+dx;
					var nextY = c_y+dy;
					var n = (10*nextX)+nextY+1;
					next.push(n);
				}
			}
		}
		return next; //returns the list of neighbours
	}
}//end of class astar

/*************************************************************************************************************************************************************/

var canvas = document.getElementById("canvas");
	var context= canvas.getContext("2d");

var pixelClass = 1; //for determining which color
var pixelColor = "#0000ff"; //by default blue for start position
var startPos = 0;
var endPos = 0;
var obstacles = [];
var grid = [];

drawGrid();

var canvas = document.getElementById("canvas");
			var context= canvas.getContext("2d");


canvas.addEventListener('click', function(e){
		var rect = canvas.getBoundingClientRect();

		var x = (Math.floor(e.offsetY/40)*40)/40; 
		var y = (Math.floor(e.offsetX/40)*40)/40;
	
		context.fillStyle = pixelColor;
		context.fillRect(Math.floor(e.offsetX/40)*40, Math.floor(e.offsetY/40)*40, 40, 40); //change 40 to change the grid size
		if(pixelClass==1){//blue
			startPos = (10*x)+y+1;
			pixelColor = "#FFFFFF";//white
			console.log("Start: " + startPos);
		}
		if(pixelClass==2){//orange
			endPos = (10*x)+y+1;
			pixelColor = "#FFFFFF";//white
			console.log("Goal: " + endPos);
		}
		if(pixelClass==3){//black
			obstacles.push((10*x)+y+1);
		}	
}, true);
		

/*Drawing the Grid on Canvas*/
function drawGrid(){
	context.beginPath();
	context.fillStyle = "white";
	context.lineWidth = 1;
	context.strokeStyle = 'black';
	/* To make changes in the grid edit the number 40 in Draw Grid, Canvas and draw path function*/
	for (var row = 0; row <10; row++) 
		{
			for (var column = 0; column <10; column++) 
			{
				var x = row * 40; 
				var y = column * 40;
			    context.rect(x, y, 40, 40);
		        context.fill();
		        context.stroke();
		        grid.push((10*row)+column+1);
		    }
		}
   	context.closePath();
}

/*Called when the user clicks search path button*/
function searchPath(){
	if(startPos == 0){
		alert("Start Position was not defined");
		refreshCanvas();
	}
	else if(endPos == 0){
		alert("Goal was not defined");
		refreshCanvas();
	}
	else{
		var astar = new aStar(grid, startPos, endPos, obstacles);
		var path = astar.search()
	
		if(path.length ==0){
			// console.log("No Path Exists");
			alert("No Path Exists");
			refreshCanvas();
		}
		else{
			// console.log("Path: ");
			// console.log(path);
			var node_cord = [];

			/*Finding the coordinates of each node on the path*/
			for(var i=0; i<path.length; i++){
				var x = ((path[i]-1)/10)|0;
				var y = ((path[i]-1)%10)|0;
				node_cord.push([x,y]);
			}

			/*Drawing the Path on Canvas*/
			/*Remember we have flipped the y and x coordinates due to the canvas*/
			context.moveTo((node_cord[0][1]*40)+20,(node_cord[0][0]*40)+20); //start from the first node in the path
			for(var j = 0; j < node_cord.length; j++)
			{
				x = (node_cord[j][1]*40)+20;
				y = (node_cord[j][0]*40)+20;
				context.lineTo(x,y);	
			}
			context.stroke();
		}
	}
}

function refreshCanvas(){
			context.clearRect(0,0, 400, 400);
			//clear the storedvalues
			grid =[];
			startPos = 0;
			endPos = 0;
			obstacles =[];
			pixelColor = "#0000ff"; //by default blue for start position
			pixelClass = 1;

			drawGrid();
		}
			