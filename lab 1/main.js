const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');

const canv2 = document.getElementById('canvas2');
const ctx2 = canv2.getContext('2d');

const kf = 0.5;
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

canv.width = windowWidth * kf;
canv.height = windowHeight;

canv2.width = windowWidth * kf;
canv2.height = windowHeight;

ctx.width = windowWidth * kf;
ctx.height = windowHeight;

ctx2.width = windowWidth * kf;
ctx2.height = windowHeight;

const radius = 20;
const selfRadius = radius / 2;

const arrowRadius = 5;
let verts = {};

const xCenter = windowWidth * kf / 2;
const yCenter = windowHeight / 2;

{
  const n = 11;
  const x = windowWidth * kf / 2;
  const y = windowHeight / 2;
  const r = windowHeight / 3;
  
  const alpha = 2 * Math.PI / n;

  const vertics = {};
  let i = 1;

  for (let angle = 0; i <= n; angle += alpha) {
    const newX = x + r * Math.cos(angle);
    const newY = y + r * Math.sin(angle);
    vertics[`vert${i}`] = {};
    vertics[`vert${i}`].x = newX;
    vertics[`vert${i}`].y = newY;
    i++;
  }
  verts = vertics;
}

for(const key in verts) {  //adding props
  verts[key].cons = [],
  verts[key].soloDirected = [],
  verts[key].bothDirected = []
}

const N = 11;

const matrix = [
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
]

const selfConnected = [];

for(let i = 0; i < matrix.length; i++) { //find connection
  for(let j = 0; j < matrix[i].length; j++) {
    if(matrix[i][j]) {
      const names = [`vert${i+1}`, `vert${j+1}`]
      if(!matrix[j][i]) verts[names[0]].soloDirected.push(`vert${j+1}`);
      else if(i !== j) verts[names[0]].bothDirected.push(`vert${j+1}`);
      else selfConnected.push(`vert${i+1}`)
      verts[names[0]].cons.push(j + 1)
    }
  }
}

console.log(verts);
console.log(selfConnected)

const defaultColor = '#939393';

ctx.fillStyle = defaultColor;
ctx.fillRect(0, 0, ctx.width, ctx.height);

ctx2.fillStyle = '#515151';
ctx2.fillRect(0, 0, ctx2.width, ctx2.height);

function additionalDots(from, to) {
  const alpha = Math.atan2(to.y - from.y, to.x - from.x);
  return { 
    dx : (radius / 2) * Math.cos(Math.PI / 2 - alpha),
    dy : (radius / 2) * Math.sin(Math.PI / 2 - alpha)
    }
}

function getEndCoords(from, to) { 
  const step = 1;
  const betta = Math.atan2(to.y - from.y, to.x - from . x);
  let x = from.x;
  let y = from.y;
  const dx = step * Math.cos(betta);
  const dy = step * Math.sin(betta);
  while(1) {
    x += dx;
    y += dy;
    if(Math.sqrt((to.x - x)**2 + (to.y - y)**2) < (radius + arrowRadius)) break;
  }
  return {x : x, y : y}
}

