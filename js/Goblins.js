let gravity = 1;

function CreateGoblin(gfx, name = "First Last") {
  if (!gfx) {
    gfx = 'sprite';
  }

  // animations
  const ANI = {
    RIGHT: 'images/GoblinWalkRight.gif', // change to the correct paths and names
    LEFT: 'images/GoblinWalkLeft.gif',
    IDLE_RIGHT: 'images/GoblinIdleRight.gif',
    IDLE_LEFT: 'images/GoblinIdleLeft.gif'
  };

  // goblin element
  var ele = document.createElement("div");
  ele.style.position = 'fixed';
  ele.style.width = '64px';
  ele.style.height = '64px';
  document.body.appendChild(ele);

  // goblin's name
  var nameBox = document.createElement("div");
  nameBox.style.position = 'absolute';
  nameBox.style.top = '-20px';
  nameBox.style.fontSize = '18px';
  nameBox.style.fontFamily = 'Trykker';
  nameBox.style.color = '#000';
  nameBox.textContent = name;
  nameBox.style.textAlign = 'center';
  nameBox.style.whiteSpace = 'nowrap'; 
  ele.appendChild(nameBox);

  // dynamically center the name
  nameBox.style.left = `calc(42% - ${nameBox.offsetWidth / 2}px)`;


  // initial position
  var x = Math.floor(window.innerWidth / 2);
  var y = Math.floor(window.innerHeight / 2);
  ele.style.left = `${x}px`;
  ele.style.top = `${y}px`;

  // initial velocity
  var y_vel = Math.random() * -20;

  // create GIF image element
  var gif = document.createElement("img");
  ele.appendChild(gif);
  gif.style.width = '55px';
  gif.style.height = '60px';

  var behavior;
  var duration = 0;
  var check = true;
  var moveSpeed = 3;
  var prevAnimation = 0;

  // set animation function
  var setAnim = (a) => {
    gif.src = a;
  };

  // start with idle animation
  setAnim(ANI.IDLE_RIGHT);

  // update goblin's behavior and position
  var update = () => {
    //Gravity
    y_vel += gravity;
    y += y_vel;

    // keeps goblin on bottom of screen
    if (y > window.innerHeight - 60) {
      y = window.innerHeight - 60;
      y_vel = 0;
    }
    ele.style.top = `${y}px`;

    // allows animation to play before switching
    if (duration > 0) {
      duration--;
    } else {
      check = true; 
    }

    // goblin movement logic
    if (behavior == 1 || behavior == 2) {
      if (behavior == 1) {
        x -= moveSpeed;
      } else {
        x += moveSpeed;
      }
      ele.style.left = `${x}px`;

      // prevent the goblin from going off-screen
      if (x < 0) x = 0;
      if (x > window.innerWidth - 64) x = window.innerWidth - 64;
    }

    // random behavior
    if (check) {
      duration = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
      behavior = Math.floor(Math.random() * 5);

      if (behavior == 1) {
        setAnim(ANI.LEFT); 
        prevAnimation = 1;
      } else if (behavior == 2) {
        setAnim(ANI.RIGHT); 
        prevAnimation = 2;
      } else {
        if (prevAnimation == 1) {
          setAnim(ANI.IDLE_LEFT);
        } else {
          setAnim(ANI.IDLE_RIGHT);
        }
      }

      check = false;
    }
  };

  // main animation loop
  const animate = () => {
    update()
    requestAnimationFrame(animate);
  };

  animate();// random delay

  return ele;
}
