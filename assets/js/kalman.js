/* 
Kalman Filter Main Script
Author : Mohana Saraf
Dependencies : math.min.js, jquery-1.8.2.min.js, kalman.html

*/

$(document).ready(function() {
    initialize(); //call the initialize function from kalman.js
    frame();
});

var canvas_k = document.getElementById("kalman_canvas");
var context_k= canvas_k.getContext("2d");

var sampling_time = 60; //frames persecond
var PIX_SIZE = 4; //default size for points to draw on canvas

// Simulation Values:
var display_time= 3.0;

var F; //prediction matrix
var B; //control matrix
var Q; //environment noise matrix
var R; //noise in the measurement
var H; //observation matrix

/*variables to indroduce random noise*/
//math.floor(math.random() * 50); //number between 1 and 50
//math.floor(math.random() * (max - min) + min); //Returns a random number between min (inclusive) and max (exclusive)
var max = 60;
var min = 30;
var x_noise = math.floor(math.random() * (max - min) + min); 
var y_noise = math.floor(math.random() * (max - min) + min);

/*original cursor points*/
var xPos;
var yPos;

/*variables for storing the previous states*/
var last_x;
var last_P;

/*variables to store next states after combining two estimates*/
var next_x;
var next_P;

/*arrays to store all the points*/
var rPoints; // real points
var pPoints; // predicted points
var kPoints; // kalman points

// true if animation is currently going, false if stopped.
var running = true;
var simulation;


/*Initialize everything*/
function initialize(){

	/*cursor default poition*/
	xPos = 0;
	yPos = 0;

	/*prediction matrix*/
	F = math.matrix([[1, 0, 0.2, 0],
					[0, 1, 0, 0.2],
					[0, 0, 1, 0],
					[0, 0, 0, 1]]);

	/*control matrix*/
	B = math.matrix([[1, 0, 0, 0],
					[0, 1, 0, 0],
					[0, 0, 1, 0],
					[0, 0, 0, 1]]);

	/*environment noise*/
	Q = math.matrix([[0.001, 0, 0, 0],
					 [0, 0.001, 0, 0],
					 [0, 0, 0, 0],
					 [0, 0, 0, 0]]);

	/*noise in the measurement*/
	R = math.matrix([[0.1, 0, 0, 0],
					 [0, 0.1, 0, 0],
					 [0, 0, 0.1, 0],
					 [0, 0, 0, 0.1]]);

	H = math.matrix([[1, 0, 0, 0],
					 [0, 1, 0, 0],
					 [0, 0, 1, 0],
					 [0, 0, 0, 1]]);

	/*previous states*/
	last_x = math.matrix([0,0,0,0]);

	last_P = math.matrix([[0, 0, 0, 0],
						  [0, 0, 0, 0],
						  [0, 0, 0, 0],
						  [0, 0, 0, 0]]);

	rPoints = [];
	kPoints = [];
	pPoints = []; 

	running = true; 
	//setTimeout - is used to perform a task after a time interval mentioned in ms - setTimeout(function(), time_in_ms)
	simulation = setTimeout(frame, 1000/sampling_time);

} //end of initialize function 

/* Point class (prototype):
 *	Keeps track of a point, and it's current display state.
 *	A point will automatically draw itself to the screen, and
 *	must be updated every frame. isAlive() will return false when
 *	this point has faded out completely.
 */
function Point(color) {
	
	// override values:
	this.color = color;
	this.duration = Math.round(display_time*sampling_time); // frames
	this.maxDuration = this.duration;
	
	// update timer
	this.update = function() {
		this.duration -= 1;
	}
	
	// returns FALSE if this point is done, ready to be removed
	this.isAlive = function() {
		return (this.duration > 0);
	}
	
	// draw a line segment from last point to current point onto the screen
	this.draw = function(context_k) {
		context_k.save();
		context_k.globalAlpha = (this.duration/this.maxDuration); //globalAlpha - sets transparency 
		context_k.strokeStyle = this.color;
		context_k.lineWidth = PIX_SIZE;
		context_k.beginPath();
			context_k.moveTo(this.lastX, this.lastY);
			context_k.lineTo(this.x, this.y);
			context_k.stroke();
		context_k.restore();
	}
}

