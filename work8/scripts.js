

window.addEventListener('deviceorientation', function(event) {

    const { alpha, beta, gamma } = event;

    const up = beta < -10;
    const down = beta > 10;
    
    const right = alpha > 10;
    const left = alpha < -10;

    const alphaIsBigger = Math.abs(alpha) > Math.abs(beta);

    // console.log(up, down, right, left, alphaIsBigger);

    if (alphaIsBigger) {
        
        if (right) {
            console.log("go right")
        } else if (left) {
            console.log("go left")
        }

    }

    else {

        if (up) {
            console.log("go up")
        } else if (down) {
            console.log("go down")
        }

    }

});
