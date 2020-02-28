const bord = document.getElementById('border');
const rightDiv = document.getElementById('right');
const rightUp = document.getElementById('rightUp');
const under = document.getElementById('under');

const bordWidth = windowWidth * kf;
const bordHeight = bordWidth;

bord.style.position = "fixed";
bord.style.width = bordWidth;
bord.style.height = bordHeight;
bord.style.border = "2px solid black";

under.style.position = "fixed";
under.style.width = bordWidth;
under.style.height = (windowHeight - bordHeight) / 4;

rightDiv.style.position = "fixed";
rightDiv.style.width = bordWidth;
rightDiv.style.height = bordHeight - 20;
rightDiv.style.backgroundColor = 'black';
rightDiv.style.border = '2px solid black';
rightDiv.style.borderRadius = '0 0 8px 8px';

rightUp.style.position = "fixed";
rightUp.style.width = bordWidth + 4;
rightUp.style.height = 20;

bord.style.marginLeft = windowWidth * 0.05;
bord.style.marginTop = (windowHeight - bordHeight) / 2;

under.style.marginLeft = windowWidth * 0.05;
under.style.marginTop = (windowHeight - bordHeight) / 1.5 + bordHeight;

rightDiv.style.marginLeft = windowWidth * 0.55;
rightDiv.style.marginTop = (windowHeight - bordHeight) / 2 + 20;

rightUp.style.marginLeft = windowWidth * 0.55;
rightUp.style.marginTop = (windowHeight - bordHeight) / 2;

const but = document.getElementById('but');

function onClick() {
  if(canv.style.display === 'block') {
    canv.style.display = 'none';
    canv2.style.display = 'block';
  }
  else {
    canv.style.display = 'block';
    canv2.style.display = 'none';
  }
}
