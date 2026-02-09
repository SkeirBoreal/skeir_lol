(function() {
    // cube configs
    const id = 'three-cubes-bg', sz = 65, sprD = 0.75, M = 0.15;
    let sc, cam, ren, lc, rc, ry, m, pm, drag = 0, lv = {x:0,y:0}, rv = {x:0,y:0};

    const init = () =>
    {
        ry = new THREE.Raycaster(); m = new THREE.Vector2(); pm = new THREE.Vector2();
        sc = new THREE.Scene(); cam = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
        cam.position.z = 600;
        
        ren = new THREE.WebGLRenderer({ antialias: 1, alpha: 1 });
        ren.domElement.id = id; ren.setSize(window.innerWidth, window.innerHeight);
        ren.setPixelRatio(window.devicePixelRatio);
        ren.domElement.style = "position:fixed;top:0;left:0;z-index:-1;width:100%;height:100%;";
        document.body.prepend(ren.domElement);

        // create checkerboard texture
        const tex = c => {
            const cv = document.createElement('canvas'); cv.width = cv.height = 128;
            const x = cv.getContext('2d');
            for(let i=0; i<4; i++) for(let j=0; j<4; j++) {
                x.fillStyle = (i+j)%2 ? c : "rgba(255,255,255,0.85)";
                x.fillRect(i*32, j*32, 32, 32);
            }
            return new THREE.CanvasTexture(cv);
        };

        const g = new THREE.BoxGeometry(sz, sz, sz), mat = (c, o) => new THREE.MeshLambertMaterial({ map: tex(c), transparent: 1, opacity: o });
        lc = new THREE.Mesh(g, mat("#f4cf57", 0.85)); rc = new THREE.Mesh(g, mat("#d543a9", 0.85));
        sc.add(lc, rc); sc.add(new THREE.AmbientLight(0xffffff, 0.7));
        const l = new THREE.DirectionalLight(0xffffff, 0.4); l.position.set(1, 1, 1); sc.add(l);

        // input handling
        const uM = e => { m.x = (e.clientX/window.innerWidth)*2-1; m.y = -(e.clientY/window.innerHeight)*2+1; };
        window.onmousedown = e => { drag = 1; uM(e); pm.copy(m); };
        window.onmousemove = e => { if(drag) uM(e); };
        window.onmouseup = () => drag = 0;
        loop();
    };

    const loop = () =>
    {
        if(!document.getElementById(id)) return;

        const isMobile = window.innerWidth < 768;
        lc.visible = rc.visible = !isMobile;

        if(!isMobile) {
            const t = Date.now()*0.001, clp = (v, l) => Math.max(-l, Math.min(l, v));
            
            // calculate frustum width at distance 600
            const vH = 2 * Math.tan((cam.fov * Math.PI / 180) / 2) * cam.position.z;
            const vW = vH * cam.aspect;
            const s = (vW / 2) * sprD;

            lc.position.set(-s, Math.sin(t)*30, 0); 
            rc.position.set(s, Math.cos(t)*30, 0);

            // friction and idle rotation
            lv.x = clp(lv.x * 0.95, M); lv.y = clp(lv.y * 0.95, M);
            rv.x = clp(rv.x * 0.95, M); rv.y = clp(rv.y * 0.95, M);

            lc.rotation.x += lv.x + 0.002; lc.rotation.y += lv.y + 0.003;
            rc.rotation.x += rv.x + 0.002; rc.rotation.y += rv.y + 0.003;

            // check for mouse drag on cubes
            if(drag) {
                ry.setFromCamera(m, cam);
                const h = ry.intersectObjects([lc, rc]);
                if(h.length) {
                    const o = h[0].object, dx = (m.x-pm.x)*5, dy = (m.y-pm.y)*5;
                    if(o === lc) { lv.x -= dy; lv.y -= dx; } else { rv.x -= dy; rv.y -= dx; }
                }
                pm.copy(m);
            }
        }
        
        ren.render(sc, cam); 
        requestAnimationFrame(loop);
    };

    // manage window resizing
    window.onresize = () => 
    { 
        if(ren) { 
            ren.setSize(window.innerWidth, window.innerHeight); 
            cam.aspect = window.innerWidth/window.innerHeight; 
            cam.updateProjectionMatrix(); 
        }
    };

    if(typeof THREE !== 'undefined') init(); else {
        const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        s.onload = init; document.head.appendChild(s);
    }
})();