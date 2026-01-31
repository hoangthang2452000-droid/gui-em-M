import * as THREE from "three";

const message = "Hôm nay, anh muốn gửi đến em vài dòng tâm sự. Dù anh và em chưa nói chuyện với nhau nhiều, nhưng không hiểu sao anh luôn muốn được trò chuyện cùng em. Có lúc anh ngại, có lúc lại không biết nên bắt đầu thế nào cho tự nhiên.<br><br>Anh không phải người nói chuyện khéo léo, đôi khi còn vụng về trong cách bày tỏ, nhưng tình cảm anh dành cho em là chân thành. Anh mong rằng chúng ta sẽ có thêm nhiều cơ hội để nói chuyện, để anh hiểu em nhiều hơn, và cũng để anh có thể quan tâm em theo cách chậm rãi và thật lòng nhất.<br><br>Em là người con gái khiến anh kiên nhẫn nhất từ trước đến giờ, anh chưa từng theo đuổi ai lâu như vậy. Em không cần phải trả lời anh ngay đâu, chỉ mong em cho anh thêm cơ hội để cố gắng. Anh hứa sẽ trân trọng điều đó.";

const loaderContainer = document.getElementById("loader-container");
const progressBar = document.getElementById("progress-bar");
const progressPercent = document.getElementById("progress-percent");
const clickMeContainer = document.querySelector(".click-me-container");

let progress = 0;
const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 90) progress = 90;
    progressBar.style.width = progress + "%";
    progressPercent.textContent = Math.floor(progress) + "%";
}, 300);

window.onload = () => {
    clearInterval(interval);
    progressBar.style.width = "100%";
    progressPercent.textContent = "100%";
    setTimeout(() => {
        loaderContainer.classList.add("hidden");
        clickMeContainer.style.opacity = "1";
    }, 500);
    init3D();
};

let renderer;

function createHighlightTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
}

