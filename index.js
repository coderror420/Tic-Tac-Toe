console.log("Tic Tac Toe");
let music = new Audio("music.mp3");
let audioturn = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");

let turn = "X";
let isgameover = false;
// fn to change turn

const changeTurn = () => {
    return turn == "X" ? "0" : "X";
}
//function to check win
const checkwin = () => {
    let boxtexts = document.getElementsByClassName('box-text');
    let wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    wins.forEach(e => {
        if ((boxtexts[e[0]].innerHTML !== "") && (boxtexts[e[0]].innerHTML === boxtexts[e[1]].innerHTML) && (boxtexts[e[2]].innerHTML === boxtexts[e[1]].innerHTML)) {
            document.querySelector('.info').innerHTML = boxtexts[e[0]].innerHTML + " Won 🏆";
            isgameover = true;
            gameover.play();
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width="150px"; 

        }

    });
}
//game logic
document.body.addEventListener("click", function () {
    music.play();
});
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach((element => {
    let boxtexts = element.querySelector('.box-text');
    element.addEventListener('click', () => {
        if (boxtexts.innerHTML === '') {
            boxtexts.innerHTML = turn;
            turn = changeTurn();
            audioturn.play();
            checkwin();
            if (!isgameover) {
                document.getElementsByClassName("info")[0].innerHTML = "Turn for " + turn;
            }
            else {
                startConfetti();
                setTimeout(() => {
                    stopConfetti();
                }, 5000);
            }

        }
    })
}))


const reset= ()=> {
    let boxtexts = document.getElementsByClassName('box-text');
    Array.from(boxtexts).forEach((boxtext) => {
        boxtext.innerHTML = '';
    });
    turn = "X";
    isgameover = false;
    document.querySelector('.info').innerHTML = "Turn for " + turn;
    stopConfetti();
    removeConfetti();
    const imgBox = document.querySelector('.imgbox img');
    if (imgBox) imgBox.style.width = "0";
}
document.getElementById('reset').addEventListener('click', reset);

var maxParticleCount = 150; //set max confetti count
var particleSpeed = 2; //set the particle animation speed
var startConfetti; //call to start confetti animation
var stopConfetti; //call to stop adding confetti
var toggleConfetti; //call to start or stop the confetti animation depending on whether it's already running
var removeConfetti; //call to stop the confetti animation and remove all confetti immediately

(function () {
    startConfetti = startConfettiInner;
    stopConfetti = stopConfettiInner;
    toggleConfetti = toggleConfettiInner;
    removeConfetti = removeConfettiInner;
    var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
    var streamingConfetti = false;
    var animationTimer = null;
    var particles = [];
    var waveAngle = 0;
    function resetParticle(particle, width, height) {
        particle.color = colors[(Math.random() * colors.length) | 0];
        particle.x = Math.random() * width; // Random X position
        particle.y = Math.random() * -height * 0.5; // Start well above the top of the screen
        particle.diameter = Math.random() * 10 + 5; // Random size
        particle.tilt = Math.random() * 10 - 10; // Random tilt
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05; // Animation variation
        particle.tiltAngle = 0;
        return particle;
    }



    function startConfettiInner() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, 16.6666667);
                };
        })();
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            canvas.setAttribute(
                "style",
                "display:block;z-index:999999;pointer-events:none;position:fixed;top:0;left:0;width:100%;height:100%;"
            );

            document.body.appendChild(canvas);
            canvas.width = width;
            canvas.height = height;
            window.addEventListener("resize", function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, true);
        }
        var context = canvas.getContext("2d");
        while (particles.length < maxParticleCount)
            particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        if (animationTimer === null) {
            (function runAnimation() {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (particles.length === 0)
                    animationTimer = null;
                else {
                    updateParticles();
                    drawParticles(context);
                    animationTimer = requestAnimFrame(runAnimation);
                }
            })();
        }
    }

    function stopConfettiInner() {
        streamingConfetti = false;
    }

    function removeConfettiInner() {
        stopConfetti();
        particles = [];
    }

    function toggleConfettiInner() {
        if (streamingConfetti)
            stopConfettiInner();
        else
            startConfettiInner();
    }

    function drawParticles(context) {
        var particle;
        var x;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            context.strokeStyle = particle.color;
            x = particle.x + particle.tilt;
            context.moveTo(x + particle.diameter / 2, particle.y);
            context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
            context.stroke();
        }
    }

    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            particle.tiltAngle += particle.tiltAngleIncrement;
            particle.x += Math.sin(waveAngle); // Horizontal movement
            particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5; // Vertical movement
            particle.tilt = Math.sin(particle.tiltAngle) * 15;

            // Reset particle to the top when it leaves the screen
            if (!streamingConfetti && particle.y < -15) {
                particle.y = height + 100; // Original behavior, which "lingers" particles
            } else {
                // Update particle position
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle);
                particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            
            // Reset particle only if streamingConfetti is true
            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti) {
                    resetParticle(particle, width, height);
                } else {
                    particles.splice(i, 1);
                    i--;
                }
            }
            
        }
    }


})();
