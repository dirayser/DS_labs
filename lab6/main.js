
const term = document.getElementById('term');

let startText = 'Graph-plotter:~ circle$ ';
term.innerHTML = startText;
term.innerHTML +=  'directed --info <br>';

const radius = 25;
const selfRadius = radius / 2;

const arrowRadius = 5;

let verts = {};

const xCenter = bordWidth / 2;
const yCenter = bordHeight / 2;

const START_VERT = 1;

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
  [0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
  [0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
]

const weightsMatrix = [
  [0,  0,  67, 35, 0,  0,  60, 0,  8,  88, 0],
  [0,  0,  0,  6,  0,  0,  92, 0,  0,  13, 50],
  [67, 0,  0,  88, 6,  0,  72, 82, 55, 49, 25],
  [35, 6,  88, 0,  0,  89, 88, 24, 0,  7,  83],
  [0,  0,  6,  0,  0,  11, 0,  21, 86, 2,  0],
  [0,  0,  0,  89, 11, 0,  33, 83, 19, 53, 0],
  [60, 92, 72, 88, 0,  33, 0,  86, 0,  94, 60],
  [0,  0,  82, 24, 21, 83, 86, 0,  48, 17, 0],
  [8,  0,  55, 0,  86, 19, 0,  48, 0,  0,  76],
  [88, 13, 49, 7,  2,  53, 94, 17, 0,  0,  72],
  [0,  50, 25, 83, 0,  0,  60, 0,  76, 72, 0]
]

const fullCopy = x => JSON.parse(JSON.stringify(x));

const matrixCopy = JSON.parse(JSON.stringify(matrix));

const selfConnected = [];
const outerVerts = [];
const weightsArr = [];

for(let i = 0; i < weightsMatrix.length; i++) { //add weights
  for(let j = i; j < weightsMatrix[i].length; j++) {
    if(weightsMatrix[i][j]) {
      weightsArr.push({
        weight: weightsMatrix[i][j],
        name: [i + 1, j + 1]
      });
    }
  }
}

for(let i = 0; i < matrixCopy.length; i++) { //find connection
  for(let j = 0; j < matrixCopy[i].length; j++) {
    if(matrixCopy[i][j]) {
      const names = [`vert${i+1}`, `vert${j+1}`];
      verts[names[1]].in.push(i+1);
      if(matrixCopy[j][i] === 0) verts[names[0]].soloDirected.push(`vert${j+1}`);
      else if(i !== j) verts[names[0]].bothDirected.push(`vert${j+1}`);
      else selfConnected.push(`vert${i+1}`);
      verts[names[0]].cons.push(j + 1);
      if(!outerVerts.includes(i + 1) && (i !== j)) outerVerts.push(i + 1);
    }
  }
}

const DijkObj = {}
const inf = Math.pow(10, 200);

for(let i = 1; i <= N; i++) {
  DijkObj[i] = {
    dist: i === START_VERT ? 0 : inf,
    mark: i === START_VERT ? 'P' : 'T',
    prev: undefined
  }
}

const GetAdjacentLenghts = (obj, curr) => {
  weightsMatrix[curr - 1].forEach((weight, v) => {
    if(obj[v + 1].mark === 'T' && weight && weight + obj[curr].dist < obj[v + 1].dist)  {
      obj[v + 1].dist = weight + obj[curr].dist;
      obj[v + 1].prev = curr;
    } 
  })
}

const GetMinLength = obj => {
  const weights = [];
  for(let v in obj) {
    if(obj[v].mark === 'T') {
      const distObj = {};
      distObj.v = +v;
      distObj.dist = obj[v].dist;
      weights.push(distObj)
    }
  }
  const min = weights.reduce((a, b) => a.dist < b.dist ? a : b);
  return min;
}

const IsDijkstraDone = obj => {
  let done = true;
  for(let v in obj) {
    if(obj[v].mark === 'T') done = false;
  }
  return done;
} 

const lengthsArray = [];
const doneArray = [START_VERT];
let usingBorders = [];

const Dijkstra = (obj, current = START_VERT) => {
  for(let i = 0; i < N; i++) { //GetAdjacentLenghts(obj, current);
    const weight = weightsMatrix[current - 1][i];
    const v = i + 1;
    if(weight) {
      if(obj[v].mark === 'T')  {
        if(weight + obj[current].dist < obj[v].dist) {
          if(obj[v].prev) {
           // console.log([current, v])
            usingBorders = usingBorders.filter(x => JSON.stringify(x) !== JSON.stringify([obj[v].prev, v]))
          }
          obj[v].dist = weight + obj[current].dist;
          obj[v].prev = current;
          usingBorders.push([current, v])
        }
        lengthsArray.push([current, v, fullCopy(doneArray), fullCopy(usingBorders), fullCopy(obj)])
      } 
    }
  }
  const min = GetMinLength(obj);
  obj[min.v].mark = 'P';
  doneArray.push(min.v)

  if(!IsDijkstraDone(obj)) Dijkstra(obj, min.v)
}

Dijkstra(DijkObj);

let curr = START_VERT;

/*const newWay = [];
  for(let i = min.v; i; i = obj[i].prev){
    newWay.unshift(i)
  }
  term.innerHTML += `${min.v} : ${newWay.join('->')} <span id = 'yellow'>weight: ${obj[min.v].dist}</span><br>`
*/

const iterDijk = lengthsArray[Symbol.iterator]()

const halt = () => {
  const {value, done} = iterDijk.next();
  if(!done) {
    ctx2.clearRect(0, 0, ctx2.width, ctx2.height);
    const current = value[0],
    to = value[1],
    doneArray = value[2],
    usingArray = value[3],
    obj = value[4];
    ctx2.beginPath();
    console.log(current, to)
    const keyCurr = 'vert' + current;
    const keyTo = 'vert' + to;
    ctx2.strokeStyle = '#273746';
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
        let to = verts[verts[key].bothDirected[i]];
        ctx2.beginPath();
        ctx2.moveTo(from.x, from.y);
        ctx2.lineTo(to.x, to.y);
        ctx2.stroke();
      }
    }
    ctx2.strokeStyle = 'black';
    for(let i = 0; i < N; i++) { // draw weights
      for(let j = i; j < N; j++) {
        if(weightsMatrix[i][j]) {
          ctx2.beginPath()
          const wgh = weightsMatrix[i][j];
          const from = verts[`vert${i+1}`];
          const to = verts[`vert${j+1}`];
          ctx2.font = '15px Arial';
          ctx2.fillStyle = 'white';
          ctx2.strokeStyle = 'black';
          ctx2.textBaseline = 'middle';
          ctx2.textAlign = 'center';
          ctx2.fillText(wgh, (from.x + to.x)/2, (from.y + to.y)/2);
        }
      }
    }
    for(const key of selfConnected) { //drawSelfConnected
      const alpha = Math.atan2(verts[key].y - yCenter, verts[key].x - xCenter);
      const R = Math.sqrt((xCenter - verts[key].x)**2 + (yCenter - verts[key].y)**2);
    
      const x = xCenter + (R + radius * 1.3) * Math.cos(alpha);
      const y = yCenter + (R + radius * 1.3) * Math.sin(alpha);
      ctx2.beginPath();
      drawCircle(ctx2, x, y, selfRadius, undefined, 'black');
    }
    ctx2.lineWidth = 2;
    usingArray.forEach((arr) => { //ребра которые используются в мин. путях
      ctx2.beginPath();
      const fromV = arr[0],
      toV = arr[1];
      ctx2.strokeStyle = '#48C9B0';
      ctx2.moveTo(verts['vert' + fromV].x, verts['vert' + fromV].y);
      ctx2.lineTo(verts['vert' + toV].x, verts['vert' + toV].y);
      ctx2.stroke();
    })
    ctx2.lineWidth = 1;
    { //данная вершина
      ctx2.beginPath();
      ctx2.strokeStyle = 'yellow';
      ctx2.lineWidth = 3;
      ctx2.moveTo(verts[keyCurr].x, verts[keyCurr].y);
      ctx2.lineTo(verts[keyTo].x, verts[keyTo].y);
      ctx2.stroke();
      ctx2.strokeStyle = 'black';
      ctx2.lineWidth = 1;
    }
    for(let i = 1; i <= N; i++) { //draw vertics
      ctx2.beginPath();
      let color = doneArray.includes(i) ? '#3498DB' : '#E74C3C';
      if(current === i) color = '#48C9B0'
      drawCircle(ctx2, verts[`vert${i}`].x, verts[`vert${i}`].y, radius, color, 'black')
    }
    for(const v in obj) { 
      //draw vertics
      ctx2.beginPath()
      //draw text
      ctx2.lineWidth = 1;
      ctx2.font = '20px Arial';
      ctx2.fillStyle = 'white';
      ctx2.strokeStyle = 'black';
      ctx2.textBaseline = 'middle';
      ctx2.textAlign = 'center';
      ctx2.strokeText(`${v}(${obj[v].dist === inf ? '∞' : obj[v].dist})`, verts[`vert${v}`].x, verts[`vert${v}`].y);
      ctx2.fillText(`${v}(${obj[v].dist === inf ? '∞' : obj[v].dist})`, verts[`vert${v}`].x, verts[`vert${v}`].y);
    }
  }
}

