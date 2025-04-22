
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const buttonGoma = document.getElementById('buttonGoma');
    const buttonLapiz = document.getElementById('buttonLapiz');
    const buttonBorrar = document.getElementById('buttonBorrar');
    const buttonCargarImagen = document.getElementById('buttonCargarImagen');
    const cargarImagenInput = document.getElementById('cargarImagen');
    const buttonFiltroNegativo = document.getElementById('buttonFiltroNegativo');
    const buttonFiltroBrillo = document.getElementById('buttonFiltroBrillo');
    const buttonFiltroBinarizacion = document.getElementById('buttonFiltroBinarizacion');
    const buttonFiltroSepia = document.getElementById('buttonFiltroSepia');
    const paletaRed = document.getElementById('paletaRed');
    const paletaGreen = document.getElementById('paletaGreen');
    const paletaBlue = document.getElementById('paletaBlue');
    const paletaBlack = document.getElementById('paletaBlack');
    let color = 'black';
    buttonLapiz.classList.add('active');

    //Al color activo ponerle un borde 

    //Al boton activo ponerle un borde
    
    // Estado para saber si se está dibujando o borrando
    // por defecto el estado está para dibujar
    let dibujar = true;
    let borrar = false;

    // Estado para saber si se esta dibujando 
    let dibujando = false;


    buttonBorrar.addEventListener('click', () => {
        borrarCanvas();
    });

    // Si seleccionamos el lapiz, acomodamos el contexto para dibujar
    buttonLapiz.addEventListener('click', function() {
        borrar = false;
        dibujar = true;
        buttonLapiz.classList.add('active');
        buttonGoma.classList.remove('active');
    });

    //si seleccionamos la goma, decimos que estamoso en estado de borrar
    buttonGoma.addEventListener('click', function() {
        borrar = true;
        dibujar = false;
        buttonLapiz.classList.remove('active');
        buttonGoma.classList.add('active');
    });

    //Vemos en que estado estamos y acomodamos el contexto segun el estado
    canvas.addEventListener('mousedown', function(e) {
        //console.log(e.clientX, e.clientY);
        ctx.beginPath();
        if(borrar) {
            // Para borrar, usamos el modo de composición 'destination-out'
            // que elimina el contenido del canvas en la zona dibujada 
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        } else if (dibujar) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color; // Color del lápiz
            ctx.lineWidth = 50;
        }
        dibujando = true;
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (dibujando) {
            console.log(e.clientX, e.clientY);
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function() {
        ctx.closePath();
        dibujando = false;
    });

    buttonCargarImagen.addEventListener('click', () => {
        cargarImagenInput.click(); // Simula un clic en el input de tipo file oculto
    });
    
    cargarImagenInput.addEventListener('change', (event) => {
        console.log(1);
        // Si estamos en modo borrar, no se puede cargar una imagen hay que cambiar 
        // el modo de composicion a 'source-over' para que la imagen se dibuje
        // y no se borre. Luego si queremos seguir borrando, el estado de borrar se mantiene
        // con lo cual se cambia el modo de composicion a 'destination-out' automaticamente
        if(borrar) {
            ctx.globalCompositeOperation = 'source-over';
        }
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0,canvas.width, canvas.height); // Dibuja la imagen en el canvas
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        //Vacia el valor del input de carga de imagen para que si deseamos cargar la misma imagen, 
        // se llame el evento change y se cargue la imagen nuevamente
        cargarImagenInput.value = '';
    });

    //El filtro negativo pone los valores opuestos a los que ya tiene la imagen
    //por lo que se le resta 255 a cada valor de color (rojo, verde y azul)
    buttonFiltroNegativo.addEventListener('click', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let x = 0; x < canvas.width; x++) {
            for(let y = 0; y < canvas.height; y++) {
                const index = (x + y * canvas.width) * 4;
                data[index] = 255 - data[index]; // Red
                data[index + 1] = 255 - data[index + 1]; // Green
                data[index + 2] = 255 - data[index + 2]; // Blue
            }
        }
        ctx.putImageData(imageData, 0, 0);
    });

    //El filtro de brillo suma 50 a cada valor de color (rojo, verde y azul)
    //por lo que si el valor es mayor a 255, se le asigna 255
    buttonFiltroBrillo.addEventListener('click', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let x = 0; x < canvas.width; x++) {
            for(let y = 0; y < canvas.height; y++) {
                const index = (x + y * canvas.width) * 4;
                data[index] = data[index] + 50; // Red
                data[index + 1] = data[index + 1] + 50; // Green
                data[index + 2] = data[index + 2] + 50; // Blue
            }
        }
        ctx.putImageData(imageData, 0, 0);
    });

    //El filtro de binarizacion convierte los valores de color (rojo, verde y azul)
    buttonFiltroBinarizacion.addEventListener('click', () => { 
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for(let x = 0; x < canvas.width; x++) {
            for(let y = 0; y < canvas.height; y++) {
                const index = (x + y * canvas.width) * 4;
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
        ctx.putImageData(imageData, 0, 0);
    });

    //El filtro sepia convierte los valores de color (rojo, verde y azul) 
    //a un color sepia, por lo que se le suma 50 al rojo y verde 
    buttonFiltroSepia.addEventListener('click', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for(let x = 0; x < canvas.width; x++) {
            for(let y = 0; y < canvas.height; y++) {
                const index = (x + y * canvas.width) * 4;
                const avg = (data[index] + data[index + 1] + data[index + 2]) / 3; // Promedio de los colores
                data[index] = avg + 50; // Red
                data[index + 1] = avg + 50; // Green
                data[index + 2] = avg; // Blue
            }
        }
        ctx.putImageData(imageData, 0, 0);
    })

    function borrarCanvas() {
        // Limpiar el canvas 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    paletaRed.addEventListener('click', function() {
        color = 'red';
    });
    paletaGreen.addEventListener('click', function() {
        color = 'green';
    });
    paletaBlue.addEventListener('click', function() {
        color = 'blue';
    });
    paletaBlack.addEventListener('click', function() {
        color = 'black';
    });

    //  Se podria hacer una clase padre filtro, donde cada filtro herede de esta, 
    // para instanciar cada filtro se le pasa el contexto y la imagen, y  
    // cada filtro tiene su metodo aplicarFiltro, que recibe la imagen y el contexto
    // y lo aplica al contexto

    //para guardar la imagen en el canvas como un archivo .png
    //podemos agarrar el contenido del canvas y convertirlo a un archivo .png
    //y luego descargarlo
    // const buttonDescargar = document.getElementById('buttonDescargar');
    // buttonDescargar.addEventListener('click', () => {
    //     const link = document.createElement('a');
    //     link.download = 'mi_dibujo.png';
    //     link.href = canvas.toDataURL('image/png');
    //     link.click();
    // });