const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.rotation = 0;
    const image = new Image();
    image.src = "./img/spaceship.png";
    // image.src = "./img/rocket.png";

    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.save();
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    c.rotate(this.rotation);
    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }

    c.restore();
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;

      this.radius = 3;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "blue";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    // image.src = "./img/spaceship.png";
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }
  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
      this.radius = 3;
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 1,
    };
    this.invaders = [];

    const columns = Math.floor(Math.random() * 10) + 5;
    const rows = Math.floor(Math.random() * 5) + 2;

    this.width = columns * 30;

    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        this.invaders.push(
          new Invader({
            position: {
              x: i * 30,
              y: j * 30,
            },
          })
        );
      }
    }
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 60;
    } else if (this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 60;
    }
  }
}

const grids = [new Grid()];

const player = new Player();
const projectiles = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  grids.forEach((grid) => {
    grid.update();
    grid.invaders.forEach((invader) => {
      invader.update({ velocity: grid.velocity });
    });
  });

  player.update();

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.rotation = +0.15;
    player.velocity.x = +5;
  } else {
    player.rotation = 0;
    player.velocity.x = 0;
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      //   console.log("left");
      break;
    case "d":
      keys.d.pressed = true;
      //   console.log("right");
      break;
    case " ":
      //   console.log("space clicked");
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          },
        })
      );
      //   console.log(projectiles);
      break;
    case "w":
      //   console.log("up");
      break;
    case "s":
      //   console.log("down");
      break;

    default:
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      //   console.log("left stop");
      break;
    case "d":
      keys.d.pressed = false;
      //   console.log("right stop ");
      break;
    case "w":
      //   console.log("up");
      break;
    case "s":
      //   console.log("down");
      break;

    default:
      break;
  }
});
