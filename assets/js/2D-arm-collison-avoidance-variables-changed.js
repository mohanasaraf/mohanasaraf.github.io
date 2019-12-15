var scene4 = new THREE.Scene();

container2 = document.getElementById('2DOF-collision');

Width1 = $('#2DOF-collision').width();
Height1 = 700;

// originally coming from collision2.js
var startPos = 50025;//64800 //Orange
var endPos = 64290;//change if grid size changes //Green

var grid_x = 180; //link 1 max rotation
var grid_y = 360; //link 2 max rotation

//define node_cord here
var node_cord = [[29,357],[29,356],[29,355],[29,354],[29,353],[29,352],[29,351],[29,350],[29,349],[29,348],[29,347],[29,346],
[29,345],[29,344],[29,343],[29,342],[29,341],[29,340],[29,339],[29,338],[29,337],[29,336],[29,335],[29,334],[29,333],[29,332],[29,331],
[29,330],[29,329],[29,328],[29,327],[29,326],[29,325],[29,324],[29,323],[29,322],[29,321],[29,320],[29,319],[29,318],[29,317],[29,316],
[29,315],[29,314],[29,313],[29,312],[29,311],[29,310],[29,309],[29,308],[29,307],[29,306],[29,305],[29,304],[29,303],[29,302],[29,301],
[29,300],[29,299],[29,298],[29,297],[29,296],[29,295],[29,294],[29,293],[29,292],[29,291],[29,290],[29,289],[29,288],[29,287],[29,286],
[29,285],[29,284],[29,283],[29,282],[29,281],[29,280],[29,279],[29,278],[29,277],[29,276],[29,275],[29,274],[29,273],[29,272],[29,271],
[29,270],[29,269],[29,268],[29,267],[29,266],[29,265],[29,264],[29,263],[29,262],[29,261],[29,260],[29,259],[29,258],[29,257],[29,256],
[29,255],[29,254],[29,253],[30,253],[31,253],[32,253],[33,253],[34,253],[35,253],[36,253],[37,253],[38,253],[39,253],[40,253],[41,253],
[42,253],[43,253],[44,253],[45,253],[46,253],[47,253],[48,253],[49,253],[50,253],[51,253],[52,253],[53,253],[54,253],[55,253],[56,253],
[57,253],[58,253],[59,253],[60,253],[61,253],[62,253],[63,253],[64,253],[65,253],[66,253],[67,253],[68,253],[69,253],[70,253],[71,253],
[72,253],[73,253],[74,253],[75,253],[76,253],[77,253],[78,253],[79,253],[80,253],[81,253],[82,253],[83,253],[84,253],[85,253],[86,253],
[87,253],[88,253],[89,253],[90,253],[91,253],[92,253],[93,253],[94,253],[95,253],[96,253],[96,254],[96,255],[96,256],[97,256],[97,257],
[97,258],[97,259],[97,260],[97,261],[97,262],[97,263],[97,264],[97,265],[97,266],[97,267],[97,268],[97,269],[97,270],[97,271],[97,272],
[97,273],[97,274],[97,275],[97,276],[97,277],[98,277],[99,277],[100,277],[101,277],[102,277],[103,277],[104,277],[105,277],[106,277],
[107,277],[108,277],[109,277],[110,277],[111,277],[112,277],[113,277],[114,277],[115,277],[116,277],[117,277],[118,277],[119,277],
[120,277],[121,277],[122,277],[123,277],[124,277],[125,277],[126,277],[127,277],[128,277],[129,277],[130,277],[131,277],[132,277],
[133,277],[134,277],[135,277],[136,277],[137,277],[138,277],[139,277],[140,277],[141,277],[142,277],[143,277],[144,277],[145,277],
[146,277],[147,277],[148,277],[149,277],[150,277],[151,277],[152,277],[153,277],[154,277],[155,277],[156,277],[157,277],[158,277],
[159,277],[160,277],[161,277],[162,277],[163,277],[164,277]];

// originally coming from collision2.js

var camera1 = new THREE.PerspectiveCamera(30, Width1/Height1, 0.1, 1000); //(field of view, aspect ratio, near & far clippin plane)

var renderer1 = new THREE.WebGLRenderer({antialias : false});

