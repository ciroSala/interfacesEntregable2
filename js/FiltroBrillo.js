class FiltroBrillo extends FiltroBase{
    constructor(ctx, canvas) {
        super(ctx, canvas);
    }

    aplicarFiltro() {
        let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                this.setPixel(x,y, data);
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    setPixel(x,y, data){
        let index = (x + y * this.width) * 4;
        data[index] = data[index] + 50; // R
        data[index + 1] = data[index + 1] + 50; // G
        data[index + 2] = data[index + 2] + 50; // B
    }
}