/* RealPoint: displays sensor readings (cursor position + noise) */
function RealPoint(x, y) {
	this.x = x;
	this.y = y;
	
	this.duration = Math.round(display_time*sampling_time); // frames
	this.maxDuration = this.duration;
	
	// draw just a color square to the screen (no lines)
	this.draw = function(context_k) {
		context_k.save();
		context_k.globalAlpha = (this.duration/this.maxDuration); //globalAlpha - sets transparency 
		context_k.fillStyle = this.color;
		context_k.fillRect(this.x - PIX_SIZE/2, this.y - PIX_SIZE/2, PIX_SIZE, PIX_SIZE);
		context_k.restore();
	}
}
RealPoint.prototype = new Point("#9999FF"); //blue //like using or calling a function 


/* KalmanPoint: point to display the filtered value as determined
 *	by the Kalman Filter.
*/
function KalmanPoint(x, y) {
	this.x = x;
	this.y = y;
	
	this.duration = Math.round(display_time*sampling_time); // frames
	this.maxDuration = this.duration;
	// set last point if a previous KalmanPoint exists
	if(kPoints.length > 0) {
		var t = kPoints.length - 1;
		this.lastX = kPoints[kPoints.length - 1].x;
		this.lastY = kPoints[kPoints.length - 1].y;
	}
	else {
		this.lastX = 0;
		this.lastY = 0;
	}
}
KalmanPoint.prototype = new Point("#00FF00");//GREEN 

/*main*/
function frame(){

	// if paused, just call for the next frame and return
	if(!running) {
		//setTimeout - is used to perform a task after a time interval mentioned in ms - setTimeout(function(), time_in_ms)
		simulation = setTimeout(frame, 1000/sampling_time);
		return;
	}
	
	// clear screen
	context_k.clearRect(0, 0, $('#kalman_canvas').width(), $('#kalman_canvas').height());

	/*sensor readings with added noise for simulation*/
	var cur_xPos = xPos + x_noise/2 - x_noise*Math.random();
	var cur_yPos = yPos + y_noise/2 - y_noise*Math.random();

	rPoints.push(new RealPoint(cur_xPos, cur_yPos));
	//console.log(rPoints);
	
	var vel_x = cur_xPos - last_x.get([0]);
	var vel_y = cur_yPos - last_x.get([1]);

	/*KALMAN CODE LOGIC*/

	var sensorr_measurement = math.matrix([cur_xPos, cur_yPos, vel_x, vel_y]);
	var control = math.matrix([0,0,0,0]);

	//prediction step
	var x = math.add(math.multiply(F, last_x), math.multiply(B, control)); //Fx + Bu
	var P = math.add(math.multiply(math.multiply(F, last_P), math.transpose(F)), Q); //FPFt + Q

	//correction step
	var S = math.add(math.multiply(math.multiply(H, P),math.transpose(H)), R);
	var K =  math.multiply(math.multiply(P, math.transpose(H)), math.inv(S));

	var next_x = math.add(x, math.multiply(K, math.subtract(sensorr_measurement, math.multiply(H, x))));
	var next_P = math.subtract(P, math.multiply(math.multiply(K, H), P));

	//feed into the system again
	last_x = next_x;
	last_P = next_P;


	kPoints.push(new KalmanPoint(next_x.get([0]), next_x.get([1]) ));
	//console.log(kPoints);

	/*********************************************************************************/

	// draw all real points
	for(var i=0; i<rPoints.length; i++) {
		rPoints[i].draw(context_k);
		rPoints[i].update();//for color - update from prototype
		// if point faded out, remove it from the list
		if(!rPoints[i].isAlive()) {
			rPoints.splice(i, 1);
			i--;
		}
	}

	// draw all kalman points
	for(var i=0; i<kPoints.length; i++) {
		kPoints[i].draw(context_k);
		kPoints[i].update();//for color - update from prototype
		// if point faded out, remove it from the list
		if(!kPoints[i].isAlive()) {
			kPoints.splice(i, 1);
			i--;
		}
	}

	// call next animation frame
	simulation = setTimeout(frame, 1000/sampling_time);

}//end of main


// start or stop animation
function toggleAnimation() {

	running = !running;
	var toggleSpan = document.getElementById("Pause");
	console.log(toggleSpan.value);
	if(running)
		toggleSpan.value = "Pause";
	else
		toggleSpan.value = "Start";
}

/* Called by mouse movement across the canvas:
 *	updates the current position of the cursor.
 */
function updatePosition(event){
	// no position updates if animation is paused
	if(!running)
		return;
	
	// calculate the position offset of the Canvas on the web page
    //changed clientX to offsetX
	var mouseX = event.offsetX;
	var mouseY = event.offsetY;

	// update the cursor's x and y position
	xPos = Math.floor(mouseX);
    // xPos = xPos-320;
	yPos = Math.floor(mouseY);
    
    console.log(xPos, yPos);

}