function init3D() {
    const audio = document.getElementById("backgroundMusic");
    audio.currentTime = 25;
    document.body.addEventListener(
        "click",
        () => {
            if (audio.paused)
                audio
                    .play()
                    .catch((e) =>
                        console.log("Reproducción automática bloqueada."),
                    );
        },
        { once: true },
    );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#bg"),
        alpha: true,
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffdddd, 2, 100);
    pointLight.position.set(0, 0, 8);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const heartShape = new THREE.Shape();
    const x = -2.5,
        y = -5;
    heartShape.moveTo(x + 2.5, y + 2.5);
    heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    heartShape.bezierCurveTo(
        x - 3,
        y + 5.5,
        x - 1.5,
        y + 7.7,
        x + 2.5,
        y + 9.5,
    );
    heartShape.bezierCurveTo(
        x + 6,
        y + 7.7,
        x + 8,
        y + 5.5,
        x + 8,
        y + 3.5,
    );
    heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    heartShape.bezierCurveTo(
        x + 3.5,
        y,
        x + 2.5,
        y + 2.5,
        x + 2.5,
        y + 2.5,
    );

    const extrudeSettings = {
        steps: 8,
        depth: 2.5,
        bevelEnabled: true,
        bevelThickness: 0.8,
        bevelSize: 0.5,
        bevelOffset: -0.1,
        bevelSegments: 32,
    };
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xef2b4c,
        metalness: 0.05,
        roughness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.5,
        transmission: 0.05,
        thickness: 0.8,
        emissive: 0x661122,
        emissiveIntensity: 0.6,
        reflectivity: 0.9,
    });
    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.2, 0.2, 0.2);
    heart.rotation.x = Math.PI;
    heart.castShadow = true;
    heart.receiveShadow = true;
    scene.add(heart);

    const highlightTexture = createHighlightTexture();
    const highlightMaterial = new THREE.SpriteMaterial({
        map: highlightTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
    });
    const highlightSprite = new THREE.Sprite(highlightMaterial);
    highlightSprite.position.set(0.2, 1, 1.5);
    heart.add(highlightSprite);

    const isMobile = window.innerWidth <= 768;
    const starsCount = isMobile ? 0 : 12000;
    let starsMesh;

    if (starsCount > 0) {
        const starsGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(starsCount * 3);
        const colors = new Float32Array(starsCount * 3);
        const sizes = new Float32Array(starsCount);
        for (let i = 0; i < starsCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 30 + 20;
            posArray[i * 3 + 0] = Math.cos(angle) * radius;
            posArray[i * 3 + 1] = Math.sin(angle) * radius;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 120 - 30;
            const brightness = Math.random() * 0.7 + 0.8;
            const starType = Math.random();
            if (starType < 0.4) {
                colors[i * 3 + 0] = 1 * brightness;
                colors[i * 3 + 1] = 1 * brightness;
                colors[i * 3 + 2] = 1 * brightness;
            } else if (starType < 0.65) {
                colors[i * 3 + 0] = 1 * brightness;
                colors[i * 3 + 1] = 0.7 * brightness;
                colors[i * 3 + 2] = 0.3 * brightness;
            } else if (starType < 0.85) {
                colors[i * 3 + 0] = 1 * brightness;
                colors[i * 3 + 1] = 0.4 * brightness;
                colors[i * 3 + 2] = 0.6 * brightness;
            } else {
                colors[i * 3 + 0] = 0.6 * brightness;
                colors[i * 3 + 1] = 0.8 * brightness;
                colors[i * 3 + 2] = 1 * brightness;
            }
            sizes[i] = Math.random() * 0.3 + 0.1;
        }
        starsGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(posArray, 3),
        );
        starsGeometry.setAttribute(
            "color",
            new THREE.BufferAttribute(colors, 3),
        );
        starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        const starsMaterial = new THREE.PointsMaterial({
            size: isMobile ? 0.2 : 0.25,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true,
        });
        starsMesh = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starsMesh);
    }

    const clickMeText = document.getElementById("clickMeText");
    const modalContainer = document.getElementById("modalContainer");
    const closeButton = document.querySelector(".close-button");

    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.querySelector(".lightbox-close");

    function openLightbox(src) {
        lightboxImage.src = src;
        lightboxModal.classList.add("active");
    }

    function closeLightbox() {
        lightboxModal.classList.remove("active");
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    let i = 0;
    let timer;

    let isTypingCompleted = false;

    function typeWriter() {
        const textElement = document.getElementById("typingText");
        const textContent = document.querySelector(".text-content");
        const isAtBottom = textContent.scrollHeight - textContent.scrollTop <= textContent.clientHeight + 50;

        if (i < message.length) {
            if (message.substring(i, i + 4) === "<br>") {
                textElement.innerHTML += "<br>";
                i += 4;
            } else {
                textElement.innerHTML += message.charAt(i);
                i++;
            }

            if (isAtBottom) {
                textContent.scrollTop = textContent.scrollHeight;
            }

            timer = setTimeout(typeWriter, 60);
        } else {
            document.querySelector(".signature").style.opacity = "1";
            isTypingCompleted = true;
        }
    }

    const imagePaths = Array.from({ length: 5 }, (_, i) => `style/img/Anh (${i + 1}).jpg`);
    const imageStack = document.getElementById("imageStack");

    let cards = [];
    let isDragging = false;
    let startX = 0;
    let currentDeltaX = 0;
    let preventClick = false;
    let topCard = null;
    let autoSwipeInterval = null;

    function createCard(path, index) {
        const card = document.createElement("div");
        card.className = "photo-card";
        const img = document.createElement("img");
        img.src = path;
        img.alt = "Memory";
        card.appendChild(img);
        const randomRot = (Math.random() - 0.5) * 10;
        const randomX = (Math.random() - 0.5) * 10;
        const randomY = (Math.random() - 0.5) * 10;
        card.dataset.originRot = randomRot;
        card.dataset.originX = randomX;
        card.dataset.originY = randomY;

        card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg) scale(0.9)`;
        card.style.zIndex = 1000 - index;
        card.addEventListener("mousedown", startDrag);
        card.addEventListener("touchstart", startDrag, { passive: false });

        card.addEventListener("click", (e) => {
            if (!preventClick) {
                openLightbox(path);
            }
        });

        return card;
    }

    function initStack() {
        imageStack.innerHTML = "";
        cards = [];
        imagePaths.forEach((path, index) => {
            const card = createCard(path, index);
            imageStack.appendChild(card);
            cards.push(card);
        });

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("visible");
                const rot = card.dataset.originRot;
                const x = card.dataset.originX;
                const y = card.dataset.originY;
                card.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(1)`;
            }, index * 120);
        });

        updateTopCard();
    }

    function updateTopCard() {
        topCard = cards.find(c => !c.classList.contains("swiped"));
        if (!topCard) {
            cards.forEach((c, index) => {
                c.classList.remove("swiped");
                c.style.visibility = "visible";
                c.style.transition = "none";
                c.style.transform = "translateY(100px) scale(0.9)";
                c.style.opacity = "0";

                setTimeout(() => {
                    c.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease";
                    const rot = c.dataset.originRot;
                    const x = c.dataset.originX;
                    const y = c.dataset.originY;
                    c.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(1)`;
                    c.style.opacity = "1";
                }, 50 + (index * 120));
            });
            updateTopCard();
        }
    }

    function startDrag(e) {
        if (e.target.closest(".photo-card") !== topCard) return;
        isDragging = true;
        preventClick = false;
        startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        topCard.classList.add("swiping");

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("touchmove", onDrag, { passive: false });
        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchend", endDrag);
    }

    function onDrag(e) {
        if (!isDragging || !topCard) return;
        const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        currentDeltaX = clientX - startX;

        if (Math.abs(currentDeltaX) > 10) preventClick = true;

        const rot = parseFloat(topCard.dataset.originRot) + (currentDeltaX / 10);
        const x = parseFloat(topCard.dataset.originX) + currentDeltaX;
        const y = parseFloat(topCard.dataset.originY);

        topCard.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

        if (e.cancelable) e.preventDefault();
    }

    function endDrag() {
        if (!isDragging || !topCard) return;
        isDragging = false;
        topCard.classList.remove("swiping");

        const threshold = 100;
        if (Math.abs(currentDeltaX) > threshold) {
            const direction = currentDeltaX > 0 ? 1 : -1;
            swipeCard(direction);
        } else {
            const rot = topCard.dataset.originRot;
            const x = topCard.dataset.originX;
            const y = topCard.dataset.originY;
            topCard.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        }

        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("touchmove", onDrag);
        document.removeEventListener("mouseup", endDrag);
        document.removeEventListener("touchend", endDrag);
        currentDeltaX = 0;
    }

    function swipeCard(direction) {
        
        const flyX = direction * (window.innerWidth + 500);
        const flyRot = direction * 45;

        topCard.style.transform = `translate(${flyX}px, 0) rotate(${flyRot}deg)`;
        topCard.classList.add("swiped");

        setTimeout(() => {
            topCard.style.visibility = "hidden";
            updateTopCard();
        }, 500);
    }
    function startAutoSwipe() {
    stopAutoSwipe();
    autoSwipeInterval = setInterval(() => {
        if (!modalContainer.classList.contains("active")) return;
        if (!topCard || isDragging) return;

        swipeCard(1); // tự động đổi ảnh (bay sang trái)
    }, 3000); // ⏱️ 3 giây / ảnh
}

function stopAutoSwipe() {
    if (autoSwipeInterval) {
        clearInterval(autoSwipeInterval);
        autoSwipeInterval = null;
    }
}

    function openModal() {
    if (!modalContainer.classList.contains("active")) {
        modalContainer.classList.add("active");
        if (renderer) renderer.setPixelRatio(window.devicePixelRatio * 0.5);

        initStack();
        startAutoSwipe(); // ✅ BẮT ĐẦU TỰ ĐỘNG ĐỔI ẢNH

        if (isTypingCompleted) {
            document.getElementById("typingText").innerHTML = message;
            document.querySelector(".signature").style.opacity = "1";
            return;
        }

        i = 0;
        document.getElementById("typingText").innerHTML = "";
        document.querySelector(".signature").style.opacity = "0";
        clearTimeout(timer);
        typeWriter();
    }
}
    function closeModal() {
    modalContainer.classList.remove("active");
    if (renderer) renderer.setPixelRatio(window.devicePixelRatio);

    stopAutoSwipe(); // ✅ DỪNG AUTO KHI ĐÓNG MODAL
    clearTimeout(timer);
    }
    clickMeText.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);
    modalContainer.addEventListener("click", (e) => {
    });

    const modalContent = document.querySelector(".modal-content");
    ["click", "mousedown", "touchstart"].forEach(eventType => {
        modalContent.addEventListener(eventType, (e) => {
            e.stopPropagation();
        });
    });
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onHeartClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(heart);
        if (intersects.length > 0) openModal();
    }
    window.addEventListener("click", onHeartClick, false);

    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
        if (modalContainer.classList.contains("active")) return;
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    document.addEventListener("touchmove", (event) => {
        if (modalContainer.classList.contains("active")) return;
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX);
            mouseY = (event.touches[0].clientY - windowHalfY);
        }
    }, { passive: true });

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        const beatFrequency = 2.8;
        const beatStrength = isMobile ? 0 : 0.045;
        const pulse = beatStrength > 0 ?
            Math.pow(Math.sin(elapsedTime * beatFrequency), 8) * beatStrength : 0;

        if (!modalContainer.classList.contains("active")) {
            if (!isMobile) {
                camera.position.x += (mouseX * 0.003 - camera.position.x) * 0.05;
                camera.position.y += (-mouseY * 0.003 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
            } else {
                // Hiệu ứng lơ lửng cho mobile
                heart.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
                heart.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;
            }
        }

        const baseScale = 0.2;
        heart.scale.set(
            baseScale + pulse,
            baseScale + pulse,
            baseScale + pulse,
        );

        const baseHighlightScale = 1.8;
        const highlightPulseAmount = 1.2;
        const highlightRatio = beatStrength > 0 ? (pulse / beatStrength) : 0;
        const newHighlightScale =
            baseHighlightScale + highlightRatio * highlightPulseAmount;
        highlightSprite.scale.set(newHighlightScale, newHighlightScale, 1);
        highlightSprite.material.opacity = 0.6 + highlightRatio * 0.4;

        if (starsMesh) {
            const starPositions = starsMesh.geometry.attributes.position.array;
            for (let i = 0; i < starsCount; i++) {
                starPositions[i * 3 + 2] += 0.2;
                if (starPositions[i * 3 + 2] > 15)
                    starPositions[i * 3 + 2] = -60 - Math.random() * 30;
            }
            starsMesh.geometry.attributes.position.needsUpdate = true;
            if (!isMobile) starsMesh.rotation.z += 0.0005;
        }
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        if (!modalContainer.classList.contains("active"))
            renderer.setPixelRatio(window.devicePixelRatio);
    });
    animate();
}
