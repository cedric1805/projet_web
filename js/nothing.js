var vAngX=0.02;
var vAngY=0.03;
var scene = new THREE.Scene();
var camera = new
THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,0,300)
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);
var axisHelper = new THREE.AxisHelper(70);
scene.add(axisHelper);
var boxGeo= new THREE.BoxGeometry(50,50,50);
var boxMat=new THREE.MeshLambertMaterial({color: 0xff00ff});
var box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);
var pointLight = new THREE.PointLight( 0xffffff);
pointLight.position.set(60,60,60);
scene.add(pointLight);
var spotLight = new THREE.SpotLight( 0xffffff);
spotLight.position.set(-300,0,0);
scene.add(spotLight);
function render() {
requestAnimationFrame(render);
box.rotation.y=box.rotation.y+vAngY
box.rotation.x=box.rotation.x+vAngX
renderer.render(scene, camera);
}
render();