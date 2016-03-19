//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//  
//                    Cube RGB – coupe plane
//
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//Objectif
//--------
/*Fournir une scène WebGL contenant un cube RGB avec un mécanisme de coupe plane
permettant de faire disparaître une partie du cube, afin de voir l'intérieur du cube. 
*/
//Cahier des charges 
//------------------
/*Le cube RGB, de côté 1, sera constitué de n.n.n petits cubes colorés, 
chaque cube ayant un diamètre de 1/n. Sa couleur est déterminée par sa place au sein du cube RGB. 
L'utilisateur pourra faire pivoter le cube dans toutes les dimensions. 
Le cube sera appuyé sur trois axe de coordonnées formant un repère orthonormé, 
dont le point origine se confond avec le sommet noir du cube. Les trois axes ne sont matérialisés
 qu’à leur sortie du cube, et ils sont uniformément de la couleur du point du cube dont ils se détachent. 

Un curseur sur chacun des trois axes permettra de faire glisser un plan de coupe dans le cube.
Ce plan non matérialisé, ne laissera voir que les petits cubes dont le centre est
du même côté que l'origine par rapport au plan de coupe. 
*/
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//Détection des facultés WebGl du browser
//---------------------------------------
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

//Déclaration des variables 
//-------------------------
//environnement
var container = null; //Elément conteneur du DOM
var canvasWidth = null;
var canvasHeight = null;
var scene  = null;
var sceneCube = null;
//camera
var camera =null;
//lumiere
var ambientLight = null;
var light = null; 
//render
var renderer = null;
//control
var cameraControls = null;
// REFLECTION MAP
var path = null;
var urls = null;
var textureCube = null;
// SKYBOX
var shader = null;
var skyboxMaterial = null;
var skybox = null;
var nbre_partitions = null;

//creation cube
var geometry = null;
var group = false;
//var material = null; 
var cubes = null;
var n = 4; 
//creation axes
var axisHelper = null;
var decal = null;
//setupGui
var parametres = {

    nbre_partitions : 5,

    x : 1,
    y : 1,
    z : 1,

    decoupe_sur_axe_X: 5,
    decoupe_sur_axe_Y: 5,
    decoupe_sur_axe_Z: 5,

    sky : false,
};



//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//Appel des fonctions
//-------------------
init();
render();

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//Definitions des fonctions 
//-------------------------
function init(){
  
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    // CAMERA
    camera = new THREE.PerspectiveCamera( 60, canvasWidth / canvasHeight, 1, 10000 );
    camera.position.set(2,2,2);

    // LIGHTS
    ambientLight = new THREE.AmbientLight( 0x333333 );  // 0.2
    light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xAAAAAA );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( canvasWidth, canvasHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );

    // EVENTS
    window.addEventListener( 'resize', onWindowResize, false );

    // CONTROLS
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.addEventListener( 'change', render );

    // REFLECTION MAP
    path = "textures/cube/skybox/";
    urls = [
        path + "px.jpg", path + "nx.jpg",
        path + "py.jpg", path + "ny.jpg",
        path + "pz.jpg", path + "nz.jpg"
    ];

    textureCube = new THREE.CubeTextureLoader().load( urls );

    // SKYBOX
    shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    skyboxMaterial = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.BackSide

    } );

    skybox = new THREE.Mesh( new THREE.BoxGeometry( 5000, 5000, 5000 ), skyboxMaterial );

    // skybox scene - keep camera centered here
    sceneCube = new THREE.Scene();
    sceneCube.add( skybox );

    // scene itself
    scene = new THREE.Scene();

    scene.add( ambientLight );
    scene.add( light );

    // GUI
    setupGui();
}

// EVENT HANDLERS

function onWindowResize() {

    //var canvasWidth = window.innerWidth;
    //var canvasHeight = window.innerHeight;

    renderer.setSize( canvasWidth, canvasHeight );

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    render();

}

