const init = () =>{
    let mouse = {
        click: false,
        move: false,
        pos: {x: 0, y: 0},
        pos_prev: false
    };
    
    const canvas = document.getElementById('main-canvas');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    const socket = io();

    canvas.addEventListener('mousedown', e =>{
        mouse.click = true;
    });

    canvas.addEventListener('mouseup', e =>{
        mouse.click = false;
    });

    canvas.addEventListener('mousemove', e =>{
        mouse.pos.x = e.clientX;
        mouse.pos.y = e.clientY;
        mouse.move = true;
           
    });

    socket.on('draw-line', data =>{
        const line = data.line;
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x, line[0].y);
        context.lineTo(line[1].x, line[1].y)
        context.stroke();
    });

    const mainLoop = () =>{
        if(mouse.click && mouse.move && mouse.pos_prev){
            socket.emit('draw-line', {line: [mouse.pos, mouse.pos_prev]});
            mouse.move = false;
        };
        mouse.pos_prev = {x:mouse.pos.x ,y:mouse.pos.y}
        setTimeout(mainLoop, 25);
    };
    mainLoop();
};

document.addEventListener('DOMContentLoaded', init);
