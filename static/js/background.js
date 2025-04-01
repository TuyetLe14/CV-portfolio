document.addEventListener('DOMContentLoaded', () => {
    console.log('Script background.js is running...');

    if (typeof THREE === 'undefined') {
        console.error('Three.js is not defined. Ensure the Three.js script is loaded correctly.');
        return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 50);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) {
        console.error('Canvas container not found! Ensure <div id="canvas-container"></div> exists in your HTML.');
        return;
    }
    canvasContainer.appendChild(renderer.domElement);
    console.log('Renderer attached to DOM');

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const particleCount = 50;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

        const color = Math.random();
        if (color < 0.5) {
            colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.84; colors[i * 3 + 2] = 0.0; // Vàng ánh kim (#FFD700)
        } else {
            colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // Trắng
        }
        sizes[i] = Math.random() * 1 + 0.5;

        velocities[i] = {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        };
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.8
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    const maxDistance = 15;
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    const updateLines = () => {
        linesGroup.children.forEach(line => linesGroup.remove(line));
        for (let i = 0; i < particleCount; i++) {
            const pos1 = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            for (let j = i + 1; j < particleCount; j++) {
                const pos2 = new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
                const distance = pos1.distanceTo(pos2);
                if (distance < maxDistance) {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([pos1, pos2]);
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: 0xFFD700, // Vàng ánh kim
                        transparent: true,
                        opacity: 1 - (distance / maxDistance) * 0.8
                    });
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    linesGroup.add(line);
                }
            }
        }
    };

    const ambientLight = new THREE.AmbientLight(0x202020, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFD700, 0.5, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const stars = document.getElementById('stars');
    if (stars) {
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDuration = `${Math.random() * 4 + 1}s`;
            star.style.background = `rgba(255, 215, 0, ${Math.random() * 0.6 + 0.4})`;
            stars.appendChild(star);
        }
        console.log('Stars initialized');
    } else {
        console.error('Stars container not found!');
    }

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    let isDark = true;

    themeToggleBtn.addEventListener('click', () => {
        if (isDark) {
            body.classList.add('light-theme');
            scene.background = new THREE.Color(0xF5F5F5);
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.classList.remove('light-theme');
            scene.background = new THREE.Color(0x000000);
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        isDark = !isDark;
    });

    // Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    let isEnglish = true;

    const translations = {
        en: {
            'Home': 'Home',
            'About': 'About',
            'Projects': 'Projects',
            'Skills': 'Skills',
            'Contact': 'Contact',
            'PORTFOLIO': 'PORTFOLIO',
            'Hi, I\'m': 'Hi, I\'m',
            'I\'m a Developer': 'I\'m a Developer',
            'Education': 'Education',
            'Degree': 'Degree',
            'Date of Birth': 'Date of Birth',
            'Phone': 'Phone',
            'Email': 'Email',
            'Address': 'Address',
            'Download My CV': 'Download My CV',
            'About Me': 'About Me',
            'Personal Projects': 'Personal Projects',
            'Certifications': 'Certifications',
            'My Certifications': 'My Certifications'
        },
        vi: {
            'Home': 'Trang chủ',
            'About': 'Giới thiệu',
            'Projects': 'Dự án',
            'Skills': 'Kỹ năng',
            'Contact': 'Liên hệ',
            'PORTFOLIO': 'DANH MỤC',
            'Hi, I\'m': 'Xin chào, tôi là',
            'I\'m a Developer': 'Tôi là một Lập trình viên',
            'Education': 'Học vấn',
            'Degree': 'Bằng cấp',
            'Date of Birth': 'Ngày sinh',
            'Phone': 'Điện thoại',
            'Email': 'Email',
            'Address': 'Địa chỉ',
            'Download My CV': 'Tải CV của tôi',
            'About Me': 'Về tôi',
            'Personal Projects': 'Dự án cá nhân',
            'Certifications': 'Chứng chỉ',
            'My Certifications': 'Chứng chỉ của tôi'
        }
    };

    langToggleBtn.addEventListener('click', () => {
        isEnglish = !isEnglish;
        const lang = isEnglish ? 'en' : 'vi';
        langToggleBtn.textContent = isEnglish ? 'EN/VN' : 'VN/EN';

        document.querySelector('nav h1').innerHTML = `<span style="color: #00ffff;"></span>${translations[lang]['PORTFOLIO']}`;
        document.querySelector('nav ul li:nth-child(1) a').textContent = translations[lang]['Home'];
        document.querySelector('nav ul li:nth-child(2) a').textContent = translations[lang]['About'];
        document.querySelector('nav ul li:nth-child(3) a').textContent = translations[lang]['Projects'];
        document.querySelector('nav ul li:nth-child(4) a').textContent = translations[lang]['Skills'];
        document.querySelector('nav ul li:nth-child(5) a').textContent = translations[lang]['Contact'];
        document.querySelector('.hero-info h1').childNodes[0].textContent = translations[lang]['Hi, I\'m'] + ' ';
        document.querySelector('.hero-info h2').textContent = translations[lang]['I\'m a Developer'];
        document.querySelector('.hero-info p strong:nth-child(1)').textContent = translations[lang]['Education'] + ':';
        document.querySelector('.hero-info p strong:nth-child(3)').textContent = translations[lang]['Degree'] + ':';
        document.querySelector('.hero-info p strong:nth-child(5)').textContent = translations[lang]['Date of Birth'] + ':';
        document.querySelector('.hero-info p strong:nth-child(7)').textContent = translations[lang]['Phone'] + ':';
        document.querySelector('.hero-info p strong:nth-child(9)').textContent = translations[lang]['Email'] + ':';
        document.querySelector('.hero-info p strong:nth-child(11)').textContent = translations[lang]['Address'] + ':';
        document.querySelector('.Buttons a.btn').textContent = translations[lang]['Download My CV'];
        document.querySelector('#about h2').textContent = translations[lang]['About Me'];
        document.querySelector('#projects h2').textContent = translations[lang]['Projects'];
        document.querySelector('#personal-projects h2').textContent = translations[lang]['Personal Projects'];
        document.querySelector('#skills h2').textContent = translations[lang]['Skills'];
        document.querySelector('#certifications h2').textContent = translations[lang]['Certifications'];
        document.querySelector('#certifications h3').textContent = translations[lang]['My Certifications'];
    });

    let clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
        const time = clock.getElapsedTime();

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            if (Math.abs(positions[i * 3]) > 60) velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 60) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 60) velocities[i].z *= -1;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        updateLines();

        const pulse = Math.sin(time * 2) * 0.5 + 0.5;
        pointLight.intensity = 0.3 + pulse * 0.2;

        renderer.render(scene, camera);
        console.log('Rendering frame');
    });
    console.log('Animation loop started');
});