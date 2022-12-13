const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 2048, 2048 ],
  // animate: true
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke, blend;
  const num = 90;
  const degrees = -30;
  const rects = [];
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors)
  ];

  const bgColor = random.pick(risoColors).hex;

  for (let i = 0; i < num; i++) {
    // 기본크기를 정한다.
    x = random.range(0, width); 
    y = random.range(0, height); 
    w = random.range(200, 600); 
    h = random.range(40, 200); 
    // fill = `rgba(${random.range(0, 255)}, 0, ${random.range(0, 255)}, ${random.range(0.1, 1)})`;
    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    blend = (random.value() > 0.5) ? 'overlay' : 'source-over';

    rects.push({x, y, w, h, fill, stroke})
  }

  return ({ context, width, height }) => {
    
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach(rect => {
      const {x, y, w, h, fill, stroke, blend} = rect;
      let shadowColor;

      context.save(); 
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
canvasSketch(sketch, settings);
