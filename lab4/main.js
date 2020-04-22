const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');

const canv2 = document.getElementById('canvas2');
const ctx2 = canv2.getContext('2d');

const canv3 = document.getElementById('canvas3'); //condensation
const ctx3 = canv3.getContext('2d');

const term = document.getElementById('term');

let startText = 'Graph-plotter:~ circle$ ';
term.innerHTML = startText;

term.innerHTML +=  'directed --info <br>';

canv.style.display = 'block';
canv2.style.display = 'none';
canv3.style.display = 'none';

canv.style.position = 'absolute';
canv2.style.position = 'absolute';
canv3.style.position = 'absolute';

canv.width = windowWidth * kf;
canv.height = canv.width;

canv2.width = windowWidth * kf;
canv2.height = canv2.width;

canv3.width = windowWidth * kf;
canv3.height = canv2.width;

ctx.width = canv.width;
ctx.height = canv.height;

ctx2.width = canv2.width;
ctx2.height = canv2.height;

ctx3.width = canv2.width;
ctx3.height = canv2.height;


const radius = 20;
const selfRadius = radius / 2;

const arrowRadius = 5;

let verts = {};

const xCenter = bordWidth / 2;
const yCenter = bordHeight / 2;

{
  const n = 11;
  const x = xCenter;
  const y = yCenter;
  const r = bordWidth * kf;
  
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
  verts[key].in = [],
  verts[key].soloDirected = [],
  verts[key].bothDirected = []
}

const N = 11;

const matrix = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
]

const matrixCopy = JSON.parse(JSON.stringify(matrix));

const selfConnected = [];
const outerVerts = [];

for(let i = 0; i < matrixCopy.length; i++) { //find connection
  for(let j = 0; j < matrixCopy[i].length; j++) {
    if(matrixCopy[i][j]) {
      const names = [`vert${i+1}`, `vert${j+1}`];
      verts[names[1]].in.push(i+1);
      if(matrixCopy[j][i] === 0) verts[names[0]].soloDirected.push(`vert${j+1}`);
      else if(i !== j) verts[names[0]].bothDirected.push(`vert${j+1}`);
      else selfConnected.push(`vert${i+1}`)
      verts[names[0]].cons.push(j + 1)
      if(!outerVerts.includes(i + 1) && (i !== j)) outerVerts.push(i + 1);
    }
  }
}

const power = verts.vert1.soloDirected.length + verts.vert1.in.length;
let isHomogeneous = true;

for(const key in verts) { 
  verts[key].power = verts[key].cons.length + verts[key].in.length;
  verts[key].isHanging = (verts[key].power === 1) ? true : false;
  verts[key].isIsolated = (verts[key].power === 0 ||
  (verts[key].power === 2 && selfConnected.includes(key)
   && verts[key].cons.length === 1 && verts[key].in.length === 1)) ? true : false;
  if(verts[key].power !== power) isHomogeneous = false;
}

for(const key in verts) { 
  term.innerHTML += `<span id = 'yellow'>${key}</span>: `;
  term.innerHTML += `Degree(in) ${verts[key].in.length}; `;
  term.innerHTML += `Degree(out) ${verts[key].cons.length}; `;
  term.innerHTML += '<br>';
}
const starty = 9;
const dfsArray = [starty];
const dfsFull = [starty];

const dfs = (vertics, current, prev = 1) => {
  vertics[`vert${current}`].cons.forEach((val) => {
    if(!dfsArray.includes(val)){
      dfsArray.push(val);
      dfsFull.push(val);
      dfs(vertics, val, current);
    }
  });
  dfsFull.push(prev);
}

dfs(verts, starty);

let numMatrix = [];
for(let i = 0; i < N; i++) {
  numMatrix[i] = [];
  for(let j = 0; j < N; j++) {
    numMatrix[i][j] = 0;
  }
  numMatrix[i][dfsArray[i] - 1] = 1;
}


const iter = dfsFull[Symbol.iterator]();
let prev = 0;
const visited = [];

