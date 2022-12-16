const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');
// const seed = '924182';
const seed = random.getRandomSeed();
const imgElem = new Image();
imgElem.src = './100201absdl.jpg';
const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  name:seed
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);
  console.log(random.value())

  let x, y, w, h, fill, stroke, blend;
  const num = 60;
  const degrees = -30;
  const rects = [];
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors)
  ];
  const bgColor = random.pick(risoColors).hex;
  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.6
  }

  for (let i = 0; i < num; i++) {
    // 기본크기를 정한다.
    x = random.range(0, width); 
    y = random.range(0, height); 
    w = random.range(300, 500); 
    h = random.range(40, 200); 
    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    blend = (random.value() > 0.5) ? 'overlay' : 'source-over';
    rects.push({x, y, w, h, fill, stroke});
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);
    
    drawPolygon({ context, radius: mask.radius, sides: mask.sides });
    
    context.clip(); 
    context.drawImage(imgElem, -mask.x, -mask.y + 450, 2000, 1200)

    rects.forEach(rect => {
      const {x, y, w, h, fill, stroke, blend} = rect;
      let shadowColor;

      context.save(); 
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;
      context.globalCompositeOperation = blend;

      drawSkewedRect({context, w, h, degrees});
      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;
      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.stroke();
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();
      context.fill();
      context.shadowColor = null;
      context.restore();
    });
    context.restore();


    // polygon outline
    context.save();
    context.translate(mask.x, mask.y);
    drawPolygon({ context, radius: mask.radius - context.lineWidth, sides: mask.sides })
    context.globalCompositeOperation = 'color-burn'
    context.lineWidth = 30;
    context.strokeStyle = rectColors[0].hex;
    context.stroke();
    context.restore();
  };
};

function drawSkewedRect({context, w = 600, h = 200, degrees = -45}) {
  const angle = math.degToRad(degrees); 
  // 수평을 기준으로 원하는 지점을 얻기 위해 각도를 설정하면 시작점에서
  // 얼만큼 내려가면 되는지 알려줌.
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;
  
  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.stroke();
  context.restore();
}
const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
  const slice = Math.PI * 2 / sides;
  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius)
  }
  context.closePath();
};
canvasSketch(sketch, settings);