function setupGui() {

    parametres


    var gui = new dat.GUI();

    // Nombre de partitions
    var folder1 = gui.addFolder( "Nombre de partitions" );
    nbre_partitions = folder1.add( parametres, "nbre_partitions", [ 5, 10, 15, 20, 25] ).name( "Nbre de partitions" ).onChange(function() {
        n = parametres.nbre_partitions - 1;
        creation_cubeRVB();
        render();
    });

    // Plans de decoupe
    var folder2 = gui.addFolder("Plans de découpe");
    folder2.add( parametres, 'x' ).min(0).max(1).step(0.01).listen().onChange(render);
    folder2.add( parametres, 'y' ).min(0).max(1).step(0.01).listen().onChange(render);
    folder2.add( parametres, 'z' ).min(0).max(1).step(0.01).listen().onChange(render);
    folder2.open();
      
    // Environnement 
    var folder3 = gui.addFolder( "Environnement" );
    folder3.add( parametres, "sky" ).onChange( render );

    creation_cubeRVB(nbre_partitions.getValue()); //on cree le cube avec n partitions et ses axes

}

function render() {
    //gestion de l'onglet "nombre des partitions"
    //-------------------------------------------
    //on recupere les valeurs du GUI
    console.log('render');

    
    //gestion de l'onglet "environnement"
    //-----------------------------------
    //on teste si la case sky est cochée
    if ( parametres.sky ) {
        //clear to skybox
        renderer.autoClear = false;
        skybox.position.copy( camera.position );
        renderer.render( sceneCube, camera );
    }
    else {
        // clear to regular background color
        renderer.autoClear = true;
    }

    
    //on supprime la scene courante
    scene.remove(group); // le groupe contenant les cubes et les axes
    group = new THREE.Group();
    coupe_plane();
    creation_axe();
    scene.add(group);
    
    renderer.render( scene, camera );
}


function creation_cubeRVB(){
        //on cherche a creer un cube de taille 1 avec n x n x n partitions de cube 
        //creation du cube de base
        var c = 1/n;
        var geometry = new THREE.BoxGeometry( c,c,c );
       
        //on va ajouter n x n x n cubes de tailles 1/n
        if (!(group === false)) {scene.remove(group); group = null;}
        group = new THREE.Group();

        cubes = new Array(n+1);

        for ( var i = 0; i <= n; i++ ) {

            var x = parseFloat(i/n);
            var r = parseInt(x * 255);  //canal rouge
            cubes[i] = new Array(n+1);

            for ( var j = 0; j <= n; j++ ) {

                var y = parseFloat(j/n);
                var v = parseInt(y * 255);  //canal vert
                cubes[i][j] = new Array(n+1);

                for ( var k = 0; k <= n; k++ ) {
                    // le cube RVB est codé sur 3 canaux dont chacun varie de 0 a 255
                    var z = parseFloat(k/n);
                    var b = parseInt(z * 255);  //canal bleu

                    material = new THREE.MeshBasicMaterial({ color: "rgb("+r+", "+v+", "+b+")" });

                    cubes[i][j][k] = new THREE.Mesh(geometry, material );
                    cubes[i][j][k].position.set(x, y, z);
                   
                    cubes[i][j][k].matrixAutoUpdate = false;
                    cubes[i][j][k].updateMatrix();

                }//k   
            }//j
        }//i
}

function creation_axe(){
    //creation axes
    axisHelper = new THREE.AxisHelper(500);
    decal = -1/(2*n);
    axisHelper.position.set(decal,decal,decal); //on se positionne au sommet noir du cube 
    group.add( axisHelper ); // on ajoute les axes sur le groupe 
}


function coupe_plane(){
    for ( var i = 0; i <= n; i++ ) {
        for ( var j = 0; j <= n; j++ ) {
            for ( var k = 0; k <= n; k++ ) {
                //console.log(i,j,k);
                if (cubes[i][j][k].position.x <= parametres.x && cubes[i][j][k].position.y <= parametres.y && cubes[i][j][k].position.z <= parametres.z) {
                    group.add( cubes[i][j][k] );
                }
            }//k   
        }//j
    }//i
}