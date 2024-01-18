import '../scss/style.scss'
import * as THREE from 'three';
import dat from 'dat.gui';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const $container = document.querySelector('.container')
const canvas = document.querySelector('#three-canvas');
const containerRect = canvas.getBoundingClientRect();
const $currentPointer = document.querySelector('.current-pointer');
const $map = document.querySelector('.map');
const $prevBtn = document.querySelector('.popup .prev');
const $nextBtn = document.querySelector('.next');

function Mobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let isMobile = Mobile();

const animFrames = 250;
// const animDuration = anim.duration;
const animDuration = 10.416666984458105;
const $popup = document.querySelector('.popup');
const locationInfos = [
  { location: 'tutorial',name: 'Section 01',elem: $container.querySelector('.popup .inner[data-pop="tutorial"]'), time: [25/animFrames  * animDuration], type: 'stop', isConfirm: false, },
  { location: 'hall-a',  name: 'Section 02',elem: $container.querySelector('.popup .inner[data-pop="hall-a"]'), time: [56/animFrames * animDuration], type: 'stop', isConfirm: false, },
  { location: 'hall-b',  name: 'Section 03',elem: $container.querySelector('.popup .inner[data-pop="hall-b"]'), time: [108/animFrames * animDuration], type: 'stop', isConfirm: false, },
  { location: 'hall-c',  name: 'Section 04',elem: $container.querySelector('.popup .inner[data-pop="hall-c"]'), time: [204/animFrames * animDuration], type: 'stop', isConfirm: false, },
  // { location: 'exit', name: 'Section 05',elem: $container.querySelector('.popup[data-pop="exit"]'),time: [1045/animFrames * animDuration],type: 'stop', isConfirm: false, },
  { location: 'end',  name: '',  elem: $container.querySelector('.popup .inner[data-pop="end"]'), time: [animDuration - 0.001],type: 'pass', isConfirm: false, size: null, fitElem: $container.querySelector('.popup[data-pop="end"] .contents-end'), fitRect: null, },
];


	// Renderer
  let isRequestRender;

  const renderRequest = function (text) {
    isRequestRender = true;
  };

  const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});

  const draw = function () {

    const delta = clock.getDelta();

    if ( isRequestRender ) {
      if ( sceneCamera ) {
        camera.position.copy(sceneCamera.position);
        camera.rotation.copy(sceneCamera.rotation);
      }
  
      // renderer.setSize(containerRect.width, containerRect.height);
      renderer.render(scene, camera);
  
      isRequestRender = false;
    }


  
    window.requestAnimationFrame(draw);
  };

  renderer.setClearColor(0x000000, 1.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

	// Scene
	const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('white',5,30)

	// Camera
  const fov = isMobile ? 100 : 70;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);

	scene.add(camera);

	// Light
  const light = new THREE.AmbientLight('#fff', 2);
  scene.add(light);

  //Sizing
  // const time = 사이즈를 맞출 time
  // const $fitElem = document.getElementById('sizing-camera-mesh-scale-wrap');
  // const fitRect = $fitElem.getBoundingClientRect();
  // const $meshArea = $fitElem.querySelector('.mesh-area');
  // const meshRect = $meshArea.getBoundingClientRect();
  // const mesh = screenInfos.find(e => e.location == 'avideo-1'); 
  // const avideoSize = new THREE.Box3().setFromObject(mesh);
  // const avideoHeight = avideoSize.max.y - avideoSize.min.y;
  // // mesh와 카메라의 거리
  // let cameraDistanceFromMesh = camera.position.distanceTo(avideo.position);
  // // 여백 공간의 비율만큼 meshHeight을 곱함
  // const targetHeight = avideoHeight * $fitElem.offsetHeight / $meshArea.offsetHeight;

  // // mesh의 표면에 맞도록 mesh depth의 절반만큼을 거리에서 뺌
  // cameraDistanceFromMesh -= (avideoSize.max.z - avideoSize.min.z) / 2;

  // // fov 설정
  // camera.fov = 2 * (180 / Math.PI) * Math.atan(targetHeight / (2 * cameraDistanceFromMesh));

  // camera.setViewOffset(
  //   fitRect.width, // 스크린 영역 넓이
  //   fitRect.height, // 스크린 영역 높이
  //   fitRect.width / 2 - meshRect.width / 2 - (meshRect.left - fitRect.left), // offset x
  //   fitRect.height / 2 - meshRect.height / 2 - (meshRect.top - fitRect.top), // offset y
  //   fitRect.width, // 스크린 영역 넓이
  //   fitRect.height // 스크린 영역 높이
  // );

  // camera.updateProjectionMatrix();

  




  //Controls
  const controls = new OrbitControls(camera, renderer.domElement); //orbitControls는 파라미터 두 개를 받는다. camera와 돔엘리먼트

  const screenMeshes = [];
  const screenMeshNames = 'avideo-1, avideo-2, cg-cut-1, cg-cut-2, cg-cut-3, cg-cut-4, cg-cut-5, cg-cut-6, cg-cut-7, cg-cut-8, cg-cut-9, cg-cut-10, unit-74, unit-84, unit-101, unit-124, unit-125, unit-138, end,  '.split(', ');
  const resourcesPath = '/resources/images/';
  const screenInfos = [
    { location: 'avideo-1',  image: `${resourcesPath}cat.webp`,    imageMob: `${resourcesPath}images/cat.webp` },
    { location: 'avideo-2',  image: `${resourcesPath}pets2.webp`,    imageMob: `${resourcesPath}images/pets2.webp` },
    { location: 'cg-cut-1',  image: `${resourcesPath}cat3.webp`,  imageMob: `${resourcesPath}images/cat3.webp` },
    { location: 'cg-cut-2',  image: `${resourcesPath}hedgehog4.webp`,  imageMob: `${resourcesPath}hedgehog4.webp` },
    { location: 'cg-cut-3',  image: `${resourcesPath}dog.webp`,  imageMob: `${resourcesPath}dog.webp` },
    { location: 'cg-cut-4',  image: `${resourcesPath}fox-1.webp`,  imageMob: `${resourcesPath}fox-1.webp` },
    { location: 'cg-cut-5',  image: `${resourcesPath}snow.webp`,  imageMob: `${resourcesPath}snow.webp` },
    { location: 'cg-cut-6',  image: `${resourcesPath}cat-2.webp`,  imageMob: `${resourcesPath}cat-2.webp` },
    { location: 'cg-cut-7',  image: `${resourcesPath}fox5.webp`,  imageMob: `${resourcesPath}fox5.webp` },
    { location: 'cg-cut-8',  image: `${resourcesPath}dog.webp`,  imageMob: `${resourcesPath}dog.webp` },
    { location: 'cg-cut-9',  image: `${resourcesPath}fox-1.webp`,  imageMob: `${resourcesPath}fox-1.webp` },
    { location: 'cg-cut-10', image: `${resourcesPath}snow.webp`,  imageMob: `${resourcesPath}snow.webp` },
    { location: 'unit-74',   image: `${resourcesPath}fox6.webp`, imageMob: `${resourcesPath}fox6.webp` },
    { location: 'unit-84',   image: `${resourcesPath}fox6.webp`, imageMob: `${resourcesPath}fox6.webp` },
    { location: 'unit-101',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'unit-124',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'unit-125',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'unit-138',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'end',       image: `${resourcesPath}fox7.webp`,    imageMob: `${resourcesPath}fox7.webp` }
  ]

  const reflectMeshes = { 
    'a': { 'origin': null, 'plane': null, depthScale: 0.5, minDepthThreshold: 0.3, maxDepthThreshold: 1.0, reflexibility: 1.05, color: 0xc1cbcb, floorWidth: 12.3, floorHeight: 12.3, floorOpacity: 0.85, },
    'c': { 'origin': null, 'plane': null, depthScale: 0.4, minDepthThreshold: 0.3, maxDepthThreshold: 1.0, reflexibility: 1.05, color: 0xc1cbcb, floorWidth: 12.3, floorHeight: 17.1, floorOpacity: 0.6, },
  };

  let obvrMesh;

  // gltf loader
  const gltfLoader = new GLTFLoader();
  let anim, mixer, sceneCamera;
  let animator = {processing: false, time: 0, to: 0, duration: 0, progress: 0, tween: null};
  const meshes = [];

  gltfLoader.load(
    '/resources/models/gardium1.gltf', 
    gltf => {
      console.log(gltf.scene);
      const complex = gltf.scene; //이게 메쉬

      // camera
      sceneCamera = complex.children.find(e => e.name == '카메라');

      //Mesh
      const textureLoader = new THREE.TextureLoader();

      complex.traverse(child => {
        if (child instanceof THREE.Mesh) {
          meshes.push( child );

          // console.log(obvrMesh)

          // setting screen
          if ( screenMeshNames.indexOf(child.name) > -1 ) {
            screenMeshes.push( child );
          }

          console.log(child)

          if ( child.name == 'object-vr-img' )      obvrMesh = child;
          else if ( child.name == 'a-floor' )       reflectMeshes.a.origin = child;
          else if ( child.name == 'a-floor_1' )     reflectMeshes.a.origin = child;
          else if ( child.name == 'a-floor-plane' ) reflectMeshes.a.plane = child;
          else if ( child.name == 'c-floor' )       reflectMeshes.c.origin = child;
          else if ( child.name == 'c-floor-plane' ) reflectMeshes.c.plane = child;
        }
      });

      reflectMeshes.a.mirror = setReflector(reflectMeshes.a);
      reflectMeshes.c.mirror = setReflector(reflectMeshes.c);

      function openani(){
        const directionFrame = 25;
        const directionTime = directionFrame / animFrames * animDuration; // 목적지 프레임에 대한 시간 값 계산
        const directionProgress = directionTime / animDuration;
        const destinationTo = directionProgress * 10000; 
      
        animator.to = destinationTo;
        animator.tween && animator.tween.kill(); 
        animator.tween = gsap.to(animator, {
        time: animator.to,
        ease: 'Power1.easeInOut',
        duration: 2,
        onUpdate: function() {
          // animator progress 계산
          animator.progress = Math.max(0, Math.min(1, animator.time/10000));
      
          // 애니메이션 믹서를 (총 애니메이션 시간 * progress) 시간으로 보내서 애니메이션 이동
          const aniTime = animator.progress * anim.duration;
          mixer.setTime(aniTime);
  
          $currentPointer.style.offsetDistance = '8%';
          
          // setTimeout( function(){
          //   $popup.classList.add('on');
          //   document.querySelector('.inner[data-pop="tutorial"]').classList.add('on');
          //   $map.classList.remove('on');
          // },500)
      
          renderRequest();
            }
          });
      }
      openani();


      function setScreens(){
        for (let i = 0; i < screenMeshes.length; i++) {
          const screenMesh = screenMeshes[i];
          const screenInfo = screenInfos.find(e => e.location == screenMesh.name);
          // const src = isTablet ? screenInfo.imageMob : screenInfo.image;
          const src = screenInfo.image;
          const imageTexture = textureLoader.load(src);
          imageTexture.colorSpace = THREE.SRGBColorSpace;
          screenMesh.material = new THREE.MeshStandardMaterial({ map: imageTexture, side: THREE.DoubleSide });
  
        }
      }
      setScreens();

      
      // animation
      mixer = new THREE.AnimationMixer(complex);
      anim = mixer.clipAction(gltf.animations[0]);
      anim.play();
      anim.duration = gltf.animations[0].duration - 0.0000000001;
      mixer.setTime(0);


      //버튼클릭
      const mapTime = {
        enter: 0, 
        a: locationInfos.find(e => e.location == 'hall-a').time, 
        b: locationInfos.find(e => e.location == 'hall-b').time, 
        c: locationInfos.find(e => e.location == 'hall-c').time, 
        end: locationInfos.find(e => e.location == 'end').time 
      };

      //맵 버튼 클릭
      function mapBtnClick(e){
        let dataLocation = e.currentTarget.getAttribute('data-location');
        let directionFrame, mapPointerPercentage,popupClass; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능

        if(e.currentTarget.classList.contains('prev') && e.currentTarget.parentNode.classList.contains('inner')){
          let siblings = Array.from(e.currentTarget.parentNode.parentNode.children);
          let index = siblings.indexOf(e.currentTarget.parentNode);

          dataLocation = siblings[index - 1].getAttribute('data-pop');

        }else if(e.currentTarget.classList.contains('next') && e.currentTarget.parentNode.classList.contains('inner')){
          let siblings = Array.from(e.currentTarget.parentNode.parentNode.children);
          let index = siblings.indexOf(e.currentTarget.parentNode);
          
          dataLocation = siblings[index + 1].getAttribute('data-pop');

        }

        switch (dataLocation){
          case 'tutorial':
            directionFrame = 25;
            mapPointerPercentage = '8%';
            popupClass = document.querySelector('.inner[data-pop="tutorial"]');
            break;            
          case 'hall-a':
            directionFrame = 56;
            mapPointerPercentage = '27%';
            popupClass = document.querySelector('.inner[data-pop="hall-a"]');
            break;            
          case 'hall-b':
            directionFrame = 108;
            mapPointerPercentage = '44%';
            popupClass = document.querySelector('.inner[data-pop="hall-b"]');
            break;            
          case 'hall-c':
            directionFrame = 204;
            mapPointerPercentage = '72%';
            popupClass = document.querySelector('.inner[data-pop="hall-c"]');
            break;  
          case 'end':
            directionFrame = 249;
            mapPointerPercentage = '97%';
            popupClass = document.querySelector('.inner[data-pop="end"]');
            break;
        }

        const directionTime = directionFrame / animFrames * animDuration; // 목적지 프레임에 대한 시간 값 계산
        const directionProgress = directionTime / animDuration;
        const destinationTo = directionProgress * 10000; 

        animator.to = destinationTo;
        animator.tween && animator.tween.kill(); 
        animator.tween = gsap.to(animator, {
        time: animator.to,
        ease: 'Power1.easeInOut',
        duration: 1,
        onUpdate: function() {
              // animator progress 계산
              animator.progress = Math.max(0, Math.min(1, animator.time/10000));
          
              // 애니메이션 믹서를 (총 애니메이션 시간 * progress) 시간으로 보내서 애니메이션 이동
              const aniTime = animator.progress * anim.duration;
              mixer.setTime(aniTime);

              $currentPointer.style.offsetDistance = mapPointerPercentage;
              $popup.classList.remove('on');
              for (a of $popInner){
                a.classList.remove('on');
              }
              $popup.classList.add('on');
              popupClass.classList.add('on');

              $map.classList.remove('on');
          
              renderRequest();
            }
          });
      }

      //raycaster 펑션
      function rayCaster(frameName){
        let directionFrame,mapPointerPercentage; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능        

        switch (frameName){
          case 'avideo-1':
            directionFrame = 70;
            mapPointerPercentage = '28%';
            break;            
          case 'avideo-2':
            directionFrame = 90;
            mapPointerPercentage = '28%';
            break;            
          case 'cg-cut-1':
             //중앙 맞추기
            directionFrame = 118;
            mapPointerPercentage = '44%';
            break;            
          case 'cg-cut-2':
            directionFrame = 123;
            mapPointerPercentage = '47%';
            break;  
          case 'cg-cut-3':
            directionFrame = 127;
            mapPointerPercentage = '47%';
            break;
          case 'cg-cut-4':
            directionFrame = 130;
            mapPointerPercentage = '47%';
            break;
          case 'cg-cut-5':
            directionFrame = 133;
            mapPointerPercentage = '47%';
            break;
          case 'cg-cut-6':
            directionFrame = 139;
            mapPointerPercentage = '48%';
            break;
          case 'cg-cut-7':
            directionFrame = 157;
            mapPointerPercentage = '50%';
            break;    
          case 'cg-cut-8':
            directionFrame = 162;
            mapPointerPercentage = '50%';
            break;   
          case 'cg-cut-9':
             //중앙 맞추기
            directionFrame = 166;
            mapPointerPercentage = '51%';
            break;   
          case 'cg-cut-10':
            directionFrame = 170;
            mapPointerPercentage = '51%';
            break;
          default: 
            return;
        }

          const directionTime = directionFrame / animFrames * animDuration; // 목적지 프레임에 대한 시간 값 계산
          const directionProgress = directionTime / animDuration;
          const destinationTo = directionProgress * 10000; 
        
          animator.to = destinationTo;
          animator.tween && animator.tween.kill(); 
          animator.tween = gsap.to(animator, {
          time: animator.to,
          ease: 'Power1.easeInOut',
          duration: 1,
          onUpdate: function() {
            // animator progress 계산
            animator.progress = Math.max(0, Math.min(1, animator.time/10000));
        
            // 애니메이션 믹서를 (총 애니메이션 시간 * progress) 시간으로 보내서 애니메이션 이동
            const aniTime = animator.progress * anim.duration;
            mixer.setTime(aniTime);
  
            $currentPointer.style.offsetDistance = mapPointerPercentage;
        
            renderRequest();
              }
            });

      }

      let a,btnIndiv,popupBtn;
      const $popInner  = document.querySelectorAll('.inner');

      //=========맵 버튼 클릭=========
      for(btnIndiv of document.querySelectorAll('.map-btns .btn')){
        btnIndiv.addEventListener('click',function(e){
          mapBtnClick(e);
        })
      }

      //=========팝업 버튼 클릭=========
      for(popupBtn of document.querySelectorAll('.popup .inner button')){
        popupBtn.addEventListener('click',function(e){
          mapBtnClick(e);
        })
      }

      //=========raycaster=========
      let raycaster = new THREE.Raycaster();
      let mouse = new THREE.Vector2();

      function onMouseClick(event) {
        // 마우스의 위치를 정규화(normalized)된 좌표로 변환
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      
        // Raycaster를 업데이트
        raycaster.setFromCamera(mouse, camera);
      
        // 객체와의 교차 검사
        let intersects = raycaster.intersectObjects(scene.children);
      
        // 교차된 객체에 대한 처리
        if (intersects.length > 0) {
          // intersects[0].object에서 교차된 객체에 대한 정보를 얻을 수 있음
          // intersects[0].object.material.color.set(0xff0000);
          // console.log(intersects[0].object.userData.name)
          let frameName = intersects[0].object.userData.name;

          if(screenMeshNames.indexOf(frameName) > -1 ){
            rayCaster(frameName);
          }

        }
      }

      function onMouseMove(event){
        // 마우스의 위치를 정규화(normalized)된 좌표로 변환
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      
        // Raycaster를 업데이트
        raycaster.setFromCamera(mouse, camera);
      
        // 객체와의 교차 검사
        let intersects = raycaster.intersectObjects(scene.children);
        let frameName = intersects[0].object.userData.name;
      
        // 교차된 객체에 대한 처리
        if (intersects.length > 0) {

          if(screenMeshNames.indexOf(frameName) > -1){
            intersects[0].object.material.color.set(0xbbbbbb);
            document.body.style.cursor = "pointer";

          }else{
            scene.children.forEach(obj => {
              if (obj instanceof THREE.Mesh) {
                intersects[0].object.material.color.set(0x00ff00);
                obj.material.color.set(0x00ff00);
                document.body.style.cursor = "auto";
              }
            });
          }

          renderRequest();        
        }        
      }

      document.addEventListener('click', onMouseClick, false);
      // document.addEventListener('mousemove', onMouseMove, false);
    
      scene.add(complex); //메쉬를 scene에 추가

      renderRequest();
    },
    undefined,
    (error) => {
        // 로딩 중 에러가 발생한 경우의 콜백 함수
        console.error('모델 로딩 중 에러:', error);
    }
  );

