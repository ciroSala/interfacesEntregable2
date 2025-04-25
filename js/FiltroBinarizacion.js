class FiltroBinarizacion extends FiltroBase{
    constructor(ctx, canvas){
        super(ctx, canvas);
    }

    aplicarFiltro(){
        let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                this.setPixel(x,y, data);
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    setPixel(x, y, data){
        const index = (x + y * this.width) * 4;
        const avg = (data[index] + data[index + 1] + data[index + 2]) / 3; // Promedio de los colores
        const threshold = 128; // Umbral para binarización
        // Si el promedio es menor al umbral, se asigna 0
        // Si el promedio es mayor al umbral, se asigna 255
        const color = avg < threshold ? 0 : 255; 
        data[index] = color; // Red
        data[index + 1] = color; // Green
        data[index + 2] = color; // Blue
    }
}