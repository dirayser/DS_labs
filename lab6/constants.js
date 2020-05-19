const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

const kf = 0.4;

const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');

const canv2 = document.getElementById('canvas2');
const ctx2 = canv2.getContext('2d');

const canv3 = document.getElementById('canvas3'); //condensation
const ctx3 = canv3.getContext('2d');

canv.style.display = 'none';
canv2.style.display = 'block';
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