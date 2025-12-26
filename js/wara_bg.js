(function() {
    const speed = 1.0, shapeCount = 22;
    const c = document.createElement('canvas'), ctx = c.getContext('2d');
    
    c.style = "position:fixed;top:0;left:0;z-index:-2;width:100%;height:100%;pointer-events:none;";
    document.body.prepend(c);

    const fix = () => document.body.style.background = document.documentElement.style.background = "transparent";
    fix(); window.addEventListener('load', fix);

    let objs = [];

    const init = () => {
        c.width = window.innerWidth; c.height = window.innerHeight;
        objs = Array.from({length: shapeCount}, () => ({
            x: Math.random()*c.width, y: Math.random()*c.height,
            s: Math.random()*80+40, r: Math.random()*Math.PI,
            dx: (Math.random()-0.5)*0.5*speed, dy: (Math.random()-0.5)*0.5*speed,
            v: (Math.random()-0.5)*0.005*speed, 
            col: `rgba(255, 255, 255, ${Math.random()*0.3+0.1})`,
            t: Math.floor(Math.random()*3), life: Math.random()*Math.PI,
            ps: (Math.random()*0.01+0.005)*speed
        }));
    };

    const draw = (o) => {
        const pulse = (Math.sin(o.life)+1)/2, sz = o.s*(0.9+pulse*0.1);
        ctx.save();
        ctx.translate(o.x, o.y); ctx.rotate(o.r);
        ctx.shadowBlur = 15; ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.fillStyle = o.col; ctx.globalAlpha = pulse;
        ctx.beginPath();
        if(o.t === 0) ctx.arc(0,0,sz/2,0,Math.PI*2);
        else if(o.t === 1) ctx.roundRect(-sz/2,-sz/2,sz,sz,sz*0.3);
        else { ctx.moveTo(0,-sz/2); ctx.lineTo(-sz/2,sz/2); ctx.lineTo(sz/2,sz/2); }
        ctx.fill(); ctx.restore();
    };

    const anim = () => {
        const g = ctx.createLinearGradient(0,0,0,c.height);
        g.addColorStop(0,"#a8e6cf"); g.addColorStop(1,"#56ccf2");
        ctx.fillStyle = g; ctx.fillRect(0,0,c.width,c.height);
        objs.forEach(o => {
            draw(o);
            o.x += o.dx; o.y += o.dy; o.r += o.v; o.life += o.ps;
            if(o.x < -o.s) o.x = c.width+o.s; if(o.x > c.width+o.s) o.x = -o.s;
            if(o.y < -o.s) o.y = c.height+o.s; if(o.y > c.height+o.s) o.y = -o.s;
        });
        requestAnimationFrame(anim);
    };

    window.addEventListener('resize', init);
    init(); anim();
})();