import { useEffect, useEffectEvent, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import modelUrl from "../Portfolio.glb?url";
import { gsap } from "gsap";
 
const interactiveObjectNames = [
    "About_Sign",
    "End_Sign",
    "Experience_Sign",
    "Projects_Sign",
    "Start_Sign",
    "Cat_Black",
    "Cat_Orange"
];

// Add these files to public/sounds/, or change the filenames here.
const catSoundFiles = {
    Cat_Black: "sounds/cat_meow.mp3",
    Cat_Orange: "sounds/cat_meow.mp3"
};

export default function ThreeScene({ onObjectClick }) {
    const canvasRef = useRef(null);
    const handleObjectClick = useEffectEvent(onObjectClick);

    useEffect(() => {
        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const clickableObjects = [];
        const catSounds = new Map();
        let portfolioModel;
        const character = {
            instance: null,
            moveDistance: 5,
            jumpHeight: 1,
            isMoving: false,
            moveDuration: 0.2
        };

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.75;

        const frustumHeight = 100;
        const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 1000);
        camera.position.set(-20, 22, 61);
        scene.add(camera);

        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.castShadow = true;
        sun.position.set(120, 100, 0);
        sun.shadow.mapSize.set(4096, 4096);
        sun.shadow.camera.left = -150;
        sun.shadow.camera.right = 300;
        sun.shadow.camera.top = 150;
        sun.shadow.camera.bottom = -150;
        sun.shadow.normalBias = 0.7;
        scene.add(sun);
        scene.add(new THREE.AmbientLight(0x404040, 20));

        const controls = new OrbitControls(camera, canvas);
        controls.update();

        function resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspect = width / height;

            camera.left = -(frustumHeight * aspect) / 2;
            camera.right = (frustumHeight * aspect) / 2;
            camera.top = frustumHeight / 2;
            camera.bottom = -frustumHeight / 2;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }

        function getObjectUnderPointer(event) {
            if (!portfolioModel) return;

            const bounds = canvas.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);

            const hit = raycaster.intersectObjects(clickableObjects, true)[0];
            if (!hit) return;

            return clickableObjects.find((object) =>
                object === hit.object || object.getObjectById(hit.object.id)
            );
        }

        function handlePointerMove(event) {
            canvas.style.cursor = getObjectUnderPointer(event) ? "pointer" : "default";
        }

        function handlePointerLeave() {
            canvas.style.cursor = "default";
        }

        function handleClick(event) {
            const clickedObject = getObjectUnderPointer(event);
            if (!clickedObject) return;

            const soundFile = catSoundFiles[clickedObject.name];
            if (soundFile) {
                let sound = catSounds.get(clickedObject.name);
                if (!sound) {
                    sound = new Audio(`${import.meta.env.BASE_URL}${soundFile}`);
                    catSounds.set(clickedObject.name, sound);
                }
                sound.currentTime = 0;
                sound.play().catch((error) => {
                    console.warn(`Could not play ${soundFile}. Check public/sounds/.`, error);
                });
                return;
            }

            handleObjectClick(clickedObject.name);
        }

        function onKeyDown(event) {
            if(character.isMoving){ return; }

            const targetPosition = new THREE.Vector3().copy(character.instance.position);
            let targetRotation = 0;
            switch(event.key.toLowerCase()){
                case "w":
                case "arrowup":
                    targetPosition.x += character.moveDistance;
                    targetRotation = Math.PI / 2; // Face +X.
                    break;
                case "s":
                case "arrowdown":
                    targetPosition.x -= character.moveDistance;
                    targetRotation = -Math.PI / 2; // Face -X.
                    break;
                case "a":
                case "arrowleft":
                    targetPosition.z -= character.moveDistance;
                    targetRotation = Math.PI; // Face -Z.
                    break;
                case "d":
                case "arrowright":
                    targetPosition.z += character.moveDistance;
                    targetRotation = 0; // Face +Z.
                    break;
                default:
                    return;
            }
            moveCharacter(targetPosition, targetRotation);
        }

        function moveCharacter(targetPosition, targetRotation) {
            character.isMoving = true;

            let rotationDiff = 
            ((((targetRotation + Math.PI - character.instance.rotation.y) % (2 * Math.PI)) + 3 * Math.PI) %
            (2 * Math.PI)) - Math.PI;
            let finalRotation = character.instance.rotation.y + rotationDiff;


            const t1 = gsap.timeline({
                onComplete: () => {
                    character.isMoving = false;
                }
            });

            t1.to(character.instance.position, {
                x: targetPosition.x,
                z: targetPosition.z,
                duration: character.moveDuration,
            })

            t1.to(character.instance.rotation, {
                y: finalRotation,
                duration: character.moveDuration,
            }, 0)

            t1.to(character.instance.position, {
                y: character.instance.position.y + character.jumpHeight,
                duration: character.moveDuration/2,
                yoyo: true,
                repeat: 1
            }, 0)
        }

        const loader = new GLTFLoader();
        loader.load(modelUrl, (glb) => {
            portfolioModel = glb.scene;
            portfolioModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                if (child.name === "Character") {
                    character.instance = child;
                }
            });

            interactiveObjectNames.forEach((name) => {
                const object = portfolioModel.getObjectByName(name);
                if (object) clickableObjects.push(object);
            });

            scene.add(portfolioModel);
        });

        window.addEventListener("resize", resize);
        window.addEventListener("keydown", onKeyDown);
        canvas.addEventListener("pointermove", handlePointerMove);
        canvas.addEventListener("pointerleave", handlePointerLeave);
        canvas.addEventListener("click", handleClick);
        resize();

        renderer.setAnimationLoop(() => renderer.render(scene, camera));

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("keydown", onKeyDown);
            canvas.removeEventListener("pointermove", handlePointerMove);
            canvas.removeEventListener("pointerleave", handlePointerLeave);
            canvas.removeEventListener("click", handleClick);
            catSounds.forEach((sound) => {
                sound.pause();
                sound.removeAttribute("src");
                sound.load();
            });
            catSounds.clear();
            controls.dispose();
            renderer.setAnimationLoop(null);
            renderer.dispose();
        };
    }, []);

    return (
        <div className="experience">
            <canvas id="experience-canvas" ref={canvasRef} />
        </div>
    );
}
