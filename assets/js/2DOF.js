/*
Redundant Manipulator Main Script
Author : Mohana Saraf
Dependencies : three.js, math.min.js
*/

// Scene1 : Forward Kinematics of 2D Arm
var scene1 = new THREE.Scene();

container1 = document.getElementById('2DOF');

// Scene2 : Inverse Kinematics of 2D Arm
var scene2 = new THREE.Scene();

Width = $('#2DOF').width();
//$('#2DOF').width
Height = 500;
var camera = new THREE.PerspectiveCamera(45, Width/Height, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias : true});

renderer.setSize(Width, Height);
container1.appendChild( renderer.domElement );

renderer.setClearColor( 0x333333, 1);

renderer.autoClear = false;

camera.position.set(0, 0, 30);
camera.lookAt(new THREE.Vector3(0, 10, 0));

var armMaterial1 = new THREE.LineBasicMaterial({color: 0x00ff00});
var armMaterial2 = new THREE.LineBasicMaterial({color: 0xFFff00});
var desiredLineMaterial = new THREE.LineBasicMaterial({color: 0xff0010}); //blue line - 0x0000ff
// #ff0010

// Class TwoDimManipulator
class TwoDimManipulator{
	//Constructor of Class
	constructor(material, l1, l2){
		this.material = material;
	    this.gLink1 = new THREE.Geometry();
	    this.gLink2 = new THREE.Geometry();
	    this.l1 = l1;
	    this.l2 = l2;
	    
	    var w = 0.20;

	    this.gLink1.vertices.push( new THREE.Vector3(-w, 0, 0) );
	    this.gLink1.vertices.push( new THREE.Vector3(-w, l1, 0) );
	    this.gLink1.vertices.push( new THREE.Vector3(w, l1, 0) );
	    this.gLink1.vertices.push( new THREE.Vector3(w,0,0) );
	    this.gLink1.vertices.push( new THREE.Vector3(-w, 0, 0));

	    this.gLink2.vertices.push( new THREE.Vector3(0, -w, 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(10, -w, 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(10, -(w + 0.4), 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(11, -(w + 0.4), 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(10, -(w + 0.4), 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(10, (w + 0.4), 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(11, (w + 0.4), 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(10, (w + 0.4), 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(10, w, 0) );
	    this.gLink2.vertices.push( new THREE.Vector3(0, w, 0) );
		this.gLink2.vertices.push( new THREE.Vector3(0, -w, 0) );

	    this.lLink1 = new THREE.Line( this.gLink1, this.material );
		this.lLink2 = new THREE.Line( this.gLink2, this.material );

		//Translate Link2 10 units above
		this.lLink2.translateY(10);
		//Attach Link2 to Link 1
		this.lLink1.add(this.lLink2);	

	}
	//Add link to scene
	addToScene(scene){
		scene.add(this.lLink1);
	}

}


var gXAxis1 = new THREE.Geometry();
var gXAxis2 = new THREE.Geometry();

var gDesiredLine = new THREE.Geometry();

gXAxis1.vertices.push(new THREE.Vector3(10, 0, 0));
gXAxis1.vertices.push(new THREE.Vector3(-10, 0, 0));
gXAxis2.vertices.push(new THREE.Vector3(10, 0, 0));
gXAxis2.vertices.push(new THREE.Vector3(-10, 0, 0));

gDesiredLine.vertices.push(new THREE.Vector3(3.5,-2,0));
gDesiredLine.vertices.push(new THREE.Vector3(3.5,12,0));


var lXAxis1 = new THREE.Line(gXAxis1, armMaterial1);
var lXAxis2 = new THREE.Line(gXAxis2, armMaterial1);

var lDesiredLine = new THREE.Line(gDesiredLine, desiredLineMaterial);

// Create arm object and add to scene1 (Fwd Kin)
var arm1 = new TwoDimManipulator(armMaterial1, 10, 10);
arm1.addToScene(scene1);

// Create arm object and add to scene2 (Inv Kin)
var arm2 = new TwoDimManipulator(armMaterial2, 10, 10);
arm2.addToScene(scene2);

var text1 = document.getElementById('angleDisplay1');
// text1.style.width = 100;
// text1.style.height = 100;
//text1.style.color = 0xffff00;

var text2 = document.getElementById('angleDisplay2');
// text2.style.width = 100;
// text2.style.height = 100;
//text2.style.color = red;

//Add Axis and Desired line to scene
scene1.add(lXAxis1);
scene2.add(lXAxis2);
scene2.add(lDesiredLine);


// Note initial angles are 90 and -90
var angle1 = 0;
var angle2 = 0;
var speed = 0.5;

// Note initial angles are 90 and -90
var detaT = 0.05;
var J;
var Jinv;
var xiDot = math.matrix([[0],[0.1]]); //desired end effector velocity
console.log(xiDot.get([1,0]));
var q = math.matrix([[80*Math.PI/180],[-160* Math.PI/180]]);
var qDot;
var iter = 0;


var render = function(){
	iter +=1;
	requestAnimationFrame(render);

	angle1 += speed/4;
	angle2 += speed/2;

	var t11 = 90 + angle1;
	var t12 = -90 + angle2;

	text1.innerHTML = "<b>Forward Kinematics</b><br />Angles given, calculate position<br />L1 = 10 units, L2 = 10 units <br />"
	text1.innerHTML += "Angle 1: <b>" + (t11).toFixed(1) + "</b>, Angle 2: <b>"+ (t12).toFixed(1) + "</b><br />";
	text1.innerHTML += "(x,y) = ("+ (10*Math.cos(t11*Math.PI/180) + 10*Math.cos((t11+t12)*Math.PI/180)).toFixed(1) + "," + (10*Math.sin(t11*Math.PI/180) + 10*Math.sin((t11+t12)*Math.PI/180)).toFixed(1) + ")" ;

	if(angle1 > 40 || angle1 < 0){
		speed *= -1;
	}

	arm1.lLink1.rotation.z = angle1 * Math.PI/180.0;
	arm1.lLink2.rotation.z = angle2 * Math.PI/180.0;

	if (iter < 2000){
		var t1 =  q.get([0,0]);
		var t2 =  q.get([1,0]);
		J = math.matrix([[-10*Math.sin(t1) -10*Math.sin(t1+t2), -10*Math.sin(t1 + t2)],[10*Math.cos(t1) + 10*Math.cos(t1+t2), 10*Math.cos(t1+t2)]]);

		try{
			Jinv = math.inv(J);
			qDot = math.multiply(Jinv,xiDot); //rate of chnage of joint angles
			qDot = math.multiply(qDot,detaT);
			q = math.add(q, qDot);
		}
		catch(err){
			//inverse not defined
		}
	
		text2.innerHTML = "<b>Inverse Kinematics</b><br />Postion given, Calculate Angles <br />L1 = 10 units, L2 = 10 units <br />(x,y) = ("+ (10*Math.cos(t1) + 10*Math.cos(t1+t2)).toFixed(1) + "," + (10*Math.sin(t1) + 10*Math.sin(t1+t2)).toFixed(1) + ")<br />" ;
		text2.innerHTML += "Angle 1: <b>" + (q.get([0,0])*180/Math.PI).toFixed(2)  + "</b>, Angle 2: <b>"+ (q.get([1,0])*180/Math.PI).toFixed(2) + "</b>";

		// Subtract 90 deg from link1 angle
		arm2.lLink1.rotation.z = q.get([0,0]) - Math.PI/2;
		// Add 90 deg to link2 angle
		arm2.lLink2.rotation.z = q.get([1,0]) + Math.PI/2;
	}
	else{
		iter = 0;
		xiDot = math.multiply(xiDot,-1);
	}

	renderer.clear();
	renderer.render(scene2, camera);
	renderer.clearDepth();
	renderer.render(scene1, camera);
	
}
render();