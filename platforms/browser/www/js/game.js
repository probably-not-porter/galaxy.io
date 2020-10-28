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

    // Movement related
    var speed = 10;
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

    var planet_ls = []; // keep track of all existing planets
    
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
    }
    function skewRight(){
        pos.x += speed;
        for (x in planet_ls){
            planet_ls[x].x -= speed;
            for (y in planet_ls[x].path){
                planet_ls[x].path[y][0] -= speed;
            }
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
    }
    function skewDown(){
        pos.y += speed;
        for (x in planet_ls){
            planet_ls[x].y -= speed;
            for (y in planet_ls[x].path){
                planet_ls[x].path[y][1] -= speed;
            }
        }
    }
    function genPlanets(n){
        for (let x = 0; x < n; x++){
            let new_planet = {
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height,
                path: [],
                xvel: 0,
                yvel: 0,
                mass: Math.random()*100,
                size: Math.random()*8,
                color: 'white'
            };
            planet_ls.push(new_planet)
            console.log(planet_ls);
        }
    }
    function movePlanet(p){
        let dist = Math.sqrt( Math.abs(p.x - canvas.width / 2)**2 + Math.abs(p.y - canvas.height / 2)**2);
        let dist_y = Math.abs(p.y - canvas.height / 2);
        let dist_x = Math.abs(p.x - canvas.width / 2);

        // Compute the distance of the other body.
        //sx, sy = self_x, self_y
        //ox, oy = screen_width / 2, screen_height / 2
        20
        let dx = ((canvas.width / 2) - p.x)
        let dy = ((canvas.height / 2) - p.y)
        let d = Math.sqrt(dx**2 + dy**2)

        if (d == 0){
            console.error('collision');
        }

        // Compute the force of attraction
        let force = 9.8 * 1 * p.mass * 1 / (d**2)

        // Compute the direction of the force.
        let theta = Math.atan2(dy, dx);
        let fx = Math.cos(theta) * force;
        let fy = Math.sin(theta) * force;
        p.xvel = (p.xvel + fx);
        p.yvel = (p.yvel + fy);

        p.path.push([p.x, p.y]);
        if (p.path.length > 100){
            p.path.shift();
        }
        p.x += p.xvel;
        p.y += p.yvel;
    }
    // ------------------------ UTIL FUNCTIONS ------------------------

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Update game objects
    var update = function (modifier) {
    };

    // Draw everything
    var render = function () {
        // bg
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // SUN
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI*2);
        ctx.fillStyle = "lightyellow";
        ctx.fill();
        ctx.closePath();

        // PLANETS
        for (x in planet_ls) {
            // draw body
            ctx.fillStyle = planet_ls[x].color;
            ctx.beginPath();
            ctx.arc(planet_ls[x].x, planet_ls[x].y, planet_ls[x].size, 0, Math.PI*2);
            ctx.fillStyle = planet_ls[x].color;
            ctx.fill();
            ctx.closePath();

            // draw path
            ctx.strokeStyle = "lightyellow";
            ctx.beginPath();
            
            //console.log(planet_ls[x].path)
            ctx.moveTo(planet_ls[x].x, planet_ls[x].y);
            for (let y = planet_ls[x].path.length - 1; y >= 0; y--){
                ctx.lineTo(planet_ls[x].path[y][0], planet_ls[x].path[y][1]);
            }
            ctx.stroke();
        }

        // Score
        
        ctx.fillStyle = "white";
        ctx.font = "18px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("X: " + pos.x + ", Y: " + pos.y, 10, 10); 
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


        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    // Let's play this game!
    var then = Date.now();
    genPlanets(30);
    main();
}