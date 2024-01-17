import '../scss/style.scss'
import * as THREE from 'three';
import dat from 'dat.gui';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
  { location: 'hall-a',  name: 'Section 02',elem: $container.querySelector('.popup .inner[data-pop="hall-a"]'), time: [60/animFrames * animDuration], type: 'stop', isConfirm: false, },
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
    { location: 'cg-cut-3',  image: `${resourcesPath}hedgehog4.webp`,  imageMob: `${resourcesPath}hedgehog4.webp` },
    { location: 'cg-cut-4',  image: `${resourcesPath}hedgehog4.webp`,  imageMob: `${resourcesPath}hedgehog4.webp` },
    { location: 'cg-cut-5',  image: `${resourcesPath}hedgehog4.webp`,  imageMob: `${resourcesPath}hedgehog4.webp` },
    { location: 'cg-cut-6',  image: `${resourcesPath}hedgehog4.webp`,  imageMob: `${resourcesPath}hedgehog4.webp` },
    { location: 'cg-cut-7',  image: `${resourcesPath}fox5.webp`,  imageMob: `${resourcesPath}fox5.webp` },
    { location: 'cg-cut-8',  image: `${resourcesPath}fox5.webp`,  imageMob: `${resourcesPath}fox5.webp` },
    { location: 'cg-cut-9',  image: `${resourcesPath}fox5.webp`,  imageMob: `${resourcesPath}fox5.webp` },
    { location: 'cg-cut-10', image: `${resourcesPath}fox5.webp`,  imageMob: `${resourcesPath}fox5.webp` },
    { location: 'unit-74',   image: `${resourcesPath}fox6.webp`, imageMob: `${resourcesPath}fox6.webp` },
    { location: 'unit-84',   image: `${resourcesPath}fox6.webp`, imageMob: `${resourcesPath}fox6.webp` },
    { location: 'unit-101',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'unit-124',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'unit-125',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'unit-138',  image: `${resourcesPath}church.webp`,imageMob: `${resourcesPath}church.webp` },
    { location: 'end',       image: `${resourcesPath}fox7.webp`,    imageMob: `${resourcesPath}fox7.webp` }
  ]

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

          // setting screen
          if ( screenMeshNames.indexOf(child.name) > -1 ) {
            screenMeshes.push( child );
          }

        }
      });

        // Loading
        // THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
        //     if (itemsLoaded === itemsTotal) {
        //         setScreens();
        //         renderRequest();
        //     }
        // };

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
        exit: locationInfos.find(e => e.location == 'end').time 
      };
    
      function mapBtnClick1(e){
        const directionFrame = 25; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

              $currentPointer.style.offsetDistance = '8%';
              $popup.classList.remove('on');
              for (a of $popInner){
                a.classList.remove('on');
              }
              $popup.classList.add('on');
              document.querySelector('.inner[data-pop="tutorial"]').classList.add('on');

              $map.classList.remove('on');
          
              renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();
      }
      function mapBtnClick2(){
        const directionFrame = 60; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

          $currentPointer.style.offsetDistance = '27%';
          $popup.classList.remove('on');
          for (a of $popInner){
            a.classList.remove('on');
          }          
          $popup.classList.add('on');
          document.querySelector('.inner[data-pop="hall-a"]').classList.add('on');

          $map.classList.remove('on');
      
          renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();
      }
      function mapBtnClick3(){
        const directionFrame = 108; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

          $currentPointer.style.offsetDistance = '44%';
          $popup.classList.remove('on');
          for (a of $popInner){
            a.classList.remove('on');
          }          
          $popup.classList.add('on');
          document.querySelector('.inner[data-pop="hall-b"]').classList.add('on');

          $map.classList.remove('on');
      
          renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();
      }
      function mapBtnClick4(){
        const directionFrame = 204; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

          $currentPointer.style.offsetDistance = '72%';
          $popup.classList.remove('on');
          for (a of $popInner){
            a.classList.remove('on');
          }          
          $popup.classList.add('on');
          document.querySelector('.inner[data-pop="hall-c"]').classList.add('on');

          $map.classList.remove('on');
      
          renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();
      }
      function mapBtnClick5(){
        const directionFrame = 250; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

          $currentPointer.style.offsetDistance = '97%';

          $popup.classList.remove('on');
          for (a of $popInner){
            a.classList.remove('on');
          }          
          $popup.classList.add('on');
          document.querySelector('.inner[data-pop="end"]').classList.add('on');

          $map.classList.remove('on');
      
          renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();
      }

      function rayCaster1(){
        const directionFrame = 70; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

          $currentPointer.style.offsetDistance = '28%';
      
          renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();        
      }

      function rayCaster2(){
        const directionFrame = 90; // 목적지 애니메이션 프레임 -- 블렌더에서 확인 가능
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

          $currentPointer.style.offsetDistance = '28%';
      
          renderRequest();
            }
          });
        mixer.setTime(directionTime);
        renderRequest();        
      }
      
      let a;
      const $popInner  = document.querySelectorAll('.inner');
    
      document.querySelector('.btn[data-location="tutorial"]').addEventListener('click',function(e){
        mapBtnClick1(e);
      });
      document.querySelector('.btn[data-location="hall-a"]').addEventListener('click',function(){
        mapBtnClick2();
      });
      document.querySelector('.btn[data-location="hall-b"]').addEventListener('click',function(){
        mapBtnClick3();
      });
      document.querySelector('.btn[data-location="hall-c"]').addEventListener('click',function(){
        mapBtnClick4();
      });
      document.querySelector('.btn[data-location="exit"]').addEventListener('click',function(){
        mapBtnClick5();
      });

      //
      document.querySelector('.inner[data-pop="tutorial"] .next').addEventListener('click',function(){
        mapBtnClick2();
      })
      document.querySelector('.inner[data-pop="hall-a"] .prev').addEventListener('click',function(){
        mapBtnClick1();
      })
      document.querySelector('.inner[data-pop="hall-a"] .next').addEventListener('click',function(){
        mapBtnClick3();
      })
      document.querySelector('.inner[data-pop="hall-b"] .prev').addEventListener('click',function(){
        mapBtnClick2();
      })
      document.querySelector('.inner[data-pop="hall-b"] .next').addEventListener('click',function(){
        mapBtnClick4();
      })
      document.querySelector('.inner[data-pop="hall-c"] .prev').addEventListener('click',function(){
        mapBtnClick3();
      })
      document.querySelector('.inner[data-pop="hall-c"] .next').addEventListener('click',function(){
        mapBtnClick5();
      })
      document.querySelector('.inner[data-pop="end"] .prev').addEventListener('click',function(){
        mapBtnClick4();
      })

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
          if(intersects[0].object.userData.name == 'avideo-1'){
            rayCaster1();
          }
          if(intersects[0].object.userData.name == 'avideo-2'){
            rayCaster2();
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
      
        // 교차된 객체에 대한 처리
        if (intersects.length > 0) {

          if(intersects[0].object.userData.name == 'avideo-1'){
            intersects[0].object.material.color.set(0xff0000);
            console.log('yes')

          }else{
            scene.children.forEach(obj => {
              if (obj instanceof THREE.Mesh) {
                // intersects[0].object.material.color.set(0x00ff00);
                obj.material.color.set(0x00ff00);
              }
            });
          }

          // if(intersects[0].object.userData.name == 'avideo-2'){
          //   rayCaster2();
          // }
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
    document.querySelector('.content-loading').classList.remove('active');
  }
};


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

    animator.to >= 0 ? onAnimate(distance) : animator.to == 0;
    animator.to <= 10.41 ? onAnimate(distance) : animator.to == 10.41;
    console.log( animator.to)

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
          // console.log(animator.time, ' : animator.time', aniTime, ' : aniTime')
          mixer.setTime(aniTime);

          $currentPointer.style.offsetDistance = aniTime / anim.duration * 100 + '%';

          
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



  function animate() {
    requestAnimationFrame(animate);
  
    // 큐브 회전 등 애니메이션 작업
  
    renderer.render(scene, camera);
  }
  
  // animate();

	// 이벤트
  window.addEventListener('resize', setSize);
  window.addEventListener('wheel', onWheel, { passive: false });

  draw(); //로드 완료되면 실행시켜줘야하는 그리기 함수