import '../scss/style.scss'
import * as THREE from 'three';
import dat from 'dat.gui';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


	// Renderer
	const canvas = document.querySelector('#three-canvas');
  const containerRect = canvas.getBoundingClientRect();
  let isRequestRender;

  const renderRequest = function (text) {
    isRequestRender = true;
  };

  const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});

  const render = function () {

    const delta = clock.getDelta();

    // if(mixer){
    //   mixer.update( delta ); //애니메이션 플레이어. 애니메이션을 업데이트합니다. (delta 값 사용), 애니메이션 있는지 확인용임
    // }

    if ( isRequestRender ) {
      if ( sceneCamera ) {
        camera.position.copy(sceneCamera.position);
        camera.rotation.copy(sceneCamera.rotation);
      }
  
      // renderer.setSize(containerRect.width, containerRect.height);
      renderer.render(scene, camera);
  
      isRequestRender = false;
    }
  
    window.requestAnimationFrame(render);
  };

  renderer.setClearColor('white');
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		80, //카메라시야각
		window.innerWidth / window.innerHeight, //화면의 가로세로비율 (화면너비/높이)
		0.1, //이만큼 가까이가면 안보임
    1000 //이정도 멀리가면 안보임

	);

	scene.add(camera);


	// Light
	const ambientLight = new THREE.AmbientLight('white', 2);
	scene.add(ambientLight);


  //Controls
  const controls = new OrbitControls(camera, renderer.domElement); //orbitControls는 파라미터 두 개를 받는다. camera와 돔엘리먼트



	// Dat GUI
	const gui = new dat.GUI();
	// gui.add(camera.position, 'x', -5, 5, 0.1).name('카메라 X');
	// gui.add(camera.position, 'y', -5, 15, 0.1).name('카메라 Y');
	// gui.add(camera.position, 'z', 2, 10, 0.1).name('카메라 Z');

  // gltf loader
  const gltfLoader = new GLTFLoader();
  let anim, mixer, sceneCamera;
  let animator = {processing: false, time: 0, to: 0, duration: 0, progress: 0, tween: null};

  gltfLoader.load(
    '/resources/models/gardium1.gltf', 
    gltf => {
      console.log(gltf.scene);
      const complex = gltf.scene; //이게 메쉬

      // camera
      sceneCamera = complex.children.find(e => e.name == '카메라');

      //Mesh
      const textureLoader = new THREE.TextureLoader();

      const screenMesh = complex.children.find(e => e.name == 'avideo-1');;
      const src = `/resources/images/cat.webp`;
      const imageTexture = textureLoader.load(src);

      imageTexture.colorSpace = THREE.SRGBColorSpace; // 이미지 색감 표현을 위한 encoding 형태
      screenMesh.material = new THREE.MeshStandardMaterial({ map: imageTexture, side: THREE.DoubleSide });
      
      // animation
      mixer = new THREE.AnimationMixer(complex);
      anim = mixer.clipAction(gltf.animations[0]);
      anim.play();
      anim.duration = gltf.animations[0].duration - 0.0000000001;
      mixer.setTime(0);

      scene.add(complex); //메쉬를 scene에 추가

      renderRequest();
    },
    undefined,
    (error) => {
        // 로딩 중 에러가 발생한 경우의 콜백 함수
        console.error('모델 로딩 중 에러:', error);
    }
  );

	// 그리기
	const clock = new THREE.Clock();

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

  //=========wheel 이벤트=========
  let startY, moveY;

  const onWheel = function (e, moveY){
    e.preventDefault();

    const deltaY = moveY !== undefined ? moveY * 5 : e.deltaY !== undefined ? e.deltaY : e.wheelDeltaY !== undefined ? e.wheelDeltaY : e.detail || e.wheelDeltaY * -1;
    const time = new Date().getTime();
    const distance = deltaY * 0.25;

    if ( 
      (animator.progress < 0.999 ) ||
      (animator.progress > 0)
    ) {
      onAnimate(distance);
    }

    console.log(animator.progress)

  }

  //=========카메라 애니메이션=========
  const onAnimate = function (distance) {
    const to = animator.to + distance;
  
    if (animator.to !== to) {
      animator.to = to;
      animator.tween && animator.tween.kill(); 
      animator.tween = gsap.to(animator, 1, {
        time: animator.to,
        ease: 'sine.out',
        onUpdate: function() {
          animator.processing = true;
          animator.progress = Math.max(0, Math.min(1, animator.time/10000));
          const aniTime = animator.progress * anim.duration;
          mixer.setTime(aniTime);
          
          if ( animator.progress == 1 ) animator.time = 10000;
          if ( animator.progress == 0 ) animator.time = 0;
  
          renderRequest();
        },
        onComplete: function() {
          animator.processing = false;
        }
      });
    } 
  }


	// 이벤트
	window.addEventListener('resize', setSize);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  render(); //로드 완료되면 실행시켜줘야하는 그리기 함수