var renderer1 = new THREE.WebGLRenderer();
renderer1.setSize( Width1, Height1 ); //creating an instance
container2.appendChild( renderer1.domElement ); //adding the renderer element to the HTML document //This is a <canvas> element the renderer uses to display the scene to us.

renderer1.setClearColor( 0x333333, 1);

renderer1.autoClear = false;

var dotGeometry1 = new THREE.Geometry();
dotGeometry1.vertices.push(new THREE.Vector3( 0, 0, 0));
	    
var dotMaterial1 = new THREE.PointsMaterial( { size: 4, sizeAttenuation: false, color: 0xffffcc } );
var dot = new THREE.Points( dotGeometry1, dotMaterial1 );
scene4.add( dot );

/*-----To plot the destination point -------*/
var d_x = ((endPos - 1)%grid_x)|0;
var d_y = ((endPos - 1)/grid_x)|0;

/*Forward Kinematics Equation*/
var dest_x = 5*Math.cos(d_x*Math.PI/180) + 5*Math.cos( (d_x+d_y) * Math.PI/180);
var dest_y = 5*Math.sin(d_x*Math.PI/180) + 5*Math.sin( (d_x+d_y) * Math.PI/180);

// console.log("Link 1 dest Angle  : " + d_x);
// console.log("Link 2 dest Angle  : " +d_y);

// console.log("Point dest : " + dest_x);
// console.log("Point dest : " + dest_y);

var dotGeometry2 = new THREE.Geometry();
dotGeometry2.vertices.push(new THREE.Vector3( dest_x, dest_y, 0));

var dotMaterial2 = new THREE.PointsMaterial( { size: 4, sizeAttenuation: false, color: 0x00ff00 } ); //0x00ff00
var dest_dot = new THREE.Points( dotGeometry2, dotMaterial2 );
scene4.add( dest_dot );

/*------ To plot the start point -------*/
var s_x = ((startPos - 1)%grid_x)|0;
var s_y = ((startPos - 1)/grid_x)|0;

/*Forward Kinematics Equation*/
var start_x = 5*Math.cos(s_x*Math.PI/180) + 5*Math.cos( (s_x+s_y) * Math.PI/180);
var start_y = 5*Math.sin(s_x*Math.PI/180) + 5*Math.sin( (s_x+s_y) * Math.PI/180);

var dotGeometry3 = new THREE.Geometry();
dotGeometry3.vertices.push(new THREE.Vector3( start_x, start_y, 0));

var dotMaterial3 = new THREE.PointsMaterial( { size: 4, sizeAttenuation: false, color: 0xe5760d } ); //red //0xf40707 //0xe5760d
var start_dot = new THREE.Points( dotGeometry3, dotMaterial3 );
scene4.add( start_dot );

camera1.position.set(0, 0, 50);//position
camera1.lookAt(new THREE.Vector3(0, 5, 0));//direction




/*******************************************************************************************************************************/



