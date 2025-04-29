export function introScreen(ctx, image) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(82, 110, 150)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image,6,6)
}
