import '../scss/style.scss'
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/addons/objects/Reflector.js';

const $container = document.querySelector('.container')
const canvas = document.querySelector('#three-canvas');
const $currentPointer = document.querySelector('.current-pointer');
const $map = document.querySelector('.map');
const $popInner  = document.querySelectorAll('.inner');
const $wrap = document.getElementById('sizing-camera-mesh-scale-wrap');
let wrapRect;
wrapRect = $wrap.getBoundingClientRect();
let isMobile = Mobile();
let isRequestRender;
let a,btnIndiv,popupBtn;
let startFov, startView;

const animFrames = 250;
const animDuration = 10.416666984458105;
const $popup = document.querySelector('.popup');
const locationInfos = [
  { location: 'tutorial',name: 'Section 01',elem: $container.querySelector('.popup .inner[data-pop="tutorial"]'), title:$container.querySelectorAll('.title-inner[data-title="tutorial"] .letter'), time: [25/animFrames  * animDuration], type: 'stop', isConfirm: false, },
  { location: 'hall-a',  name: 'Section 02',elem: $container.querySelector('.popup .inner[data-pop="hall-a"]'), title:$container.querySelectorAll('.title-inner[data-title="hall-a"] .letter'), time: [56/animFrames * animDuration], type: 'stop', isConfirm: false, },
  { location: 'hall-b',  name: 'Section 03',elem: $container.querySelector('.popup .inner[data-pop="hall-b"]'), title:$container.querySelectorAll('.title-inner[data-title="hall-b"] .letter'), time: [108/animFrames * animDuration], type: 'stop', isConfirm: false, },
  { location: 'hall-c',  name: 'Section 04',elem: $container.querySelector('.popup .inner[data-pop="hall-c"]'), title:$container.querySelectorAll('.title-inner[data-title="hall-c"] .letter'), time: [204/animFrames * animDuration], type: 'stop', isConfirm: false, },
  { location: 'end',  name: '',  elem: $container.querySelector('.popup .inner[data-pop="end"]'), title:$container.querySelector('.title-inner[data-title="end"]'), time: [animDuration - 0.001],type: 'pass', isConfirm: false, size: null, fitElem: $container.querySelector('.popup[data-pop="end"] .contents-end'), fitRect: null, },
];

const sizingInfos = [
  { location: 'avideo-1',name: 'avideo-1',elem: $container.querySelector('#sizing-camera-mesh-scale-wrap'), time: [70/animFrames  * animDuration, 90/animFrames  * animDuration], type: 'pass', isConfirm: false, size: null, fitElem: document.querySelector('.avideo-1'), fitRect: null,},
]

