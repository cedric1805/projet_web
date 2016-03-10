//Détection des facultés WebGl du browser
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//Déclaration des variables standards
//-----------------------------------
var container; //Elément conteneur du DOM
var camera, controls, scene, renderer; 
//var controls;//Contrôle de l'affichage
//var renderer;//Renderer WebGL
var cube, group;

var axisHelper;
var floor;

var n = 10; //n+1 partitions !





function change(n) {
    //on supprime la scene courante
    scene.remove(group); // le groupe contenant les cubes et les axes

    creation_cubeRVB(n); //on cree le cube avec n partitions et ses axes
    return false;
}



var options = '';
for (var i = 1; i < 6; i++) {
    var j = 5*i;
    //<a href="#" lien interne, protocol HTTP
    options += '<a href="#" onclick="return change(' + j + ')">' + j + '</a> '; //on appelle la fonction change() pour le n selectionne
}
document.getElementById('options').innerHTML = options;







init();
animate(); 

function init(){
   
    container = document.createElement( 'div' );
    document.body.appendChild( container );

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
    creation_cubeRVB(n);
    //creation_sol();
    


    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

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



function creation_cubeRVB(n){
        //on cherche a creer un cube de taille 1 avec n x n x n partitions de cube 
        //creation du cube de base
        var geometry = new THREE.BoxGeometry( 1/n, 1/n, 1/n );
       
        //on va ajouter n x n x n cubes de tailles 1/n
        group = new THREE.Group();

        for ( var i = 0; i <= 1; i += 1/n ) {
            for ( var j = 0; j <= 1; j += 1/n ) {
                for ( var k = 0; k <= 1; k += 1/n ) {
                    // le cube RVB est code sur 3 canaux dont chacun varie de 0 a 255
                    var r = (i*255);  //canal rouge
                    x=parseInt(r);
                    //console.log(r);
                    var g = (j*255); // canal vert 
                    y=parseInt(g);
                    var b = (k*255);  //canal bleu
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

        
        creation_axe(n); // on rajoute les axes
        
        
       
        scene.add( group );

}

function creation_axe(n){
    //creation axes
    var axisHelper = new THREE.AxisHelper(500);
    var decal = -1/(2*n);
    //console.log(decal);
    axisHelper.position.set(decal,decal,decal); //on se positionne au sommet noir du cube 
    group.add( axisHelper ); // on ajoute les axes sur le groupe 
}



function creation_sol(){
        //  Sol de la scène
    //-----------------                
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000); //géométrie du sol
    var floorTexture = new THREE.ImageUtils.loadTexture('texture/herbe.png');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 100, 100 );
    var floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture}); //materiau du sol
    var floor = new THREE.Mesh(floorGeometry, floorMaterial); //association de la géométrie et du matériau
    floor.position.set( 0, -1, 0 ); //positionnement
    floor.rotation.x = -Math.PI/2; //sol horizontal (!)
    scene.add(floor); //attachement du sol à la scène
}





    
