let gravity = 1;
let goblins = {}; //Stores all of the goblin data

class Goblin {
  // animations
  static ANI = {
    RIGHT: 'images/GoblinWalkRight.gif', // change to the correct paths and names
    LEFT: 'images/GoblinWalkLeft.gif',
    IDLE_RIGHT: 'images/GoblinIdleRight.gif',
    IDLE_LEFT: 'images/GoblinIdleLeft.gif'
  };

  constructor(id, firstName, lastName)
  {
    this.id = id;

    // Div
    this.div = document.createElement("div");
    this.div.id = "goblin" + id;
    this.div.style.position = 'fixed';
    this.div.style.zIndex = '3';
    this.div.style.width = '64px';
    this.div.style.height = '64px';
    document.body.appendChild(this.div);

    // Name
    this.nameBox = document.createElement("div");
    this.nameBox.style.position = 'absolute';
    this.nameBox.style.top = '-30px';
    this.nameBox.style.fontSize = '18px';
    this.nameBox.style.fontFamily = 'Trykker';
    this.nameBox.style.color = window.getComputedStyle(document.body).getPropertyValue("--text-color");
    this.nameBox.textContent = firstName + " " + lastName;
    this.nameBox.style.textAlign = 'center';
    this.nameBox.style.whiteSpace = 'nowrap'; 
    this.nameBox.style.background = window.getComputedStyle(document.body).getPropertyValue("--background-color");
    this.nameBox.style.borderRadius = '5px';
    this.nameBox.style.padding = '3px';
    this.div.appendChild(this.nameBox);

    // initial position/velocity
    this.position = [75, 100];
    this.velocity = [0, Math.random() * -20];

    // Dynamically center the name
    this.nameBox.style.left = `calc(42% - ${this.nameBox.offsetWidth / 2}px)`;

    // Image Element
    this.gif = document.createElement("img");
    this.div.appendChild(this.gif);
    this.gif.style.width = '55px';
    this.gif.style.height = '60px';

    this.behavior;
    this.duration = 0;
    this.check = true;
    this.moveSpeed = 3;
    this.prevAnimation = 0;
    this.removed = false;
  
    // start with idle animation
    this.setAnim(Goblin.ANI.IDLE_RIGHT);
  }

  setAnim(a) {
    this.gif.src = a;
  }

  update() {
    //Gravity
    this.velocity[1] += gravity;
    this.position[1] += this.velocity[1];

    // keeps goblin on bottom of screen
    if (!this.removed && this.position[1] > window.innerHeight - 60) {
      this.position[1] = window.innerHeight - 60;
      this.velocity[1] = 0;
    }
    this.div.style.top = `${this.position[1]}px`;

    // allows animation to play before switching
    if (this.duration > 0) {
      this.duration--;
    } else {
      this.check = true; 
    }

    // goblin movement logic
    if (this.behavior == 1 || this.behavior == 2) {
      if (this.behavior == 1) {
        this.position[0] -= this.moveSpeed;
      } else {
        this.position[0] += this.moveSpeed;
      }

      // prevent the goblin from going off-screen
      if (this.position[0] < 0) this.position[0] = 0;
      if (this.position[0] > window.innerWidth - 64) this.position[0] = window.innerWidth - 64;
    }
    //Set the goblin's div's horizontal position
    this.div.style.left = `${this.position[0]}px`;

    // random behavior
    if (this.check) {
      this.duration = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
      this.behavior = Math.floor(Math.random() * 5);

      if (this.behavior == 1) {
        this.setAnim(Goblin.ANI.LEFT); 
        this.prevAnimation = 1;
      } else if (this.behavior == 2) {
        this.setAnim(Goblin.ANI.RIGHT); 
        this.prevAnimation = 2;
      } else {
        if (this.prevAnimation == 1) {
          this.setAnim(Goblin.ANI.IDLE_LEFT);
        } else {
          this.setAnim(Goblin.ANI.IDLE_RIGHT);
        }
      }

      this.check = false;
    }
  }

  remove() {
    this.velocity[1] = -20; //Jump up
    this.removed = true;
    setTimeout(() => { //Destroy after 2 seconds
      this.destroy()
    }, 2000);
  }

  destroy() {
    this.div.remove();
    delete goblins[this.id];
  }
}

function animate() {
  updateAll()
  requestAnimationFrame(animate);
};

function updateAll()
{
  for (let id in goblins)
  {
    goblins[id].update();
  }
}

animate();