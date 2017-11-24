function drawBrushLine(ctx, {
  previousPoint,
  from,
  to,
  size,
  color,
}) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = size;
  ctx.strokeStyle = color;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
}

function drawEraserLine(ctx, {
  previousPoint,
  from,
  to,
  size,
}) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = size;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function clear(ctx) {
  const canvas = ctx.canvas;
  if (canvas) {
    canvas.width = canvas.width;
  }
}

function execCommand(ctx, command) {
  switch (command.type) {
    case 'brush': drawBrushLine(ctx, command); break;
    case 'eraser': drawEraserLine(ctx, command); break;
    case 'clear': clear(ctx, command); break;
  }
}

export default execCommand;