weightsArr.sort((a, b) => a.weight - b.weight);

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

term.innerHTML += startText + 'ways --info <br>';

const COMP = [];
let components = [];
const compForPlotting = [];

const returnConcat = (arr1, arr2) =>{
  const copied1 = fullCopy(arr1);
  const copied2 = fullCopy(arr2);
  return copied1.concat(copied2);
}

const Kruskal = (weights, comp, curr = 0) => {
  const v1 = weights[curr].name[0];
  const v2 = weights[curr].name[1];
  const compCopy = fullCopy(comp);
  let flag = true;
  for(let i = 0; i < compCopy.length; i++){ // if both in components
    if(compCopy[i].includes(v1)){
      for(let j = 0; j < compCopy.length; j++){
        if(compCopy[j].includes(v2)) {
          flag = false;
          if(i === j) continue;
          compForPlotting[i] = [...compForPlotting[i], ...compForPlotting[j], [v1, v2]]
          compCopy[i] = returnConcat(compCopy[i], compCopy[j]);
          compForPlotting.splice(j, 1);
          compCopy.splice(j, 1);
          COMP.push(fullCopy(compForPlotting));
        }
      }
    }
  }
  if(flag) { // if 1 in components
    for(let i = 0; i < compCopy.length; i++){
      if(compCopy[i].includes(v1)){
        compCopy[i].push(v2);
        compForPlotting[i] = [...compForPlotting[i], [v1, v2]];
        flag = false;
        COMP.push(fullCopy(compForPlotting));
        break;
      }
      else if(compCopy[i].includes(v2)){
        compCopy[i].push(v1);
        compForPlotting[i] = [...compForPlotting[i], [v1, v2]];
        flag = false;
        COMP.push(fullCopy(compForPlotting));
        break;
      }
    }
  }
  if(flag) { //if new
    compCopy.push([v1, v2]); 
    compForPlotting.push([[v1, v2]]);
    COMP.push(fullCopy(compForPlotting));
  }
  components = fullCopy(compCopy);
  if(curr === weights.length - 1) return;
  Kruskal(weights, compCopy, curr + 1); 
}