/*For Drawing the arm and obstacles */

			var xAxismaterial4 = new THREE.LineBasicMaterial({color: 0x0000ff});//blue 
			var yAxismaterial4 = new THREE.LineBasicMaterial({color: 0x00ff00});//green
			var armMaterial4 = new THREE.LineBasicMaterial({color: 0xffffff});//white
			var obsMaterial4 = new THREE.LineBasicMaterial({color: 0xf40707});//red //0xf40707

			// Class OneDOFPlanar Manipulator
			class OneDOFPlanar4{
				//Constructor of Class
				constructor(material4, l4, l5){
					this.material4 = material4;
				    this.gLink4 = new THREE.Geometry();
				    this.gLink5 = new THREE.Geometry();
				    this.l4 = l4;
				    this.l5 = l5;
				    
				    var w4 = 0.5;

				    // this.gLink1.vertices.push( new THREE.Vector3(-w, 0, 0) ); //bottom of link 1 start point //D
				    // this.gLink1.vertices.push( new THREE.Vector3(-w, l1, 0) ); //top of link 1 start point //A
				    // this.gLink1.vertices.push( new THREE.Vector3(w, l1, 0) ); //top of link 1 end point //B
				    // this.gLink1.vertices.push( new THREE.Vector3(w,0,0) ); //bottom of link 1 end point //C
				    // this.gLink1.vertices.push( new THREE.Vector3(-w, 0, 0));

			//from 3dof

					this.gLink4.vertices.push( new THREE.Vector3(0, -w4, 0) ); //bottom of link 2 start point //C - V0
				    this.gLink4.vertices.push( new THREE.Vector3(l4, -w4, 0) ); //top of link 2 start point //B - V1
				    this.gLink4.vertices.push( new THREE.Vector3(l4, w4, 0) );//top of link 2 end point //A - V2
				    this.gLink4.vertices.push( new THREE.Vector3(0, w4, 0) ); //bottom of link 2 end point //D - V3
					this.gLink4.vertices.push( new THREE.Vector3(0, -w4, 0) ); //bottom line of rect 

						this.gLink4.vertices.push( new THREE.Vector3(l4, w4, 0) ); //A
						this.gLink4.vertices.push( new THREE.Vector3(0, -w4, 0) ); //C

						// this.gLink1.vertices.push( new THREE.Vector3(l1, -w, 0) ); //B
						// this.gLink1.vertices.push( new THREE.Vector3(0, w, 0) ); //D
						

					this.gLink5.vertices.push( new THREE.Vector3(0, -w4, 0) ); //C - V0
				    this.gLink5.vertices.push( new THREE.Vector3(l5, -w4, 0) ); //B - V1
				    this.gLink5.vertices.push( new THREE.Vector3(l5, w4, 0) ); //A - V2
				    this.gLink5.vertices.push( new THREE.Vector3(0, w4, 0) ); //D - V3
					this.gLink5.vertices.push( new THREE.Vector3(0, -w4, 0) ); 

						this.gLink5.vertices.push( new THREE.Vector3(l5, w4, 0) ); //A - V2
						this.gLink5.vertices.push( new THREE.Vector3(0, -w4, 0) ); //C - V0
						// this.gLink2.vertices.push( new THREE.Vector3(l2, -w, 0) ); //B
						// this.gLink2.vertices.push( new THREE.Vector3(0, w, 0) ); //D

				 	// this.gLink2.vertices.push( new THREE.Vector3(0, -w, 0) ); //bottom of link 2 start point //C
				 	// this.gLink2.vertices.push( new THREE.Vector3(l2, -w, 0) ); //top of link 2 start point //B
				 	// this.gLink2.vertices.push( new THREE.Vector3(l2, w, 0) );//top of link 2 end point //A
				 	// this.gLink2.vertices.push( new THREE.Vector3(0, w, 0) ); //bottom of link 2 end point //D
					// this.gLink2.vertices.push( new THREE.Vector3(0, -w, 0) ); //bottom line of rect 

					this.gLink4.faces.push( 
						new THREE.Face3( 2, 1, 0 ), //triangle ABC
						new THREE.Face3( 2, 0, 3 )  //triangle ACD
						);

					this.gLink5.faces.push( 
						new THREE.Face3( 2, 1, 0 ), //triangle ABC
						new THREE.Face3( 2, 0, 3 )  //triangle ACD
						);

					this.lLink4 = new THREE.Line( this.gLink4, this.material4 );
					this.lLink5 = new THREE.Line( this.gLink5, this.material4 );

					//Translate Link2 10 units sidewards
					this.lLink5.translateX(l4);
					//Attach Link2 to Link 1
					this.lLink4.add(this.lLink5); //by linking you are changing their axis/point of rotation

				}
				//Add link to scene
				addToScene(scene4){
					scene4.add(this.lLink4);
					
				}
			}

			//Obstacle1 square box
			var obstacle1 = new THREE.Geometry();

			obstacle1.vertices.push(
				// new THREE.Vector3( 6,  6, 0 ), //v0
				// new THREE.Vector3( 8, 6, 0 ), //v1
				// new THREE.Vector3(  8, 8, 0 ), //v2
				// new THREE.Vector3(  8, 8, 0 ),//v2
				// new THREE.Vector3( 6,  6, 0 ),//v1
				// new THREE.Vector3( 6, 8 , 0 )//v3

				//arm excatly touching the square box
			/*	new THREE.Vector3( 4,  4, 0 ), //v0
				new THREE.Vector3( 6, 4, 0  ), //v1
				new THREE.Vector3( 6, 6, 0  ), //v2
				new THREE.Vector3( 4, 6 , 0 )  //v3*/

				
				new THREE.Vector3( 4.5,  4.5, 0 ), //v0
				new THREE.Vector3( 6.5, 4.5, 0  ), //v1
				new THREE.Vector3( 6.5, 6.5, 0  ), //v2
				new THREE.Vector3( 4.5, 6.5 , 0 )  //v3
				
			);
			obstacle1.faces.push( 
				new THREE.Face3( 2, 1, 0 ), //triangle ABC
				new THREE.Face3( 2, 0, 3 ) //triangle ACD
				);

			//arm material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

			var mesh1 = new THREE.Mesh( obstacle1, obsMaterial4 );
			mesh1.drawMode = THREE.TriangleStripDrawMode; //default

			scene4.add( mesh1 );

			//Obstacle2 triangle
			var obstacle2 = new THREE.Geometry();

			obstacle2.vertices.push(
				new THREE.Vector3( -6,  6, 0 ), //v0
				new THREE.Vector3( -8, 6, 0 ), //v1
				new THREE.Vector3(  -8, 8, 0 ) //v2
				
			);
			obstacle2.faces.push( 
				new THREE.Face3( 2, 1, 0 )
				);

			//arm material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );

			var mesh2 = new THREE.Mesh( obstacle2, obsMaterial4 );
			mesh2.drawMode = THREE.TrianglesDrawMode; //default

			scene4.add( mesh2 );

			// Create arm object and add to scene4 (Fwd Kin)
			var arm4 = new OneDOFPlanar4(armMaterial4, 5, 5);
			arm4.addToScene(scene4);

