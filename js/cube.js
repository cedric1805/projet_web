//Détection des facultés WebGl du browser
if ( ! Detector.webgl ) {

    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}
//Déclaration des variables standards
//-----------------------------------
var container; //Elément conteneur du DOM
var camera, controls, scene, renderer; 
//var controls;//Contrôle de l'affichage
//var renderer;//Renderer WebGL
var cube, group;

var n = 10; //n+1 partitions ! 

init();
animate();


function init(){

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(2,2,2);

    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.addEventListener( 'change', render );

    // world
    scene = new THREE.Scene();
    
    var geometry = new THREE.BoxGeometry( 1/n, 1/n, 1/n );
   
    group = new THREE.Group();

    for ( var i = 0; i < 1; i += 1/n ) {
        for ( var j = 0; j < 1; j += 1/n ) {
            for ( var k = 0; k < 1; k += 1/n ) {

                var r = (i*255); 
                x=parseInt(r);
                //console.log(r);
                var g = (j*255);
                y=parseInt(g);
                var b = (k*255); 
                z=parseInt(b);

                var material = new THREE.MeshBasicMaterial({ color: "rgb("+x+", "+y+", "+z+")" });

                var cube = new THREE.Mesh( geometry, material );
                cube.position.x = i;
                cube.position.y = j;
                cube.position.z = k;
               
                cube.matrixAutoUpdate = false;
                cube.updateMatrix();

                group.add( cube );
            }//k   
        }//j
    }//i
   
    scene.add( group );

    //creation axes
    var axisHelper = new THREE.AxisHelper(500);
    axisHelper.position.set(-1/(2*n),-1/(2*n),-1/(2*n)); //on se positionne au sommet noir du cube 
    scene.add(axisHelper);


    //  Sol de la scène
    //-----------------                
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000); //géométrie du sol
    var floorTexture = new THREE.ImageUtils.loadTexture('texture/herbe.png');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 100, 100 );
    var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture}); //materiau du sol
    var floor = new THREE.Mesh(floorGeometry, floorMaterial); //association de la géométrie et du matériau
    floor.position.set( 0, -1/(2*n), 0 ); //positionnement
    floor.rotation.x = -Math.PI/2; //sol horizontal (!)
    scene.add(floor); //attachement du sol à la scène


    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );




    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    //
    window.addEventListener( 'resize', onWindowResize, false );
    //

    render();
}


function onWindowResize() {
    //on s'adapte a la taille de l'ecran
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();

    render();

}

function animate(){
    requestAnimationFrame( animate );
    controls.update();
}

function render() {
    renderer.render( scene, camera );
}




