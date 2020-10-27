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
    var dragging = false;
    var dragStart;
    var dragEnd;
    var dragVel;
    var dragVelLast = {
        x: 0,
        y: 0
    }

    var planet_ls = []; // keep track of all existing planets
    
    // ------------------------ EVENTS ------------------------

    canvas.addEventListener('mousedown', function(event) {
        dragging = true;
        dragStart = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop
        }
    });
    canvas.addEventListener('mouseup', function(event) {
        dragging = false;
    });

    canvas.addEventListener('mousemove', function(event) {
        
        if (dragging) {
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop
            }
            dragVel = {
                x: dragStart.x - dragEnd.x,
                y: dragStart.y - dragEnd.y
            }
            console.log(dragVel.x - dragVelLast.x, dragVel.y - dragVelLast.y);
            
            for (x in planet_ls){
                planet_ls[x].x -= (dragVel.x) / 20
                planet_ls[x].y -= (dragVel.y) / 20
            }

            dragVelLast = dragVel;
        }
    });
    
    // ------------------------ GAME FUNCTIONS ------------------------
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
        
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
    };

    // ------------------------ MAIN LOOP ------------------------
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        for (x in planet_ls){
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