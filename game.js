(function gameSetup() {
    'use strict';

    var shipElem = document.getElementById('ship');

    // SHIP OBJECT
    var ship = {
        velocity: 0,
        angle: 0,
        element: shipElem, // linked actual ship element on the screen into object
        top: 0,
        left: 0
    };

    //set shipsCurrentAngle and shipsCurrentVelocity equal to ship object's angle and velocity (initialized at 0)
    var shipsCurrentAngle = ship.angle;
    var shipsCurrentVelocity = ship.velocity;

    //TESTS
    // console.log("ships current velocity is " + shipsCurrentVelocity);
    // console.log("ships current angle is " + shipsCurrentAngle);
    // console.log("angleString is " + angleString + "type: " + typeof(angleString));

    var allAsteroids = [];
    shipElem.addEventListener('asteroidDetected', function(event) {

        //Adds asteroids to an array to loop through to check for collisions

        if ('asteroidDetected') {
          allAsteroids.push(event.detail);
        }

    });

    /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @param  {Event} event   The "keyup" event object with a bunch of data in it
     * @return {void}          In other words, no need to return anything
     */
    function handleKeys(event) {

        // 1. if (event.keyCode === 38) increase velocity, velocity += 10
        // 2. else if (event.keyCode ===40) decrease velocity, velocity -= 10
        //3. else if (event.keyCode ===37) decreease angle, angle -=10
        // 4. else if (event.keyCode ===39) increase angle, angle +=10;

        if (event.keyCode === 38) {
            ship.velocity += 1;
            shipsCurrentVelocity = ship.velocity;
        //    console.log("ships current velocity is: " + shipsCurrentVelocity);

        } else if (event.keyCode === 40) {

            // if/else statement to set minimum velocity to zero

            if (shipsCurrentVelocity <= 0) {
                ship.velocity = 0;
            } else {
                ship.velocity -= 1;
                shipsCurrentVelocity = ship.velocity;
            //    console.log("ships current velocity is: " + shipsCurrentVelocity);
            }

        } else if (event.keyCode === 37) {
            ship.angle -= 10;
            shipsCurrentAngle = ship.angle;
          //  console.log("ships current angle is " + shipsCurrentAngle);

        } else if (event.keyCode === 39) {
            ship.angle += 10;
            shipsCurrentAngle = ship.angle;
          //  console.log("ships current angle is " + shipsCurrentAngle);
        }
    }
    document.querySelector('body').addEventListener('keyup', handleKeys);

    /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @return {void}
     */
    function gameLoop() {
        // This function for getting ship movement is given to you (at the bottom).
        // NOTE: you will need to change these arguments to match your ship object!
        // What does this function return? What will be in the `move` variable?
        // Read the documentation!
        var move = getShipMovement(shipsCurrentVelocity, shipsCurrentAngle);

        // Makes the ship glide by incrementing move.top and move.left
        ship.top += move.top;
        ship.left += move.left;

        // Creates strings of ship.top and ship.left in order to plug them into style operation
        var moveTop = (String(-ship.top) + "px");
        var moveLeft = (String(ship.left) + "px");
        var angleString = 'rotate(' + String(shipsCurrentAngle) + 'deg)';


        ship.element.style.transform = angleString;
        ship.element.style.top = moveTop;
        ship.element.style.left = moveLeft;


        // Time to check for any collisions (see below)...
        checkForCollisions();
    }

    /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @return void
     */
    function checkForCollisions() {

      for (var asteroid = 0; asteroid < allAsteroids.length; asteroid++) {
        if (ship.element.getBoundingClientRect().bottom > allAsteroids[asteroid].getBoundingClientRect().top
            && ship.element.getBoundingClientRect().top < allAsteroids[asteroid].getBoundingClientRect().bottom
            && ship.element.getBoundingClientRect().right > allAsteroids[asteroid].getBoundingClientRect().left
            && ship.element.getBoundingClientRect().left < allAsteroids[asteroid].getBoundingClientRect().right) {
              crash(allAsteroids[asteroid]);
              break;
            }

       }

    }


    /**
     * This event handler will execute when a crash occurs
     *
     * return {void}
     */
    document.querySelector('main').addEventListener('crash', function() {
        console.log('A crash occurred!');

        //Alerts user that the game has ended and reload the page

        alert("GAME OVER!");
        document.location.reload();

    });



    /** ************************************************************************
     *             These functions and code are given to you.
     *
     *                   !!! DO NOT EDIT BELOW HERE !!!
     ** ************************************************************************/

    var loopHandle = setInterval(gameLoop, 20);

    /**
     * Executes the code required when a crash has occurred. You should call
     * this function when a collision has been detected with the asteroid that
     * was hit as the only argument.
     *
     * @param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
     * @return {void}
     */
    function crash(asteroidHit) {
        document.querySelector('body').removeEventListener('keyup', handleKeys);
        asteroidHit.classList.add('hit');
        document.querySelector('#ship').classList.add('crash');

        var event = new CustomEvent('crash', {
            detail: asteroidHit
        });
        document.querySelector('main').dispatchEvent(event);
    }

    /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  {Number} velocity The current speed of the ship (no units)
     * @param  {Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */
    function getShipMovement(velocity, angle) {
        return {
            left: (velocity * Math.sin(angle * Math.PI / 180)),
            top: (velocity * Math.cos(angle * Math.PI / 180))
        };
    }

})();