const screenMeshes = [];
const screenMeshNames = 'avideo-1, avideo-2, cg-cut-1, cg-cut-2, cg-cut-3, cg-cut-4, cg-cut-5, cg-cut-6, cg-cut-7, cg-cut-8, cg-cut-9, cg-cut-10, unit-74, unit-84, unit-101, unit-124, unit-125, unit-138, end,  '.split(', ');
const resourcesPath = 'resources/images/';
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
  'a': { 'origin': null, 'plane': null, depthScale: 0.5, minDepthThreshold: 0.3, maxDepthThreshold: 1.0, reflexibility: 1.05, color: 0x9fa0a0, floorWidth: 12.3, floorHeight: 12.3, floorOpacity: 0.01, },
  'c': { 'origin': null, 'plane': null, depthScale: 0.4, minDepthThreshold: 0.3, maxDepthThreshold: 1.0, reflexibility: 1.05, color: 0x9fa0a0, floorWidth: 12.3, floorHeight: 17.1, floorOpacity: 0, },
};

	//=========Renderer=========
  const renderRequest = function (text) {
    isRequestRender = true;
  };

  const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
	});

  renderer.setClearColor(0x000000, 1.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
	//=========Scene=========
	const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('white',5,30);

	//=========Camera=========
  const fov = isMobile ? 100 : 70;
  const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
	scene.add(camera);

	//=========Light=========
  const light = new THREE.AmbientLight('#fff', 2);
  scene.add(light);

  //=========gltf loader=========
  const gltfLoader = new GLTFLoader();
  let anim, mixer, sceneCamera;
  let animator = {processing: false, time: 0, to: 0, duration: 0, progress: 0, tween: null};
  const meshes = [];

  gltfLoader.load(
    'resources/models/gardium1.gltf', 
    gltf => {
      console.log(gltf.scene);
      const complex = gltf.scene;

      // camera
      sceneCamera = complex.children.find(e => e.name == '카메라');

      //Mesh
      const textureLoader = new THREE.TextureLoader();

      complex.traverse(child => {
        let obvrMesh;

        if (child instanceof THREE.Mesh) {
          meshes.push( child );

          // setting screen
          if ( screenMeshNames.indexOf(child.name) > -1 ) {
            screenMeshes.push( child );
          }

          if ( child.name == 'object-vr-img' )      obvrMesh = child;
          else if ( child.name == 'a-floor' )       reflectMeshes.a.origin = child;
          else if ( child.name == 'a-floor_1' )     reflectMeshes.a.origin = child;
          else if ( child.name == 'a-floor-plane' ) reflectMeshes.a.plane = child;
          else if ( child.name == 'c-floor' )       reflectMeshes.c.origin = child;
          else if ( child.name == 'c-floor-plane' ) reflectMeshes.c.plane = child;
        }

          // changeSizing(sizingInfo, aniTime, startView);

      });
      let raycaster = new THREE.Raycaster();
      let mouse = new THREE.Vector2();

      function setAnimation (){
        mixer = new THREE.AnimationMixer(complex);
        anim = mixer.clipAction(gltf.animations[0]);
        anim.play();
        anim.duration = gltf.animations[0].duration - 0.0000000001;
        mixer.setTime(0);
      }

      function openingAnimation(){
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
    
          renderRequest();
            }
          });
      }

      function setScreens(){
        for (let i = 0; i < screenMeshes.length; i++) {
          const screenMesh = screenMeshes[i];
          const screenInfo = screenInfos.find(e => e.location == screenMesh.name);
          const src = screenInfo.image;
          const imageTexture = textureLoader.load(src);
          imageTexture.colorSpace = THREE.SRGBColorSpace;
          screenMesh.material = new THREE.MeshStandardMaterial({ map: imageTexture, side: THREE.DoubleSide });
  
        }
      }

      const mapTime = {
        enter: 0, 
        a: locationInfos.find(e => e.location == 'hall-a').time, 
        b: locationInfos.find(e => e.location == 'hall-b').time, 
        c: locationInfos.find(e => e.location == 'hall-c').time, 
        end: locationInfos.find(e => e.location == 'end').time 
      };

      function mapBtnClick(e){
        let dataLocation = e.currentTarget.getAttribute('data-location');
        let directionFrame, mapPointerPercentage,popupClass, hallTitle; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능

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
            hallTitle = locationInfos[0].title;
            break;            
          case 'hall-a':
            directionFrame = 56;
            mapPointerPercentage = '27%';
            popupClass = document.querySelector('.inner[data-pop="hall-a"]');
            hallTitle = locationInfos[1].title;
            break;            
          case 'hall-b':
            directionFrame = 108;
            mapPointerPercentage = '44%';
            popupClass = document.querySelector('.inner[data-pop="hall-b"]');
            hallTitle = locationInfos[2].title;
            break;            
          case 'hall-c':
            directionFrame = 204;
            mapPointerPercentage = '72%';
            popupClass = document.querySelector('.inner[data-pop="hall-c"]');
            hallTitle = locationInfos[3].title;
            break;  
          case 'end':
            directionFrame = 249;
            mapPointerPercentage = '97%';
            popupClass = document.querySelector('.inner[data-pop="end"]');
            hallTitle = locationInfos[4].title;
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

              for( a of document.querySelectorAll('.letter')){
                // if(a.style.opacity !== 0){
                  // setTimeout(function(){hallTitleAnim(hallTitle);},100)
                  // hallTitleAnim(hallTitle);
                // }
              }


              $map.classList.remove('on');
          
              renderRequest();
            }
          });
      }

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
          let frameName = intersects[0].object.userData.name;

          if(screenMeshNames.indexOf(frameName) > -1 ){
            rayCaster(frameName);
          }

        }
      }      

      //========= init =========
      openingAnimation();
      setScreens();
      setAnimation();

      reflectMeshes.a.mirror = setReflector(reflectMeshes.a);
      reflectMeshes.c.mirror = setReflector(reflectMeshes.c);

      scene.add(complex);

      renderRequest();
      resizeScreen();


      for(btnIndiv of document.querySelectorAll('.map-btns .btn')){
        btnIndiv.addEventListener('click',function(e){
          mapBtnClick(e);
        })
      }
      for(popupBtn of document.querySelectorAll('.popup .inner button')){
        popupBtn.addEventListener('click',function(e){
          mapBtnClick(e);
        })
      }
      document.addEventListener('click', onMouseClick, false);

    },
    undefined,
    (error) => {
        console.error('모델 로딩 중 에러:', error);
    }
  );

  let fovs,viewX,viewY;
  function resizeScreen(){
    // const fitHeihgtRatio = (areaHeight - footerHeight*2) / areaHeight;
    // const sizingValues = { fitFov: fovs, viewX: viewX, viewY: viewY };
    const currentTime = mixer.time;

    // * startFov, startView 는 휠 gsap, 특정 영역으로 이동하는 gsap가 시작할때, 끝났을 때 한번씩 업데이트
    if( startFov == null ) startFov = camera.fov;
    if( startView == null ) startView = camera.view;

    // sizing 값 설정
    meshes.forEach((mesh)=>{

    // console.log(document.querySelector('.avideo-1').offsetHeight, 'resizeee')

    const sizingInfo = sizingInfos.find(e => e.location === mesh.name);
    const $screen = $container.querySelector('.avideo-1');
    

      if (screenMeshNames.indexOf(mesh.name) > -1) {
        if ( mesh.name == 'avideo-1' ) {
          // setting min-height 이건 뭔지 모르겠음
          sizingInfo.fitRect = $screen.getBoundingClientRect();

          // setting sizing
          const size = new THREE.Box3().setFromObject(mesh);
          sizingInfo.size = size;
          sizingInfo.sizeHeight = size.max.y - size.min.y;
          sizingInfo.sizeDepth = size.max.z - size.min.z;

          mixer.setTime(sizingInfo.time[0]);
          camera.position.copy(sceneCamera.position);
          camera.rotation.copy(sceneCamera.rotation);
    
          const cameraDistanceFromMesh = camera.position.distanceTo(mesh.position);

          // console.log(sizingInfo.sizeHeight, wrapRect.height, sizingInfo.fitElem.offsetHeight)
          const targetHeight = sizingInfo.sizeHeight * wrapRect.height / sizingInfo.fitElem.offsetHeight;
          const fovs = 2 * (180 / Math.PI) * Math.atan(targetHeight / (2 * cameraDistanceFromMesh));
          const fitRect = sizingInfo.fitRect;

          const viewX = wrapRect.width/2 - fitRect.width/2 - (fitRect.left - wrapRect.left);
          const viewY = wrapRect.height/2 - fitRect.height/2 - (fitRect.top - wrapRect.top);

          sizingInfo.fitFov = fovs;
          sizingInfo.viewX = viewX;
          sizingInfo.viewY = viewY;
          // console.log(sizingInfo.viewX, sizingInfo.viewY)
          // 애니메이션 타임 다시 초기화
          mixer.setTime(currentTime);
   
          changeSizing(sizingInfo, currentTime, startView);
        }
      }
    })
  }

  const changeSizing = function (sizingInfo, aniTime, startView) {

    if ( screenMeshNames.indexOf(sizingInfo.location) == -1 ) return;
    if ( !sizingInfo.fitElem ) return;

    const targetTime = sizingInfo.time;
    const targetFov = sizingInfo.fitFov;
    const viewX = sizingInfo.viewX;
    const viewY = sizingInfo.viewY;
  
    if ( 
      targetTime.length > 1 ? 
        Math.abs(aniTime - targetTime[0]) < 0.2 || Math.abs(aniTime - targetTime[1]) < 0.2 :
        Math.abs(aniTime - targetTime[0]) < 0.2 
    ) {
      const gap = startFov - targetFov;
      const time = targetTime.length > 1 ? 
        [Math.abs(aniTime - targetTime[0]) * 2, Math.abs(aniTime - targetTime[1]) * 2] : 
        [Math.abs(aniTime - targetTime[0]) * 2];
      
      let progress;
      if ( time.length == 1 ) {
        progress = Math.max(0, Math.min(1, 1 - time[0]));
      } else {
        progress = 
          aniTime < targetTime[0] ? Math.max(0, Math.min(1, 1 - time[0])) : 
          aniTime > targetTime[1] ? Math.max(0, Math.min(1, 1 - time[1])) : 1
      };
      startView = aniTime > targetTime[1] ? { offsetX: 0, offsetY: 0 } : startView;

      onSizing( viewX, viewY, gap, progress, startFov, startView);

      if ( aniTime > targetTime[0] && aniTime < targetTime[1] && Math.abs(camera.fov - targetFov) > .3 ) {
        camera.fov = targetFov;
      }
    }
  }

  const onSizing = function (viewX, viewY, gap, progress, startFov, startView) {
  // const onSizing = function (viewX, viewY, startFov, startView, areaRect, meshRect) {
    // 기본 값 설정
    startFov = startFov ? startFov : 60;
    startView = startView ? startView : { offsetX: 0, offsetY: 0 };

    const $wrap = document.getElementById('sizing-camera-mesh-scale-wrap');
    const areaRect = $wrap.getBoundingClientRect();

    camera.fov = startFov - gap*(progress);
    camera.setViewOffset(
      areaRect.width, 
      areaRect.height,
      startView.offsetX + (viewX - startView.offsetX) * progress,
      startView.offsetY + (viewY - startView.offsetY) * progress,
      areaRect.width,
      areaRect.height
    );
  
    camera.updateProjectionMatrix();
    renderRequest();
  }

  //=========Loading=========
  document.querySelector('.content-loading').classList.add('active');
  THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    const loadingProgressBar = document.querySelector('.loading-progress_bar');
    const loadProgress = Math.round(itemsLoaded / itemsTotal * 100);
    loadingProgressBar.style.width = `${loadProgress}%`;


    if ( loadProgress >= 100 ) {

      setTimeout(function(){
        let title = document.querySelectorAll('.title-inner[data-title="tutorial"] .letter');
        hallTitleAnim(title);
        document.querySelector('.content-loading').classList.remove('active');
        $popup.classList.add('on');
        document.querySelector('.inner[data-pop="tutorial"]').classList.add('on');
        $map.classList.remove('on');
      },800)
    }

  };

  

  //=========홀 타이틀 animation=========
  function hallTitleAnim(title){
    const myTween =
    gsap.timeline({ defaults: { duration: 0.5, delay: 0.3, ease: 'power2.inOut' } })
    .fromTo(title, { opacity: 0, }, { opacity: 1, y: 0, stagger: 0.1 })
    .to(title, { opacity: 0, stagger: 0.1 });

    myTween.kill();
    setTimeout(function(){
      const myTween =
      gsap.timeline({ defaults: { duration: 0.5, delay: 0.3, ease: 'power2.inOut' } })
      .fromTo(title, { opacity: 0, }, { opacity: 1, y: 0, stagger: 0.1 })
      .to(title, { opacity: 0, stagger: 0.1 });
    
      myTween.play();},100)
    // myTween.play();
  }

  //=========모바일 확인=========
  function Mobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  //=========거울효과=========
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


    mirror.position.copy(floorPlane.position);
    mirror.position.y += 0.002;
    // mirror.rotation.x = -Math.PI / 2;
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

  //=========사이즈체크=========
	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.draw(scene, camera);

    wrapRect = $wrap.getBoundingClientRect();
    resizeScreen();
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

          for (let i = 0; i < sizingInfos.length; i++) {
            const sizingInfo = sizingInfos[i];
            changeSizing(sizingInfo, aniTime, startView);
          }

          // ================ 팝업 오픈 ================
          let animationExecuted = false;

            for (let i = 0; i < locationInfos.length; i++) {
              if(aniTime < locationInfos[i].time[0] + 0.3 && aniTime > locationInfos[i].time[0] - 0.3){
                if (!locationInfos[i].elem.classList.contains('on') ) {
                  let title = locationInfos[i].title;

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

          // ================ 사이징 팝업 오픈 ================
            // if(aniTime < sizingInfos[0].time[0] + 0.1 && aniTime > sizingInfos[0].time[0] - 0.1){
            //   if (!sizingInfos[0].elem.classList.contains('on') ) {

            //     $map.classList.remove('on');
            //     sizingInfos[0].elem.classList.add('on');
            //     resizeScreen();

            //   }
            // }else{
            //   if(sizingInfos[0].elem.classList.contains('on')){
            //     sizingInfos[0].elem.classList.remove('on');
            //     $map.classList.add('on');

            //   }
            // }
  
          renderRequest();
        },
        onComplete: function() {
          animator.processing = false;
        }
      });
    } 
  }

  //=========그리기=========
  const draw = function () {

    if ( isRequestRender ) {
      if ( sceneCamera ) {
        camera.position.copy(sceneCamera.position);
        camera.rotation.copy(sceneCamera.rotation);
      }

      renderer.render(scene, camera);
  
      isRequestRender = false;
    }


  
    window.requestAnimationFrame(draw);
  };

	//=========이벤트 init=========
  window.addEventListener('resize', setSize);
  window.addEventListener('wheel', onWheel, { passive: false });

  draw();