///// Directed
for(const key in verts) { //drawSoloArrows
  for(let i = 0; i < verts[key].soloDirected.length; i++) {
    ctx.beginPath();
    ctx.moveTo(verts[key].x, verts[key].y);
    ctx.lineTo(verts[verts[key].soloDirected[i]].x, verts[verts[key].soloDirected[i]].y);
    ctx.stroke();
    ctx.beginPath();
    const endCoords = getEndCoords(verts[key], verts[verts[key].soloDirected[i]]);
    drawArrowhead(ctx, verts[key], endCoords, arrowRadius, 'white', 'black');
    ctx.closePath();
  }
}
for(const key in verts) { //drawBothArrows
  for(let i = 0; i < verts[key].bothDirected.length; i++) {
    const {dx, dy} = additionalDots(verts[key], verts[verts[key].bothDirected[i]]);
    console.log(dx, dy)
    const from = {
      x : verts[key].x,
      y : verts[key].y
    }
    const to = {
      x : verts[verts[key].bothDirected[i]].x,
      y : verts[verts[key].bothDirected[i]].y
    }

    from.x += dx;
    from.y -= dy;
    to.x += dx;
    to.y -= dy;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    const endCoords = getEndCoords(from, to);
    drawArrowhead(ctx, from, endCoords, arrowRadius, 'white', 'black');
    ctx.closePath();
  }
}
for(const key of selfConnected) { //drawSelfConnected
  const alpha = Math.atan2(verts[key].y - yCenter, verts[key].x - xCenter);
  const R = Math.sqrt((xCenter - verts[key].x)**2 + (yCenter - verts[key].y)**2);

  const x = xCenter + (R + radius + selfRadius) * Math.cos(alpha);
  const y = yCenter + (R + radius + selfRadius) * Math.sin(alpha);

  const arrowX = xCenter + (R + radius + arrowRadius) * Math.cos(alpha);
  const arrowY = yCenter + (R + radius + arrowRadius) * Math.sin(alpha);

  ctx.beginPath();
  drawCircle(ctx, x, y, selfRadius, undefined, 'black');
  drawArrowhead(ctx, {x : x, y : y}, {x : arrowX, y : arrowY}, arrowRadius, 'white', 'black')
}

///// Not Directed
for(const key in verts) { //drawSoloArrows
  for(let i = 0; i < verts[key].soloDirected.length; i++) {
    ctx2.beginPath();
    ctx2.moveTo(verts[key].x, verts[key].y);
    ctx2.lineTo(verts[verts[key].soloDirected[i]].x, verts[verts[key].soloDirected[i]].y);
    ctx2.stroke();
  }
}
for(const key in verts) { //drawBothArrows
  for(let i = 0; i < verts[key].bothDirected.length; i++) {
    let from = verts[key];
    let to = verts[verts[key].bothDirected[i]]
    ctx2.beginPath();
    ctx2.moveTo(from.x, from.y);
    ctx2.lineTo(to.x, to.y);
    ctx2.stroke();
  }
}
for(const key of selfConnected) { //drawSelfConnected
  const alpha = Math.atan2(verts[key].y - yCenter, verts[key].x - xCenter);
  const R = Math.sqrt((xCenter - verts[key].x)**2 + (yCenter - verts[key].y)**2);

  const x = xCenter + (R + radius + selfRadius) * Math.cos(alpha);
  const y = yCenter + (R + radius + selfRadius) * Math.sin(alpha);

  ctx2.beginPath();
  drawCircle(ctx2, x, y, selfRadius, undefined, 'black');
}

for(const key in verts) { //draw vertics
  ctx.beginPath()
  drawCircle(ctx, verts[key].x, verts[key].y, radius, "#fff", 'black')

  ctx2.beginPath()
  drawCircle(ctx2, verts[key].x, verts[key].y, radius, "#fff", 'black')
}

for(let i = 1; i <= N; i++) { //draw text
  ctx.font = '30px Arial';
  ctx.fillStyle = defaultColor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.strokeText(`${i}`, verts[`vert${i}`].x, verts[`vert${i}`].y);

  ctx2.font = '30px Arial';
  ctx2.fillStyle = defaultColor;
  ctx2.textBaseline = 'middle';
  ctx2.textAlign = 'center';
  ctx2.strokeText(`${i}`, verts[`vert${i}`].x, verts[`vert${i}`].y);
}

function drawCircle(context, x, y, r, fillStyle, strokeStyle) { 
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;
  context.arc(x, y, r, 0, Math.PI * 2);
  context.stroke();
  if (fillStyle) context.fill();
  context.closePath();
}

function drawArrowhead(context, from, to, radius, fillStyle = 'white', strokestyle = 'black') {
  const x_center = to.x;
  const y_center = to.y;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  context.beginPath();
  angle = Math.atan2(to.y - from.y, to.x - from.x);
  x = radius * Math.cos(angle) + x_center;
  y = radius * Math.sin(angle) + y_center;

  context.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + x_center;
  y = radius * Math.sin(angle) + y_center;
  context.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + x_center;
  y = radius * Math.sin(angle) + y_center;
  context.lineTo(x, y);
  context.closePath();
  context.fill();
  context.stroke();
}
