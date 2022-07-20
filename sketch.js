var capturer = new CCapture({
  format: "webm",
  framerate: 60,
  verbose: true,
})

let t = 0;
let n = 5000;
let particles = [];
let bc_picker = "smoke"; // smoke / landscape
let style_picker = "line"; // line / ellipse / point
const opacity = 50;
let colors = [
  "rgba(181,243,194,0.1)",
  "rgba(111,188,174,0.1)",
]
let bc = "rgba(35,40,48"
let bc_smoke = `${bc}, 0.2)`
let bc_landscape = `${bc}, 1)`
let isDrawing = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bc_landscape)

  for (var i = 0; i < n; i++) {
      particles.push({
          pos: createVector(random(windowWidth), random(windowHeight)),
          vel: createVector(0,0),
          col: colors[Math.floor(Math.random()*colors.length)],
        seed: i
      });
  }
}

function draw() {
  if (frameCount == 60) {
    capturer.start();
  }
  if(!isDrawing)return;
  if(bc_picker == "smoke"){
    background(bc_smoke)
  }
  particles.forEach((p) => {
    stroke(p.col)
    fill(p.col)
    display(p.pos, p.vel);
    update(t, p.pos, p.vel, p.seed, windowWidth, windowHeight);
  });
  t += 0.002;
  if (frameCount < 60*10) {
    capturer.capture(canvas);
  }else if (frameCount === 60*10) {
    capturer.save()
    capturer.stop()
  }
}

function keyPressed(){
if (keyCode === ENTER){
    isDrawing = !isDrawing
  }
}

function display (pos, vel) {
  if(style_picker == "line"){
    line(pos.x, pos.y, (pos.x + vel.x), (pos.y + vel.y));
  }else if(style_picker == "ellipse"){
    ellipse(pos.x, pos.y, 2);
  }else if (style_picker == "point"){
    point(pos.x, pos.y);
  }
}


function update (t, pos, vel, seed, w, h) {
  pos.x = mod((pos.x + vel.x), w);
  pos.y = mod((pos.y + vel.y), h);

  var r = p5.Vector.fromAngle(noise(seed, t) * TWO_PI);
  vel.x = r.x;
  vel.y = r.y;

  vel.add(flow(pos, t)).mult(3);
}

function flow (pos, t) {
  let r = noise(pos.x / 100, pos.y / 100, t*10) * TWO_PI;
  return p5.Vector.fromAngle(r).mult(3);
}

function mod (x, n) {
  return ((x % n) + n ) % n;
}