// Loading
document.querySelector('.content-loading').classList.add('active');

THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  const loadingProgressBar = document.querySelector('.loading-progress_bar');
  const loadProgress = Math.round(itemsLoaded / itemsTotal * 100);
  // console.log(loadProgress)
  loadingProgressBar.style.width = `${loadProgress}%`;


  if ( loadProgress >= 100 ) {
    setTimeout(function(){
      document.querySelector('.content-loading').classList.remove('active');
      $popup.classList.add('on');
      document.querySelector('.inner[data-pop="tutorial"]').classList.add('on');
      $map.classList.remove('on');
    },800)
  }

};


const setReflector = function (reflectMesheObj) {
  const floor = reflectMesheObj.origin;
  const floorPlane = reflectMesheObj.plane;
  const mirror = new Reflector( new THREE.PlaneGeometry( reflectMesheObj.floorWidth, reflectMesheObj.floorHeight ), {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    clipBias: 0,
    color: reflectMesheObj.color,
    depthScale: reflectMesheObj.depthScale,
    minDepthThreshold: reflectMesheObj.minDepthThreshold,
    maxDepthThreshold: reflectMesheObj.maxDepthThreshold,
    reflexibility: reflectMesheObj.reflexibility
  } );

  console.log(floorPlane.position)

  mirror.position.copy(floorPlane.position);
  mirror.position.y += 0.001;
  mirror.rotation.x = -Math.PI / 2;
  scene.add( mirror );

  const material = floor.material.clone();
  material.transparent = true;
  material.opacity = reflectMesheObj.floorOpacity;
  material.depthWrite = false;
  floor.material = material;
  floor.position.y += 0.002;

  floorPlane.material.transparent = true;
  floorPlane.material.opacity = 0;


  // if ( DEBUG ) {
  //   // gui.add(mirror.material.uniforms.minDepthThreshold, 'value', 0, 1, 0.0001).name(`${(floor.name.split('-'))[0]}-minDepth`).onChange(renderRequest);
  //   // gui.add(mirror.material.uniforms.maxDepthThreshold, 'value', 0, 2, 0.0001).name(`${(floor.name.split('-'))[0]}-maxDepth`).onChange(renderRequest);
  //   // gui.add(mirror.material.uniforms.depthScale, 'value', 0, 2, 0.0001).name(`${(floor.name.split('-'))[0]}-depthS`).onChange(renderRequest);
  //   // gui.add(mirror.material.uniforms.reflexibility, 'value', 0, 2).name(`${(floor.name.split('-'))[0]}-reflex`).onChange(renderRequest);
  //   // gui.add(floor.material, 'opacity', 0, 1).name(`${(floor.name.split('-'))[0]}-opacity`).onChange(renderRequest);
  //   // gui.add(floor.position, 'y', -10, 10, 0.01).name(`${(floor.name.split('-'))[0]}-y`).onChange(renderRequest);
  // }

  return { mirror }
}



	// 그리기
	const clock = new THREE.Clock();

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.draw(scene, camera);
	}
  

  //=========wheel 이벤트=========
  let startY, moveY;

  const onWheel = function (e, moveY){
    e.preventDefault();

    const deltaY = moveY !== undefined ? moveY * 5 : e.deltaY !== undefined ? e.deltaY : e.wheelDeltaY !== undefined ? e.wheelDeltaY : e.detail || e.wheelDeltaY * -1;
    const time = new Date().getTime();
    const distance = deltaY * 0.25;

    if(deltaY < 0){
      setTimeout(function(){
        $currentPointer.style.transform = 'rotate(-270deg)';
      },500)
    }else{
      setTimeout(function(){
      $currentPointer.style.transform = 'rotate(-90deg)';
      },500)
    }

    if ( 
      (animator.progress < 0.999 ) ||
      (animator.progress > 0)
    ) {
      onAnimate(distance);
    }

    //공스크롤
    animator.to >= 0 ? onAnimate(distance) : animator.to = 0;
    animator.to <= 10000 ? onAnimate(distance) : animator.to = 10000;

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

          $currentPointer.style.offsetDistance = aniTime / anim.duration * 100 + '%';

          if(animator.progress >= 0.3 && animator.progress <= 0.4){
            $currentPointer.style.offsetDistance = '31%';
          }
          if(animator.progress >= 0.5 && animator.progress <= 0.7){
            $currentPointer.style.offsetDistance = '54%';
          }
          if(animator.progress >= 0.8 && animator.progress <= 0.97){
            $currentPointer.style.offsetDistance = '72%';
          }

          
          if ( animator.progress == 1 ) animator.time = 10000;
          if ( animator.progress == 0 ) animator.time = 0;

          // ================ 팝업 오픈 ================
            for (let i = 0; i < locationInfos.length; i++) {
              if(aniTime < locationInfos[i].time[0] + 0.3 && aniTime > locationInfos[i].time[0] - 0.3){
                if (!locationInfos[i].elem.classList.contains('on') ) {
                  $popup.classList.add('on');
                  $map.classList.remove('on');
                  locationInfos[i].elem.classList.add('on');

                }
              }else{
                if(locationInfos[i].elem.classList.contains('on')){
                  locationInfos[i].elem.classList.remove('on');
                  $popup.classList.remove('on');
                  $map.classList.add('on');
                }
              }
            }
  
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
  window.addEventListener('wheel', onWheel, { passive: false });

  draw(); //로드 완료되면 실행시켜줘야하는 그리기 함수