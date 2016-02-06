//verification webgl
if ( ! Detector.webgl ) {

    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

var container;
var scene, camera, renderer;
var geometry, material, cube;


var wAng = 1; //omega
var keys = { left:0, right:0, up:0, down:0 };

init();


function init(){
    container = document.getElementById( 'container' );
    
    //creation de la scene
    scene = new THREE.Scene();

    //initialasion de la camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.set(5,5,5);
    camera.lookAt(scene.position);
    
    //creation axes
    var axisHelper = new THREE.AxisHelper(100);
    scene.add(axisHelper);

    //creation eclairage 
    var pointLight = new THREE.PointLight( 0xffffff);
    pointLight.position.set(60,60,60);
    scene.add(pointLight);

    var spotLight = new THREE.SpotLight( 0xffffff);
    spotLight.position.set(-300,0,0);
    scene.add(spotLight);

    //introduction variable temporelle
    var chrono = new THREE.Clock();
    chrono.start();
    //temps = chrono.getElapsedTime();
    temps = chrono.getDelta();

    //creation de l'objet
    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    
    material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );//vert
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,0,0);

    material2 = new THREE.MeshBasicMaterial( { color: 0x0033CC } ); //bleu
    cube2 = new THREE.Mesh( geometry, material2 );
    cube2.position.set(1,0,0);

    scene.add( cube,cube2 );

    // initialisation du rendu
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

//

window.addEventListener('keydown',function(event){
    if (event.keyCode == 37){
        keys.left = 1;
    } else if (event.keyCode == 39) {
        keys.right = 1;
    } else if (event.keyCode == 38) {
        keys.up = 1;
    } else if (event.keyCode == 40) {
    keys.down = 1;
    }
});

window.addEventListener('keyup',function(event){
    if (event.keyCode == 37){
        keys.left = 0;
    } else if (event.keyCode == 39) {
        keys.right = 0;
    } else if (event.keyCode == 38) {
        keys.up = 0;
    } else if (event.keyCode == 40) {
    keys.down = 0;
    }
});

//

function animate(){
    temps += 1/60;
    if (keys.left == 1) {
        //cube.rotation.y = -wAng * temps; 
        camera.position.x = 5 * Math.sin(-wAng * temps);
        camera.position.z = 5 * Math.cos(-wAng * temps);

    }
    if (keys.right == 1) {
        //cube.rotation.y = wAng * temps; 
        camera.position.x = 5 * Math.sin(wAng * temps);
        camera.position.z = 5 * Math.cos(wAng * temps);
    }

    

    //camera.position.x = 5 * Math.sin(wAng * temps);
    //camera.position.z = 5 * Math.cos(wAng * temps);
    camera.lookAt(scene.position);

}

function render() {
    requestAnimationFrame( render );
    animate();
    renderer.render( scene, camera );
}

render();


