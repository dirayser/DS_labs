const bord = document.getElementById('border');
const rightDiv = document.getElementById('right');

const bordWidth = windowWidth * kf;
const bordHeight = bordWidth;

bord.style.position = "fixed";
bord.style.width = bordWidth;
bord.style.height = bordHeight;
bord.style.border = "2px solid white";

rightDiv.style.position = "fixed";
rightDiv.style.width = bordWidth;
rightDiv.style.height = bordHeight;
rightDiv.style.border = "2px solid white";

bord.style.marginLeft = windowWidth * 0.05;
bord.style.marginTop = (windowHeight - bordHeight) / 2;

right.style.marginLeft = windowWidth * 0.55;
right.style.marginTop = (windowHeight - bordHeight) / 2;

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
