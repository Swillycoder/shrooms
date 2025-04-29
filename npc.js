export function NPCDialogueAgaric1(ctx) {
    const name = "-- Fly --";
    const text1 = "Find my pinecones! Place them on the Altars";
    const text2 = "Hit ENTER to ACCEPT";
    ctx.font = '20px "Freckle Face"';
    let textWidth1 = ctx.measureText(text1).width;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillRect(canvas.width/2 - textWidth1/2 - 20, 100, textWidth1 + 40, 100);
    ctx.strokeRect(canvas.width/2 - textWidth1/2 - 20, 100, textWidth1 + 40, 100);


    ctx.textAlign = 'center'
    ctx.fillStyle = 'red';
    ctx.fillText(name, canvas.width/2, 130)
    ctx.fillStyle = 'black'
    ctx.fillText(text1, canvas.width/2, 160)
    ctx.font = '15px "Freckle Face"';
    ctx.fillText(text2, canvas.width/2, 180)
    // Show dialogue box and prevent movement until user input
}

export function NPCDialogueGreen1(ctx) {
    const name = "-- Green Girl --";
    const text1 = "Hi Tangy! Speak to Fly!";
    const text2 = "Hit ENTER to ACCEPT";
    ctx.font = '20px "Freckle Face"';
    
    let textWidth = ctx.measureText(text1).width;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillRect(canvas.width/2 - textWidth/2 - 20, 100, textWidth + 40, 100);
    ctx.strokeRect(canvas.width/2 - textWidth/2 - 20, 100, textWidth + 40, 100);

    ctx.textAlign = 'center'
    ctx.fillStyle = 'red';
    ctx.fillText(name, canvas.width/2, 130)
    ctx.fillStyle = 'black'
    ctx.fillText(text1, canvas.width/2, 160)
    ctx.font = '15px "Freckle Face"';
    ctx.fillText(text2, canvas.width/2, 180)
    // Show dialogue box and prevent movement until user input
}

export function NPCDialogueEgg1(ctx) {
    const name = "-- Eggsy --";
    const text1 = "Hi Tangy! Speak to Fly!";
    const text2 = "Hit ENTER to ACCEPT";
    ctx.font = '20px "Freckle Face"';
    let textWidth = ctx.measureText(text1).width;

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillRect(canvas.width/2 - textWidth/2 - 20, 100, textWidth + 40, 100);
    ctx.strokeRect(canvas.width/2 - textWidth/2 - 20, 100, textWidth + 40, 100);

    ctx.textAlign = 'center'
    ctx.fillStyle = 'red';
    ctx.fillText(name, canvas.width/2, 130)
    ctx.fillStyle = 'black'
    ctx.fillText(text1, canvas.width/2, 160)
    ctx.font = '15px "Freckle Face"';
    ctx.fillText(text2, canvas.width/2, 180)
    // Show dialogue box and prevent movement until user input
}
