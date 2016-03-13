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
//setupGui
var parametres = null;
var gui = null;
var folder1 = null;
var folder2 = null;
var folder3 = null;
var coupeX = null;
var coupeY = null;
var coupeZ = null;

//creation cube
var geometry = null;
var group = null;
var material = null; 
var cube = null;
var n = 5; 
//creation axes
var axisHelper = null;
var decal = null;



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

    parametres = {

        nbre_partitions : 5,

        x : 3,
        y : 3,
        z : 3,

        decoupe_sur_axe_X: 5,
        decoupe_sur_axe_Y: 5,
        decoupe_sur_axe_Z: 5,

        sky : false,
    };


    gui = new dat.GUI();

    // Nombre de partitions
    folder1 = gui.addFolder( "Nombre de partitions" );
    folder1.add( parametres, "nbre_partitions", [ 5, 10, 15, 20, 25] ).name( "Nbre de partitions" ).onChange( render );

    // Plans de decoupe
    folder2 = gui.addFolder("Plans de découpe");
    coupeX = folder2.add( parametres, 'x' ).min(0).max(5).step(1).listen();
    coupeY = folder2.add( parametres, 'y' ).min(0).max(5).step(1).listen();
    coupeZ = folder2.add( parametres, 'z' ).min(0).max(5).step(1).listen();
    folder2.open();
      
    // Environnement 
    folder3 = gui.addFolder( "Environnement" );
    folder3.add( parametres, "sky" ).onChange( render );

}

function render() {
    //gestion de l'onglet "nombre des partitions"
    //-------------------------------------------
    //on recupere les valeurs du GUI
    nbre_partitions_cube = parametres.nbre_partitions;

    
    //scene.remove(this.cube.position.x = 0);
    //gestion de l'onglet "plans de decoupe"
    //--------------------------------------
    coupeX.onChange(function(value) {
        console.log(value);
        //coupe_plane();
    })

    
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
    
    creation_cubeRVB(nbre_partitions_cube); //on cree le cube avec n partitions et ses axes
    
    coupe_plane();
    // afficher scene
    renderer.render( scene, camera );

    }


function creation_cubeRVB(n){
        //on cherche a creer un cube de taille 1 avec n x n x n partitions de cube 
        //creation du cube de base
        n = n-1; //n+1 partitions !
        geometry = new THREE.BoxGeometry( 1/n, 1/n, 1/n );
       
        //on va ajouter n x n x n cubes de tailles 1/n
        group = new THREE.Group();

        for ( var i = 0; i <= 1; i += 1/n ) {
            for ( var j = 0; j <= 1; j += 1/n ) {
                for ( var k = 0; k <= 1; k += 1/n ) {
                    // le cube RVB est code sur 3 canaux dont chacun varie de 0 a 255
                    var r = (i*255);  //canal rouge
                    x = parseInt(r);
                    //console.log(r);
                    var g = (j*255); // canal vert 
                    y=parseInt(g);
                    var b = (k*255);  //canal bleu
                    z=parseInt(b);

                    material = new THREE.MeshBasicMaterial({ color: "rgb("+x+", "+y+", "+z+")" });

                    cube = new THREE.Mesh( geometry, material );
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
    axisHelper = new THREE.AxisHelper(500);
    decal = -1/(2*n);
    //console.log(decal);
    axisHelper.position.set(decal,decal,decal); //on se positionne au sommet noir du cube 
    group.add( axisHelper ); // on ajoute les axes sur le groupe 
}


function coupe_plane(){
    group.remove(cube.position.x = 0);
}