/*End of Drawing arm and obstacle */




/*******************************************************************************************************************************/

/*For adding the text to the canva area and for animation*/

			var text3 = document.getElementById('angleDisplay3');

			var xAxis4 = new THREE.Geometry();
			xAxis4.vertices.push(new THREE.Vector3(-15,0,0));
			xAxis4.vertices.push(new THREE.Vector3(15,0,0));

			var yAxis4 = new THREE.Geometry();
			yAxis4.vertices.push(new THREE.Vector3(0,-8,0));
			yAxis4.vertices.push(new THREE.Vector3(0,8,0));

			var xAxisLine4 = new THREE.Line(xAxis4, xAxismaterial4);
			var yAxisLine4 = new THREE.Line(yAxis4, yAxismaterial4);

			scene4.add(xAxisLine4);
			scene4.add(yAxisLine4);

			var l4 = 5;
			var l5 = 5;

			var angle4 = 0;
			var angle5 = 0;
			var speed4 = 2;
			var iter1 = -1;

/*End of text area variables and animation*/



/*******************************************************************************************************************************/

			
var render2 = function () {
	iter1 +=1;
	requestAnimationFrame( render2 );


	/* angle from the previous link */
	var t11_4 = +90 + angle4;
	var t12_4 = -90 + angle5;

	//angle pass - calculate x, y - and then vertices of the faces - 

	//change this to inverse as we are calculating the angles with position known

	text3.innerHTML = "<b>Inverse Kinematics</b><br /> Position given, Calculate Angle<br />" + "L1 = " + l4 + " units, " + "L2 = " + l5 + " units" + " <br />";
	text3.innerHTML += "Angle 1: <b>" + (t11_4).toFixed(1) + "</b>, Angle 2: <b>"+ (t12_4).toFixed(1) + "</b> ";
	text3.innerHTML += " <br> (x,y) = ("+ (l4*Math.cos(t11_4*Math.PI/180)  + l5*Math.cos((t11_4+t12_4)*Math.PI/180)).toFixed(1) + "," + (l4*Math.sin(t11_4*Math.PI/180)+ l5*Math.sin((t11_4+t12_4)*Math.PI/180)).toFixed(1) + ")" ;
	text3.innerHTML += ", (x1,y1) = ("+ (l4*Math.cos(t11_4*Math.PI/180)).toFixed(1) + "," + (l5*Math.sin(t11_4*Math.PI/180)).toFixed(1) + ")" ;


	if(iter1<node_cord.length){

		angle4 = node_cord[iter1][0];
		angle5 = node_cord[iter1][1];

	//LINK 1 can rotate 180 degrees and LINK 2 can rotate 360 degrees
		arm4.lLink4.rotation.z = angle4* Math.PI/180.0;
		arm4.lLink5.rotation.z = angle5* Math.PI/180.0;

	}

	else{
		node_cord.reverse();
		iter1 = 0;
	}

	renderer1.clear();
	renderer1.render(scene4, camera1);
	renderer1.clearDepth();
};

render2();