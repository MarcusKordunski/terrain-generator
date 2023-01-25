import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';


function setup() {
  const vars = {};
  // Setup changeable values
  vars.h = 400; // Height of initial field
  vars.w = 400; // Width of initial field
  vars.rectW = 5; // Width of polygon
  vars.rectH = 5; // Height of polygon
  vars.amplitude = 0.8; // Generation random amplitude
  vars.rows = vars.w / vars.rectW;
  vars.cols = vars.h / vars.rectH;
  return vars;
}

const vars = setup()
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 175;
camera.position.x = vars.w / 2;
camera.position.y = -470;
camera.rotation.x = 1

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomFloat(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1200, -300, 160);
light.target.position.set(400, -400, 0);
scene.add(light);
  
function render() {
  const vars = setup();
  let prevVerHeights = {};
  let prevHorHeight = 7;
  let isMountain = false;
  let mountainCounter = 0;
  
  for (let i = 0; i < vars.rows; i++) {
    for (let j = 0; j < vars.cols; j++) {
    
      let height;
      if (getRandomNum(0, 800) === 7 && isMountain === false) {
        isMountain = true;
      }
      if (isMountain === true && prevVerHeights[j] && mountainCounter < 7) {
        mountainCounter += 1;
        height = getRandomFloat(
          (prevVerHeights[j] + prevHorHeight) / 2 + 4,
          (prevVerHeights[j] + prevHorHeight) / 2 + 8,
          2
        );
      } else if (
        isMountain === true &&
        prevVerHeights[j] &&
        mountainCounter < 14
      ) {
        mountainCounter += 1;
        height = getRandomFloat(
          (prevVerHeights[j] + prevHorHeight) / 2 - 4,
          (prevVerHeights[j] + prevHorHeight) / 2 - 8,
          2
        );
      } else if (prevVerHeights[j]) {
        mountainCounter = 0;
        isMountain = false;
        height = getRandomFloat(
          (prevVerHeights[j] + prevHorHeight) / 2 - vars.amplitude,
          (prevVerHeights[j] + prevHorHeight) / 2 + vars.amplitude,
          2
        );
      } else {
        height = getRandomFloat(
          prevHorHeight - vars.amplitude,
          prevHorHeight + vars.amplitude,
          2
        );
      }
      

      var geometry = new THREE.BoxGeometry( 5, 5, 5);
      var material = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide,
      emissive: 0x000000,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1} );
      var cube = new THREE.Mesh( geometry, material );
      cube.scale.z = height
      scene.add( cube );
      var geo = new THREE.WireframeGeometry( cube.geometry );
      var mat = new THREE.LineBasicMaterial( { color: 0xffffff } );
      var wireframe = new THREE.LineSegments( geo, mat );
      cube.add( wireframe );
      cube.position.x += 5 * j;
      cube.position.y -= 5 * i;
      prevVerHeights[j] = height;
      prevHorHeight = height;

    }
  }
}
render();
renderer.render(scene, camera)