class FiltroSaturacion extends FiltroBase{
    constructor(ctx, canvas){
        super(ctx, canvas);
    }

    aplicarFiltro(factor){
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        for(let x = 0; x<this.width; x++){
            for(let y = 0; y<this.height; y++){
                let index = (x + y * this.width) * 4;
                let r = data[index];
                let g = data[index + 1];
                let b = data[index + 2];

                let hsb = this.RGBtoHSB(r, g, b);
                let nuevoHSB = this.ajustarSaturacion(hsb, factor);
                let nuevoRGB =  this.HSBtoRGB(nuevoHSB.h, nuevoHSB.s, nuevoHSB.b);

                this.setPixel(data, x, y, nuevoRGB.r, nuevoRGB.g, nuevoRGB.b);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    setPixel(data, x, y, r, g, b){
        const index = (x + y * this.width) * 4;
        data[index] = r; // Red
        data[index + 1] = g; // Green
        data[index + 2] = b; // Blue
    };

    RGBtoHSB(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, v = max;

        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h, s: s, b: v };
    }

    ajustarSaturacion(hsb, factor) {
        hsb.s = Math.max(0, Math.min(1, hsb.s * factor)); // Asegurar que la saturación esté entre 0 y 1
        return hsb;
    }

    HSBtoRGB(h, s, b) {
        let r, g, p, q, t, i;
    
        i = Math.floor(h * 6);
        const f = h * 6 - i;
        p = b * (1 - s);
        q = b * (1 - f * s);
        t = b * (1 - (1 - f) * s);
    
        switch (i % 6) {
            case 0: r = b; g = t; b = p; break;
            case 1: r = q; g = b; b = p; break;
            case 2: r = p; g = b; b = t; break;
            case 3: r = p; g = q; b = b; break;
            case 4: r = t; g = p; b = b; break;
            case 5: r = b; g = p; b = q; break;
        }
    
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

}