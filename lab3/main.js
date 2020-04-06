const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');

const canv2 = document.getElementById('canvas2');
const ctx2 = canv2.getContext('2d');

const canv3 = document.getElementById('canvas3');
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
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
]

const matrixCopy = JSON.parse(JSON.stringify(matrix));

const selfConnected = [];

for(let i = 0; i < matrix.length; i++) { //find connection
  for(let j = 0; j < matrix[i].length; j++) {
    if(matrix[i][j]) {
      const names = [`vert${i+1}`, `vert${j+1}`];
      verts[names[1]].in.push(i+1);
      if(matrix[j][i] === 0) verts[names[0]].soloDirected.push(`vert${j+1}`);
      else if(i !== j) verts[names[0]].bothDirected.push(`vert${j+1}`);
      else selfConnected.push(`vert${i+1}`)
      verts[names[0]].cons.push(j + 1)
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
  for (let j = 0; j < m1.length; j++) {
   for (let i=0; i < m2.length; i++) {
    C[i][j] = m1[i][j] * m2[i][j];
     }
   }
   return C
}
function MultiplyMatrix(A,B) {
    let rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (let i = 0; i < rowsA; i++) C[ i ] = [];
    for (let k = 0; k < colsB; k++)
     { for (let i = 0; i < rowsA; i++)
        { let t = 0;
          for (let j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
        }
     }
    return C;
}
function MatrixPow(n,A) { 
    if (n == 1) return A;     // Функцию MultiplyMatrix см. выше
    else return MultiplyMatrix( A, MatrixPow(n-1,A) );
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

let I = [];
for(let i = 0; i < N; i++) {
  I[i] = [];
  for(let j = 0; j < N; j++) {
    I[i][j] = (i===j) ? 1 : 0;
  }
}
const A2 = MatrixPow(2, matrixCopy);
const A3 = MatrixPow(3, matrixCopy);

const mfw = Array.from(matrix);
for(let i = 0; i < mfw.length; i++) {
  mfw[i][i] = 0;
}

const ways2 = [];
const ways3 = [];

for(let i = 0; i < mfw.length; i++) { //finding ways
  for(let j = 0; j < mfw.length; j++) {
    if(mfw[i][j]){
      for(let k = 0; k < mfw[j].length; k++) {
        if(mfw[j][k]) {
          let currWay = `${i+1}-${j+1}-${k+1}`;
          ways2.push(currWay);
          for(let o = 0; o < mfw[k].length; o++) {
            if(mfw[k][o]) {
              currWay = `${i+1}-${j+1}-${k+1}-`;
              currWay += o+1;
              ways3.push(currWay)
            }
          }
        }
      } 
    }
  }
}

const arrForSum = [I];
for(let i = 1; i < N; i++) {
  arrForSum.push(MatrixPow(i, matrixCopy))
}
const matReducer = (acc, curr) => SumMatrix(acc, curr);
const matrDos = arrForSum.reduce(matReducer);
for(let i = 0; i < matrDos.length; i++) { //making dos. matrix
  for(let j = 0; j < matrDos.length; j++) {
    if(matrDos[i][j]) matrDos[i][j] /= matrDos[i][j];
  }
}

const S = MultiplyElemets(matrDos, TransMatrix(matrDos)); //матриця сильной связности 

const V = [];
const used = new Set();

for(let i = 0; i < S.length; i++) { //компоненты сильной связности
  let temp = [];
  if(used.has(i + 1)) continue;
  for(let j = i; j < S.length; j++) {
    if(S[j][i]) {
      used.add(j + 1);
      temp.push(j + 1)
    }
  }
  if(temp.length) V.push(Array.from(temp));
  temp = [];
}

let conRegen = {};

V.forEach((val, ind) => {
  val.forEach((inVal, inInd) => {
    conRegen[inVal] = ind + 1; 
  })
})

const newLength = V.length;

let newMatrix = [];
for(let i = 0; i < newLength; i++) {
  newMatrix[i] = [];
  for(var j=0; j<newLength; j++) {
    newMatrix[i][j] = 0;
  }
}
let kol = 0;
let newVerts = {};
for(let i = 0; i < matrixCopy.length; i++) { //recreate matrix for condensation
  for(let j = 0; j < matrixCopy.length; j++) {
    if(matrixCopy[i][j] === 1) {
      kol++;
      const a = conRegen[i + 1];
      const b = conRegen[j + 1];
      newMatrix[a - 1][b - 1] = 1;
    } 
  }
}

{
  const n = V.length;
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
    vertics[`vert${i}`].name = `${V[i - 1]}`;
    vertics[`vert${i}`].radius = radius * V[i - 1].length * 0.5;
    i++;
  }
  newVerts = vertics;
}

for(const key in newVerts) {  //adding props
  newVerts[key].cons = [],
  newVerts[key].in = [],
  newVerts[key].soloDirected = [],
  newVerts[key].bothDirected = []
}

const newSelfConnected = [];
for(let i = 0; i < newMatrix.length; i++) { //find connection
  for(let j = 0; j < newMatrix[i].length; j++) {
    if(newMatrix[i][j]) {
      const names = [`vert${i+1}`, `vert${j+1}`];
      newVerts[names[1]].in.push(i+1);
      if(!newMatrix[j][i]) newVerts[names[0]].soloDirected.push(`vert${j+1}`);
      else if(i !== j) newVerts[names[0]].bothDirected.push(`vert${j+1}`);
      else {
        newSelfConnected.push(`vert${i+1}`)
      }
      newVerts[names[0]].cons.push(j + 1)
    }
  }
}
console.log('Матриця досяжностi: ', matrDos)
console.log('Матриця сил. зв`язностi: ', S)

term.innerHTML += startText;
term.innerHTML += 'ways -n 2<br>';
for(let i = 0; i < ways2.length;) { 
  let text1 = ways2[i];
  const text2 = ways2[i + 1] || '';
  const marg = 12 - text1.length;
  for(let i = 0; i < marg; i++) {
    text1 += '&nbsp';
  }
  term.innerHTML += `${text1}${text2}<br>`;
  i+=2;
}

term.innerHTML += startText;
term.innerHTML += 'ways -n 3<br>';
for(let i = 0; i < ways3.length;) { 
  let text1 = ways3[i];
  const text2 = ways3[i + 1] || '';
  const marg = 12 - text1.length;
  for(let i = 0; i < marg; i++) {
    text1 += '&nbsp';
  }
  term.innerHTML += `${text1}${text2}<br>`;
  i+=2;
}

term.innerHTML += startText;
term.innerHTML += 'stronglyConnectedComponents<br>';
for(let i = 0; i < V.length; i++) {
  term.innerHTML += `<span id = 'yellow'>Component ${i + 1}: </span>: `; 
  term.innerHTML += `{${V[i]}}<br>`;
}

ctx3.fillStyle = 'white';
let vertNum = 0; 
for(const key in newVerts) { //drawSoloArrows
  for(let i = 0; i < newVerts[key].soloDirected.length; i++) {
    ctx3.beginPath();
    ctx3.moveTo(newVerts[key].x, newVerts[key].y);
    ctx3.lineTo(newVerts[newVerts[key].soloDirected[i]].x, newVerts[newVerts[key].soloDirected[i]].y);
    ctx3.stroke();
    ctx3.beginPath();
    const endCoords = getEndCoords(newVerts[key], newVerts[newVerts[key].soloDirected[i]], newVerts[newVerts[key].soloDirected[i]].radius);
    drawArrowhead(ctx3, newVerts[key], endCoords, arrowRadius, 'white', 'black');
    ctx3.closePath();
    vertNum++;
  }
}
vertNum = 0; 
for(const key in newVerts) { //drawBothArrows
  for(let i = 0; i < newVerts[key].bothDirected.length; i++) {
    const {dx, dy} = additionalDots(newVerts[key], newVerts[newVerts[key].bothDirected[i]]);
    const from = {
      x : newVerts[key].x,
      y : newVerts[key].y
    }
    const to = {
      x : newVerts[newVerts[key].bothDirected[i]].x,
      y : newVerts[newVerts[key].bothDirected[i]].y
    }

    from.x += dx;
    from.y -= dy;
    to.x += dx;
    to.y -= dy;

    ctx3.beginPath();
    ctx3.moveTo(from.x, from.y);
    ctx3.lineTo(to.x, to.y);
    ctx3.stroke();
    ctx3.beginPath();
    const endCoords = getEndCoords(from, to, newVerts[newVerts[key].bothDirected[i]].radius);
    drawArrowhead(ct3x, from, endCoords, arrowRadius, 'white', 'black');
    ctx3.closePath();
  }
}
vertNum = 0; 
for(const key of newSelfConnected) { //drawSelfConnected
  const alpha = Math.atan2(newVerts[key].y - yCenter, newVerts[key].x - xCenter);
  const R = Math.sqrt((xCenter - newVerts[key].x)**2 + (yCenter - newVerts[key].y)**2);

  const x = xCenter + (R + radius * 1.3) * Math.cos(alpha);
  const y = yCenter + (R + radius * 0.5 * 1.3) * Math.sin(alpha);

  ctx3.beginPath();
  drawCircle(ctx3, x, y, selfRadius * V[vertNum] * 0.5, undefined, 'black');
}

for(const key in newVerts) { //draw vertics
  ctx3.beginPath()
  drawCircle(ctx3, newVerts[key].x, newVerts[key].y, radius * V[vertNum].length * 0.5, 'grey', 'black');
  vertNum++;
}
for(let i = 1; i <= newLength; i++) { //draw text
  ctx3.font = '20px Arial';
  ctx3.fillStyle = 'white';
  ctx3.strokeStyle = 'black';
  ctx3.textBaseline = 'middle';
  ctx3.textAlign = 'center';
  ctx3.strokeText(newVerts[`vert${i}`].name, newVerts[`vert${i}`].x, newVerts[`vert${i}`].y);
  ctx3.fillText(newVerts[`vert${i}`].name, newVerts[`vert${i}`].x, newVerts[`vert${i}`].y);
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
