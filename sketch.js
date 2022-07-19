let t = 0;
let n = 5000;
let particles = [];
let bc_picker;
let style_picker;
const opacity = 50;
let colors = [
  "rgba(181,243,194,0.01)",
  "rgba(111,188,174,0.01)",
]
let bc = "rgba(35,40,48"
let bc_smoke = `${bc}, 0.2)`
let bc_landscape = `${bc}, 1)`
let isDrawing = true;

function setup() {
  bc_picker = createRadio();
  bc_picker.option("1", 'smoke');
  bc_picker.option("2", 'landscape');
  bc_picker.selected("2")
  style_picker = createRadio();
  style_picker.option("1", 'line');
  style_picker.option("2", 'ellipse');
  style_picker.option("3", 'point');
  style_picker.selected("1")
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
  if(!isDrawing)return;
  if(bc_picker.value() == 1){
    background(bc_smoke)
  }
  particles.forEach((p) => {
    stroke(p.col)
    fill(p.col)
    display(p.pos, p.vel);
    update(t, p.pos, p.vel, p.seed, windowWidth, windowHeight);
  });
  t += 0.002;
}

function keyPressed(){
if (keyCode === ENTER){
    isDrawing = !isDrawing
  }
}

function display (pos, vel) {
  if(style_picker.value() == 1){
    line(pos.x, pos.y, (pos.x + vel.x), (pos.y + vel.y));
  }else if(style_picker.value() == 2){
    ellipse(pos.x, pos.y, 2);

  }else if (style_picker.value() == 3){
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