const halt = () => {
  let currVal = iter.next().value;
  visited.forEach(x => {
    ctx.beginPath();
    drawCircle(ctx, verts[`vert${x}`].x, verts[`vert${x}`].y, radius, '#0000FF', 'black');
    { //text
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(`${x}`, verts[`vert${x}`].x, verts[`vert${x}`].y);
      ctx.fillText(`${x}`, verts[`vert${x}`].x, verts[`vert${x}`].y);
    }
  })
  const currVert = `vert${currVal}`; 
  const prevVert = `vert${prev}`;
  ctx.beginPath();
  drawCircle(ctx, verts[currVert].x, verts[currVert].y, radius, 'red', 'black');
  { //text
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.strokeText(`${currVal}`, verts[currVert].x, verts[currVert].y);
  ctx.fillText(`${currVal}`, verts[currVert].x, verts[currVert].y);
  }
  if(prev) {
    ctx.beginPath()
    drawCircle(ctx, verts[prevVert].x, verts[prevVert].y, radius, 'green', 'black')

    { //text
      ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.strokeText(`${prev}`, verts[prevVert].x, verts[prevVert].y);
    ctx.fillText(`${prev}`, verts[prevVert].x, verts[prevVert].y);
    }
  }
  visited.push(currVal);
  prev = currVal;
}

const defaultColor = '#939393';

ctx.fillStyle = defaultColor;
//ctx.fillRect(0, 0, ctx.width, ctx.height);

ctx2.fillStyle = '#515151';
//ctx2.fillRect(0, 0, ctx2.width, ctx2.height);

function additionalDots(from, to) {
  const alpha = Math.atan2(to.y - from.y, to.x - from.x);
  return { 
    dx : (radius / 2) * Math.cos(Math.PI / 2 - alpha),
    dy : (radius / 2) * Math.sin(Math.PI / 2 - alpha)
    }
}
function getEndCoords(from, to, r) { 
  const step = 1;
  const betta = Math.atan2(to.y - from.y, to.x - from . x);
  let x = from.x;
  let y = from.y;
  const dx = step * Math.cos(betta);
  const dy = step * Math.sin(betta);
  while(1) {
    x += dx;
    y += dy;
    if(Math.sqrt((to.x - x)**2 + (to.y - y)**2) < (r + arrowRadius)) break;
  }
  return {x : x, y : y}
}

function MultiplyElemets(m1,m2) {
  let C = Array.from(m1);
  for (let i = 0; i < m1.length; i++) {
   for (let j=0; j < m2.length; j++) {
    C[i][j] = m1[i][j] * m2[i][j];
     }
   }
   return C
}
function MultiplyMatrix(m1, m2) {
  let result = [];
  for (let i = 0; i < m1.length; i++) {
      result[i] = [];
      for (let j = 0; j < m2[0].length; j++) {
        let sum = 0;
          for (let k = 0; k < m1[0].length; k++) {
              sum += m1[i][k] * m2[k][j];
          }
          result[i][j] = sum;
      }
  }
  return result;
}
function MatrixPow(n,A) { 
    if (n == 1) return A;     // Функцию MultiplyMatrix см. выше
    else return MultiplyMatrix(A, MatrixPow(n-1 ,A) );
}
function TransMatrix(A)       //На входе двумерный массив
{
  let m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++)
     { AT[ i ] = [];
       for (let j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
     }
    return AT;
}
function SumMatrix(A,B)       //На входе двумерные массивы одинаковой размерности
{   
  let m = A.length, n = A[0].length, C = [];
    for (let i = 0; i < m; i++)
     { C[ i ] = [];
       for (let j = 0; j < n; j++) C[ i ][j] = A[ i ][j]+B[ i ][j];
     }
    return C;
}

///// Directed
for(const key in verts) { //drawSoloArrows
  for(let i = 0; i < verts[key].soloDirected.length; i++) {
    ctx.beginPath();
    ctx.moveTo(verts[key].x, verts[key].y);
    ctx.lineTo(verts[verts[key].soloDirected[i]].x, verts[verts[key].soloDirected[i]].y);
    ctx.stroke();
    ctx.beginPath();
    const endCoords = getEndCoords(verts[key], verts[verts[key].soloDirected[i]], radius);
    drawArrowhead(ctx, verts[key], endCoords, arrowRadius, 'white', 'black');
    ctx.closePath();
  }
}
for(const key in verts) { //drawBothArrows
  for(let i = 0; i < verts[key].bothDirected.length; i++) {
    const {dx, dy} = additionalDots(verts[key], verts[verts[key].bothDirected[i]]);
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
    const endCoords = getEndCoords(from, to, radius);
    drawArrowhead(ctx, from, endCoords, arrowRadius, 'white', 'black');
    ctx.closePath();
  }
}

