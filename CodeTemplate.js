$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx,my;

	var cell = [];
	var cx = 15; // 15 across
	var cy = 13; //13 down
	var cellW=39; // width of cell
	var cellH=39; // height of cell
















	var numObjects = 0;
	var numObjectsLoaded =0;

	function loadObjects(){
		numObjectsLoaded++;
	}
	
	//Input: path string of picture file location
	function makePicture(path){
		var newPic = new Image();
		newPic.src= path;
		newPic.onload = loadObjects;
		
		numObjects++;
		
		return newPic;
	}

	function loadObjects(){
		numObjectsLoaded++;
	}
	
	

	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{

	


	
	
		
	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 60);
	}

	init();	
	

	for(var i = 0; i < cx; i++){
		cell[i]=[];
		for(var j = 0; j < cy; j++){
			cell[i].push(j);
			cell[i][j]=createTile(i,j); //make each cell its own tile
		}
	}
	
	function createTile(a,b){ // tile constructor
		var result = {
			x: (a*(cellW+1)),
			y: (b*(cellH+1)),
			W:cellW,
			H:cellH,
			isWall:false,
			isPath:false,
			numTurrets:0,
			color:'red',
			draw:function(){
				ctx.fillStyle=this.color
				ctx.fillRect(this.x,this.y,this.W,this.H)
			},
			isOver:function(x,y){
			return x > this.x && x < this.x+this.W && y > this.y && y < this.y + this.H
			}	
		}
			return result
	}
	
	
	function createEnemy(){ // enemy constructor
		var result = {
		x:-40,
		y:80/2+10,
		HP:100,
		HPx:20,
		DMGx:20,
		HPy:5,
		speed:5,
		HPScale:'',
		isDead:false,
		draw:function(){
			ctx.fillStyle='yellow'
			ctx.fillRect(this.x,this.y,20,20)
			},
		drawHP:function(){
			ctx.fillStyle='red'
			ctx.fillRect(this.x, this.y -10,this.HPx,5)
			ctx.fillStyle='green'
			ctx.fillRect(this.x, this.y -10,this.DMGx,5)
		},
		move:function(){
			path=[]
			path = astar({x:-1,y:1}, {x:14, y:10})
				if(this.x<=path[6].x*40+5){
				this.x+=this.speed
				} else if (this.y<=path[17].x*40+5){
				this.y+=this.speed
				} else if (this.x<path[21].x*40+45){
				this.x += this.speed
				}
			},
		isKilled:function(){
			if(this.HP < 1)this.x=2000
			this.isDead=true
			console.log(this.isDead)
		
		}	,
		}
		return result
	}

	function createTower(a,b){ // tower constructor
		var result = {
			x:a,
			y:b,
			damage:10,
			price:100,
			draw:function(){
				ctx.beginPath();
				ctx.arc(this.x+20,this.y+20,18,0,2*Math.PI);
				ctx.fillStyle='green'
				ctx.fill();
				ctx.fillStyle='black'
				ctx.fillRect(this.x+18,this.y+16,4,-15)
				ctx.beginPath();
				ctx.arc(this.x+20,this.y+20,9,0,2*Math.PI);
				ctx.fillStyle='grey'
				ctx.fill();
				
			},range:function(){
			ctx.beginPath();
				ctx.arc(this.x+20,this.y+20,80,0,2*Math.PI); // range of 82 pixels all around
				ctx.stroke();
	
			},
			target:false 
		}
		return result
	}

	function getTarget(x,y){
		var result = {
		
		
				
		}
	return result
	}
	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function dist( p1x, p1y, p2x, p2y )
	{
  		var xs = 0;
  		var ys = 0;
 
 	 	xs = p2x - p1x;
 	 	xs = xs * xs;
 
 	 	ys = p2y - p1y;
 	 	ys = ys * ys;
 
 	 	return Math.sqrt( xs + ys );
	}

	var path = [];
	
	
	function newNode(pos){
		return {f:0,
				g:0,
				h:0,
				x:pos.x,
				y:pos.y,
				parent:null
		}
	}
	function astar(s,e){
		
		var openList = [];
		openList.push(newNode(s));
		
		var closedList = [];
	
		while(openList.length >0){
			
			//Find best scoring node
			var bI = 0;
			
			for(var i=0; i< openList.length;i++){
				if(openList[i].f < openList[bI].f) bI = i;
			}
			//console.log(openList[bI].x);
			var currentNode = openList[bI];
			
			//End case
			if(currentNode.x == e.x && currentNode.y == e.y) {
				
				var curr = currentNode;
				var ret = [];
				while(curr.parent) {
					ret.push(curr);
					curr = curr.parent;
				}
				
				return ret.reverse();
			}
			
			//Remove current node from openlist
			for(var a =0; a < openList.length;a++){
				if(openList[a].x == currentNode.x && openList[a].y == currentNode.y) openList.splice(a,1);
			}
			
			//Push current node onto closed list
			closedList.push(currentNode);
			
			//Load in the neighbors for checking
			var neighbors = getNeighbors(currentNode.x, currentNode.y);
			
			for(var a =0; a < neighbors.length;a++){
				var neighbor = neighbors[a];
			
				//Make sure neighbor is not already processed
				var onClosed = false;
				for(var b =0; b < closedList.length;b++){
					if(closedList[b].x == neighbor.x && closedList[b].y == neighbor.y) onClosed = true 
				}
				
				if(onClosed) continue;
				
				//Find best scoring neighbor
				var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
				var gScoreIsBest = false;
				
				
				//Check if this neighbor is on the list or not, if new is best so far
				var onList = false;
				for(var b =0; b < openList.length;b++){
					if(openList[b].x == neighbor.x && openList[b].y == neighbor.y) onList = true 
				}
				
				if(!onList){
				//Is new, is the best so far
					gScoreIsBest = true;
					neighbor.h = hValue(neighbor, e); 
					openList.push(neighbor);
				}else if(gScore < neighbor.g) {
					// We have already seen the node, but last time it had a worse g (distance from start)
					gScoreIsBest = true;
				}
 
				if(gScoreIsBest) {
					// Found an optimal (so far) path to this node.	 Store info on how we got here and
					//	just how good it really is...
					neighbor.parent = currentNode;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
				}
				
				
				
			}
		
			
		
		}return [];//PAth find failure.
	}
	
	function hValue(pos0, pos1) {
		// This is the Manhattan distance
		var d1 = Math.abs (pos1.x - pos0.x);
		var d2 = Math.abs (pos1.y - pos0.y);
		return d1 + d2;
	}
	
	function getNeighbors(x,y){
		var result = [];
	
		for(var i= x-1; i <= x+1; i++){
			for(var j = y-1; j <= y+1;j++){
				if(i >= 0 && i < cx && j>=0&&j<cy && !(i==x && j==y)){
					if(cell[i][j].isWall == false) {
						result.push(newNode({x:i,y:j}));
					}
				}
			}
		}
		return result;
	}
