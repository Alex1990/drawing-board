function drawBrushLine(ctx, {
  previousPoint,
  from,
  to,
  size,
}) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = size;
  ctx.moveTo(previousPoint.x, previousPoint.y);
  ctx.quadraticCurveTo(from.x, from.y, to.x, to.y);
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
  ctx.moveTo(previousPoint.x, previousPoint.y);
  ctx.quadraticCurveTo(from.x, from.y, to.x, to.y);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function execCommand(ctx, command) {
  switch (command.type) {
    case 'brush': drawBrushLine(ctx, command); break;
    case 'eraser': drawEraserLine(ctx, command); break;
  }
}

export default execCommand;
