window.onload = function() {
    // Create the canvas
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

    // Game objects
    var hero = {
        speed: 256, // movement in pixels per second
        x: 0,
        y: 0
    };
    var monster = {
        x: 0,
        y: 0
    };
    var monstersCaught = 0;

    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    var dragStart;
    var dragEnd;

    canvas.addEventListener('mousedown', function(event) {
        console.log('test');
        dragStart = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop
        }
    });
    canvas.addEventListener('mouseup', function(event) {
        dragStart = null;
    });

    canvas.addEventListener('mousemove', function(event) {
        console.log(dragStart);
        if (dragStart) {
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop
            }
            //ctx.translate((dragEnd.x - dragStart.x) / 20, (dragEnd.y - dragStart.y) / 20);
            clear()
        }
    });
    

    // Reset the game when the player catches a monster
    var reset = function () {
    };
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

        // center
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI*2);
        ctx.fillStyle = "lightyellow";
        ctx.fill();
        ctx.closePath();

        // Score
        
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
    };

    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    // Let's play this game!
    var then = Date.now();
    reset();
    main();
}