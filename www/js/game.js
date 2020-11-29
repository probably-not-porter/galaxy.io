window.onload = function() {

    // ------------------ SET UP GAME AREA ------------------
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "images/background.png";

    // ------------------------ VARS ------------------------
    var score = 0;
    var skew = {
        left: false,
        right: false,
        up: false,
        down: false
    };
    var pos = {
        x: 0,
        y: 0
    };

    // SETTINGS
    var trail_max = 100;
    var speed = 10;
    var sun_mass = 500;
    var sun_rad = 10;

    // OBJ STORAGE
    var planet_ls = []; // keep track of all existing planets
    var bg_layer1 = []; // keep track of all background stars
    var bg_layer2 = []; // keep track of all background stars
    var explosions = []; // keep track of explosions
    
    // ------------------------ EVENTS ------------------------
    document.addEventListener('keydown', function(event) {
        if (event.keyCode == '40') {
            skew.down = true;
        }
        if (event.keyCode == '38') {
            skew.up = true;
        }
        if (event.keyCode == '39') {
            skew.right = true;
        }
        if (event.keyCode == '37') {
            skew.left = true;
        }
    }, false);

    document.addEventListener('keyup', function(event) {
        if (event.keyCode == '40') {
            skew.down = false;
        }
        if (event.keyCode == '38') {
            skew.up = false;
        }
        if (event.keyCode == '39') {
            skew.right = false;
        }
        if (event.keyCode == '37') {
            skew.left = false;
        }
    }, false);

    // ------------------------ GAME FUNCTIONS ------------------------
    function skewLeft(){
        pos.x -= speed;
        for (x in planet_ls){
            planet_ls[x].x += speed;
            for (y in planet_ls[x].path){
                planet_ls[x].path[y][0] += speed;
            }
        }
        for (x in bg_layer1){
            bg_layer1[x].x += speed / 2;
        }
        for (x in bg_layer2){
            bg_layer2[x].x += speed / 4;
        }
    }
    function skewRight(){
        pos.x += speed;
        for (x in planet_ls){
            planet_ls[x].x -= speed;
            for (y in planet_ls[x].path){
                planet_ls[x].path[y][0] -= speed;
            }
        }
        for (x in bg_layer1){
            bg_layer1[x].x -= speed / 2;
        }
        for (x in bg_layer2){
            bg_layer2[x].x -= speed / 4;
        }
    }
    function skewUp(){
        pos.y -= speed;
        for (x in planet_ls){
            planet_ls[x].y += speed;
            for (y in planet_ls[x].path){
                planet_ls[x].path[y][1] += speed;
            }
        }
        for (x in bg_layer1){
            bg_layer1[x].y += speed / 2;
        }
        for (x in bg_layer2){
            bg_layer2[x].y += speed / 4;
        }
    }
    function skewDown(){
        pos.y += speed;
        for (x in planet_ls){
            planet_ls[x].y -= speed;
            for (y in planet_ls[x].path){
                planet_ls[x].path[y][1] -= speed;
            }
        }
        for (x in bg_layer1){
            bg_layer1[x].y -= speed / 2;
        }
        for (x in bg_layer2){
            bg_layer2[x].y -= speed / 4;
        }
    }
    function genBG(n){
        for (let x = 0; x < n; x++){
            let new_star = {
                x: Math.random()*canvas.width*10 - canvas.width*5,
                y: Math.random()*canvas.height*10 - canvas.height*5,
                size: 2,
                color: "rgba(255,255,255,0.8)"
            };
            bg_layer1.push(new_star)
        }
        for (let x = 0; x < n; x++){
            let new_star = {
                x: Math.random()*canvas.width*10 - canvas.width*5,
                y: Math.random()*canvas.height*10 - canvas.height*5,
                size: 1,
                color: "rgba(255,255,255,0.5)"
            };
            bg_layer2.push(new_star)
        }
    }
    function genPlanets(n){
        for (let x = 0; x < n; x++){
            let new_planet = {
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height,
                path: [],
                xvel: Math.random()*1 - 0.5,
                yvel: Math.random()*1 - 0.5,
                mass: Math.random()*50 + 50,
                size: Math.random()*8,
                color: planetColor()
            };
            planet_ls.push(new_planet)
        }
    }
    function movePlanet(p){
        // Compute the distance of the other body.
        let dx = ((canvas.width / 2) - p.x)
        let dy = ((canvas.height / 2) - p.y)
        let d = Math.sqrt(dx**2 + dy**2)

        if (d == 0){
            console.error('collision');
        }

        // Compute the force of attraction
        let force = 0.0098 * 1 * p.mass * sun_mass / (d**2)

        // Compute the direction of the force.
        let theta = Math.atan2(dy, dx);
        let fx = Math.cos(theta) * force;
        let fy = Math.sin(theta) * force;
        p.xvel = (p.xvel + fx);
        p.yvel = (p.yvel + fy);

        p.path.push([p.x, p.y]);
        if (p.path.length > trail_max){
            p.path.shift();
        }
        p.x += p.xvel;
        p.y += p.yvel;
        if ( ((canvas.width / 2) - sun_rad < p.x && p.x < (canvas.width / 2) + sun_rad) && ((canvas.height / 2) - sun_rad < p.y && p.y < (canvas.height / 2) + sun_rad) )
        {
            // collision with sun
            createExplosion(p.x, p.y);
            let i = planet_ls.indexOf(p);
            planet_ls.splice(i, 1);

            score += 10;
            sun_mass += p.mass * 2;
            sun_rad += 3;
        }
    }
    function createExplosion(x,y){
        let boom = {
            x: x,
            y: y,
            size: 10
        };
        explosions.push(boom);
    }
    // ------------------------ UTIL FUNCTIONS ------------------------
    function planetColor(){
        let color = "rgb(";
        color += Math.floor(Math.random()*255) + ", ";
        color += Math.floor(Math.random()*255) + ", ";
        color += Math.floor(Math.random()*155 + 100) + ")";
        console.log(color);
        return color
    }
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Update game objects
    var update = function (modifier) {
    };

    // Draw everything
    var render = function () {
        ctx.shadowBlur = 0;
        // BACKGROUND
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // STARS
        for (x in bg_layer1) {
            ctx.fillStyle = bg_layer1[x].color;
            ctx.beginPath();
            ctx.arc(bg_layer1[x].x, bg_layer1[x].y, bg_layer1[x].size, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
        for (x in bg_layer2) {
            ctx.fillStyle = bg_layer2[x].color;
            ctx.beginPath();
            ctx.arc(bg_layer2[x].x, bg_layer2[x].y, bg_layer2[x].size, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }

        // PLANETS
        for (x in planet_ls) {
            // draw body
            ctx.fillStyle = planet_ls[x].color;
            ctx.beginPath();
            ctx.arc(planet_ls[x].x, planet_ls[x].y, planet_ls[x].size, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            // draw tail
            for (let y = planet_ls[x].path.length - 2; y >= 0; y--){
                ctx.strokeStyle = "rgba" + planet_ls[x].color.slice(3, -1) +  ", " + (y / planet_ls[x].path.length / 2) + ')';
                ctx.lineWidth = (y / planet_ls[x].path.length)*planet_ls[x].size*2;
                ctx.beginPath();
                ctx.moveTo(planet_ls[x].path[y+1][0], planet_ls[x].path[y+1][1]);
                ctx.lineTo(planet_ls[x].path[y][0], planet_ls[x].path[y][1]);
                ctx.stroke();
            }
            
        }

        // EXPLOSIONS
        for (x in explosions) {
            ctx.fillStyle = "rgba(243, 135, 68," + 3/explosions[x].size + ")";
            ctx.beginPath();
            ctx.arc(explosions[x].x, explosions[x].y, explosions[x].size, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }

        // SUN
        ctx.shadowBlur = 50;
        ctx.shadowColor = "white";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, sun_rad, 0, Math.PI*2);
        ctx.fillStyle = "rgba(238, 238, 215, 1)";
        ctx.fill();
        ctx.closePath();

        // TEXT
        ctx.fillStyle = "white";
        ctx.font = "12px Helvetica";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("X: " + pos.x + ", Y: " + pos.y, canvas.width - 10, 10); 

        ctx.textAlign = "left";
        ctx.font = "30px Helvetica";
        ctx.fillText(score, 10, 10); 
    };

    // ------------------------ MAIN LOOP ------------------------
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);

        if (skew.up) skewUp();
        if (skew.down) skewDown();
        if (skew.left) skewLeft();
        if (skew.right) skewRight();

        for (x in planet_ls){ // update planet positions
            movePlanet(planet_ls[x]);
        }
        for (x in explosions){
            explosions[x].size += 3;
            if (explosions[x].size > 40){
                explosions.splice(x, 1);
            }
        }


        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    // Let's play this game!
    var then = Date.now();
    genPlanets(15);
    //genBG(800);
    main();
}