Kruskal(weightsArr, []);

const iter = COMP[Symbol.iterator]();
let prev = 0;
const visited = new Set();

const colors = ['DeepPink', 'Cyan', 'MediumSpringGreen']

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

const AB = SumMatrix(fullCopy(matrix), TransMatrix(fullCopy(matrix)));
AB.forEach((i, in1) => {
  i.forEach((j, in2) => {
    if(j) AB[in1][in2]= 1;
  })
})

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

let vertNum = 0; 

////TREE
const treeMatrix = [];
for(let i = 0; i < N; i++) {
  treeMatrix[i] = [];
  for(let j = 0; j < N; j++) {
    treeMatrix[i][j] = 0;
  }
}
COMP[COMP.length - 1][0].forEach(pair => {
  treeMatrix[pair[0] - 1][pair[1] - 1] = 1;
  treeMatrix[pair[1] - 1][pair[0] - 1] = 1;
  let from = verts[`vert${pair[0]}`];
  let to = verts[`vert${pair[1]}`];
  const wgh = weightsMatrix[pair[0] - 1][pair[1] - 1];
  ctx3.beginPath();
  ctx3.moveTo(from.x, from.y);
  ctx3.lineTo(to.x, to.y);
  ctx3.stroke();
  ctx3.font = '15px Arial';
  ctx3.fillStyle = 'white';
  ctx3.strokeStyle = 'black';
  ctx3.textBaseline = 'middle';
  ctx3.textAlign = 'center';
  ctx3.fillText(wgh, (from.x + to.x)/2, (from.y + to.y)/2);
})

for(const key in verts) { //draw vertics
  ctx3.beginPath()
  drawCircle(ctx3, verts[key].x, verts[key].y, radius, 'grey', 'black');
  vertNum++;
}
for(let i = 1; i <= N; i++) { //draw text
  ctx3.font = '20px Arial';
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

for(const key in verts) { //drawBothArrows
  for(let i = 0; i < verts[key].bothDirected.length; i++) {
    let from = verts[key];
    let to = verts[verts[key].bothDirected[i]];
    ctx2.beginPath();
    ctx2.moveTo(from.x, from.y);
    ctx2.lineTo(to.x, to.y);
    ctx2.stroke();
  }
}
for(let i = 0; i < N; i++) { // draw weights
  for(let j = i; j < N; j++) {
    if(weightsMatrix[i][j]) {
      const wgh = weightsMatrix[i][j];
      const from = verts[`vert${i+1}`];
      const to = verts[`vert${j+1}`];
      ctx2.font = '15px Arial';
      ctx2.fillStyle = 'white';
      ctx2.strokeStyle = 'black';
      ctx2.textBaseline = 'middle';
      ctx2.textAlign = 'center';
      ctx2.fillText(wgh, (from.x + to.x)/2, (from.y + to.y)/2);
    }
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