let treeMatrix = [];
for(let i = 0; i < N; i++) {
  treeMatrix[i] = [];
  for(let j = 0; j < N; j++) {
    treeMatrix[i][j] = 0;
  }
}

const treeObj = {};
for(let i = 0; i < dfsFull.length - 1; i++) {
  let curr = dfsFull[i];
  let next = dfsFull[i+1];
  if(treeObj[next] !== curr) {
    treeObj[curr] = next;
    treeMatrix[curr-1][next-1] = 1;
    ctx3.beginPath();
    ctx3.moveTo(verts[`vert${curr}`].x, verts[`vert${curr}`].y);
    ctx3.lineTo(verts[`vert${next}`].x, verts[`vert${next}`].y);
    ctx3.stroke();
    ctx3.beginPath();
    const endCoords = getEndCoords(verts[`vert${curr}`], verts[`vert${next}`], radius);
    drawArrowhead(ctx3, verts[`vert${curr}`], endCoords, arrowRadius, 'white', 'black');
    ctx3.closePath();
  } 
}

console.log("Numeration: ", dfsArray)
console.log("Numeration matrix: ", numMatrix)
console.log("Tree matrix: ", treeMatrix);


let vertNum = 0; 

for(const key in verts) { //draw vertics
  ctx3.beginPath()
  drawCircle(ctx3, verts[key].x, verts[key].y, radius, 'grey', 'black');
  vertNum++;
}
for(let i = 1; i <= N; i++) { //draw text
  ctx3.font = '15px Arial';
  ctx3.fillStyle = 'white';
  ctx3.strokeStyle = 'black';
  ctx3.textBaseline = 'middle';
  ctx3.textAlign = 'center';
  ctx3.strokeText(i, verts[`vert${i}`].x, verts[`vert${i}`].y);
  ctx3.fillText(i, verts[`vert${i}`].x, verts[`vert${i}`].y);
}
vertNum = 0;
///// Not Directed
for(const key in verts) { //drawSoloArrows
  for(let i = 0; i < verts[key].soloDirected.length; i++) {
    ctx2.beginPath();
    ctx2.moveTo(verts[key].x, verts[key].y);
    ctx2.lineTo(verts[verts[key].soloDirected[i]].x, verts[verts[key].soloDirected[i]].y);
    ctx2.stroke();
  }
}

for(const key of selfConnected) { //drawSelfConnected
  const alpha = Math.atan2(verts[key].y - yCenter, verts[key].x - xCenter);
  const R = Math.sqrt((xCenter - verts[key].x)**2 + (yCenter - verts[key].y)**2);

  const x = xCenter + (R + radius * 1.3) * Math.cos(alpha);
  const y = yCenter + (R + radius * 1.3) * Math.sin(alpha);

  ctx.beginPath();
  drawCircle(ctx, x, y, selfRadius, undefined, 'black');
  ctx2.beginPath();
  drawCircle(ctx2, x, y, selfRadius, undefined, 'black');
}

for(const key in verts) { //draw vertics
  ctx.beginPath()
  drawCircle(ctx, verts[key].x, verts[key].y, radius, 'grey', 'black')

  ctx2.beginPath()
  drawCircle(ctx2, verts[key].x, verts[key].y, radius, 'grey', 'black')
}

for(let i = 1; i <= N; i++) { //draw text
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.strokeText(`${i}`, verts[`vert${i}`].x, verts[`vert${i}`].y);
  ctx.fillText(`${i}`, verts[`vert${i}`].x, verts[`vert${i}`].y);

  ctx2.font = '20px Arial';
  ctx2.fillStyle = 'white';
  ctx2.strokeStyle = 'black';
  ctx2.textBaseline = 'middle';
  ctx2.textAlign = 'center';
  ctx2.strokeText(`${i}`, verts[`vert${i}`].x, verts[`vert${i}`].y);
  ctx2.fillText(`${i}`, verts[`vert${i}`].x, verts[`vert${i}`].y);
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