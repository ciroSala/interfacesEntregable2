class Eraser{
    constructor(context, lineWidth){
        this.ctx = context;
        this.lineWidth = lineWidth;
        this.lineCap = 'round'; // Se establece el tipo de línea como redondeada
    }

    startErasing(x,y){
        this.ctx.globalCompositeOperation = 'destination-out'; // Se establece el modo de composición para borrar
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    delete(x, y){
        this.ctx.lineWidth = this.lineWidth; // Se establece el ancho de la línea
        this.ctx.lineTo(x, y); // Se dibuja la línea hasta la posición (x, y)
        this.ctx.stroke(); // Se aplica el trazo
    }

    stopErasing(){
        this.ctx.closePath(); // Se cierra el camino actual
    }
}