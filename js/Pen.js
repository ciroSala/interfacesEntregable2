class Pen{
    //  Constructor para crear un objeto de tipo Pen, segun las propiedas
    // que se le pasen como argumento. 
    constructor(context, color, lineWidth){
        this.ctx = context;
        this.color = color;
        this.lineWidth = lineWidth;
        this.lineCap = 'butt';
    }

    //  Modifica el contexto para que la línea comience a dibujarse
    // desde el punto (x, y) y acomoda el compositeOperation a 'source-over' para
    // que la línea se dibuje sobre el fondo.
    startDrawing(x, y){
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    draw(x, y){
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = this.lineCap;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    stopDrawing(){
        this.ctx.closePath();
    }

    setColor(color){
        this.color = color;
    }
}