////////////////////////////////////////////////////////////////////////////////
	
	//MAP1 layout
	cell[0][0].isWall=true;
	cell[1][0].isWall=true;
	cell[2][0].isWall=true;
	cell[3][0].isWall=true;
	cell[4][0].isWall=true;
	cell[5][0].isWall=true;
	cell[6][0].isWall=true;
	
	cell[0][2].isWall=true;
	cell[1][2].isWall=true;
	cell[2][2].isWall=true;
	cell[3][2].isWall=true;
	
	cell[4][2].isWall=true;
	cell[4][3].isWall=true;
	cell[4][4].isWall=true;
	cell[4][5].isWall=true;
	cell[4][6].isWall=true;
	cell[4][7].isWall=true;
	cell[4][8].isWall=true;
	cell[4][9].isWall=true;
	cell[4][10].isWall=true;
	cell[4][11].isWall=true;
	

	cell[6][1].isWall=true;
	cell[6][2].isWall=true;
	cell[6][3].isWall=true;
	cell[6][4].isWall=true;
	cell[6][5].isWall=true;
	cell[6][6].isWall=true;
	cell[6][7].isWall=true;
	cell[6][8].isWall=true;
	cell[6][9].isWall=true;
	
	cell[7][9].isWall=true;
	cell[8][9].isWall=true;
	cell[9][9].isWall=true;
	cell[10][9].isWall=true;
	cell[11][9].isWall=true;
	cell[12][9].isWall=true;
	cell[13][9].isWall=true;
	cell[14][9].isWall=true;
	
	cell[5][11].isWall=true;
	cell[6][11].isWall=true;
	cell[7][11].isWall=true;
	cell[8][11].isWall=true;
	cell[9][11].isWall=true;
	cell[10][11].isWall=true;
	cell[11][11].isWall=true;
	cell[12][11].isWall=true;
	cell[13][11].isWall=true;
	cell[14][11].isWall=true;
	
	cell[0][1].isPath=true;
	cell[1][1].isPath=true;
	cell[2][1].isPath=true;
	cell[3][1].isPath=true;
	cell[4][1].isPath=true;
	cell[5][1].isPath=true;
	
	cell[5][2].isPath=true;
	cell[5][3].isPath=true;
	cell[5][4].isPath=true;
	cell[5][5].isPath=true;
	cell[5][6].isPath=true;
	cell[5][7].isPath=true;
	cell[5][8].isPath=true;
	cell[5][9].isPath=true;
	cell[5][10].isPath=true;
	
	cell[5][10].isPath=true
	cell[6][10].isPath=true
	cell[7][10].isPath=true
	cell[8][10].isPath=true
	cell[9][10].isPath=true
	cell[10][10].isPath=true
	cell[11][10].isPath=true
	cell[12][10].isPath=true
	cell[13][10].isPath=true
	cell[14][10].isPath=true
	
	
	
	

	
	/////////////////////////////
	
	var enemyV1=[]
	for(var i = 0; i < 10;i++){
		enemyV1[i]=createEnemy();
		enemyV1[i].x-=160*i
	}


	var test = []
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{
	
			ctx.fillStyle = 'white';
			ctx.fillRect(0,0, w, h);

			
			for(var i = 0; i < cx; i++){
			for (var j = 0; j < cy; j++){
			if(cell[i][j].isWall==true) cell[i][j].color= 'yellow'
			cell[i][j].draw();

			
			for(var a=0; a < path.length;a++){
				if(path[a].x == i && path[a].y == j) cell[i][j].color = 'cyan'
				}
					if (cell[i][j].isOver(mx,my)==true && cell[i][j].isWall!=true){
						ctx.fillStyle='#FF8080'
						ctx.fillRect(i*(cellW+1),j*(cellH+1),39,39)
						//cell[i][j].draw=function(){
						//ctx.fillRect(this.x-1,this.y-1,41,41)}
					}else{}
				}
			}
		
		for(var i = 0; i < 10;i++){
		enemyV1[i].draw();
		enemyV1[i].drawHP();
		enemyV1[i].move();
		enemyV1[i].isKilled();
		
		}

		//turret menu
			ctx.fillStyle='blue'
			ctx.fillRect(w-w/4,0,w/2,h)
		
		
		for(var i = 0; i < test.length;i++){
		test[i].draw();
		test[i].range();
		}
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	
	console.log(enemyV1)
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	





	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
	
		for(var i = 0; i < cx; i++){
			for(var j = 0; j < cy; j++){
				if(cell[i][j].isOver(mx,my)==true && cell[i][j].numTurrets<1 && cell[i][j].isPath==false) {
				test.push(createTower(cell[i][j].x,cell[i][j].y))
				cell[i][j].numTurrets++
				}
			}
		}
			
			
			
	      
	}, false);


	

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);

      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
      	}
      

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////


	

	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
		
	for(var i = 0; i < 10;i++){
		if(key==80 && enemyV1[i].DMGx != 0){
			enemyV1[i].HP-=5
			console.log(enemyV1[i].HP)
			enemyV1[i].DMGx = Math.floor(enemyV1[i].HP/100 * 20)
			
		}
	}
		
				
		
		
	}, false);




})
