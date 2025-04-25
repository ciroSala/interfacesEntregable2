class FiltroBlur extends FiltroBase{

    constructor(ctx,canvas){
        super(ctx,canvas);
    };

    aplicarFiltro(){
        let imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        let data = imageData.data;
        for (let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let valorTotalR = 0;
                let valorTotalG = 0;
                let valorTotalB = 0;
                let vecinos = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let nx = x + j;
                        let ny = y + i;
                        // Verifico que el pixel no se salga de los limites de la imagen
                        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                            let index = (nx + ny * this.width) * 4;
                            valorTotalR += data[index];
                            valorTotalG += data[index + 1];
                            valorTotalB += data[index + 2];
                            vecinos++;
                        }
                    }
                }
                const promedioR = valorTotalR / vecinos;
                const promedioG = valorTotalG / vecinos;
                const promedioB = valorTotalB / vecinos;
                //Le aplico al pixel actual el promedio de cada color 
                // respecto a los 9 pixeles del alrededor
                this.setPixel(data, x, y, promedioR, promedioG, promedioB);
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    };

    setPixel(data, x, y, r, g, b){
        const index = (x + y * this.width) * 4;
        data[index] = r; // Red
        data[index + 1] = g; // Green
        data[index + 2] = b; // Blue
    };
}