   /**
    * @type {HTMLCanvasElement}
   */
   const canvas = document.getElementById("canvas");
   
   /**
    * @type {CanvasRenderingContext2D}
   */
    const ctx = canvas.getContext("2d");

    // Agarramos todos los elementos del DOM que se van a usar
    const buttonGoma = document.getElementById('buttonGoma');
    const buttonLapiz = document.getElementById('buttonLapiz');
    const buttonBorrar = document.getElementById('buttonBorrar');
    const inputColorPicker = document.getElementById('inputColorPicker');
    const buttonCargarImagen = document.getElementById('buttonCargarImagen');
    const buttonDescargarImagen = document.getElementById('buttonDescargarImagen');
    const cargarImagenInput = document.getElementById('cargarImagen');
    const buttonFiltroNegativo = document.getElementById('buttonFiltroNegativo');
    const buttonFiltroBrillo = document.getElementById('buttonFiltroBrillo');
    const buttonFiltroBinarizacion = document.getElementById('buttonFiltroBinarizacion');
    const buttonFiltroSepia = document.getElementById('buttonFiltroSepia');
    const buttonFiltroBlur = document.getElementById('buttonFiltroBlur');
    const buttonFiltroAumentarSaturacion = document.getElementById('buttonAumentarSaturacion');
    const buttonFiltroDisminuirSaturacion = document.getElementById('buttonDisminuirSaturacion');

    // Creamos los objetos de los filtros
    let filtroNegativo = new FiltroNegativo(ctx, canvas);
    let filtroBrillo = new FiltroBrillo(ctx, canvas);
    let filtroBinarizacion = new FiltroBinarizacion(ctx, canvas);
    let filtroSepia = new FiltroSepia(ctx, canvas);
    let filtroBlur = new FiltroBlur(ctx, canvas);
    let filtroSaturacion = new FiltroSaturacion(ctx, canvas);
    
    //Por defecto se pone el lapiz como activo con el color negro
    let color = 'black';
    buttonLapiz.classList.add('active');
    
    //  Estado para saber si se está dibujando o borrando, 
    // por defecto el estado está para dibujar.
    let dibujar = true;
    let borrar = false;

    // Estado para saber si se esta presionando el mouse
    let mouseDown = false;

    pen = new Pen(ctx, 'black', 40); // Crea un lapiz
    eraser = new Eraser(ctx, 25); // Crea una goma

    // Si seleccionamos el lapiz, acomodamos el contexto para dibujar
    buttonLapiz.addEventListener('click', function() {
        borrar = false;
        dibujar = true;
        buttonLapiz.classList.add('active');
        buttonGoma.classList.remove('active');
    });

    // Si seleccionamos la goma, decimos que estamoso en estado de borrar
    buttonGoma.addEventListener('click', function() {
        borrar = true;
        dibujar = false;
        buttonLapiz.classList.remove('active');
        buttonGoma.classList.add('active');
    });

    // Si presionamos el boton de borrar, se limpia el canvas
    buttonBorrar.addEventListener('click', () => {
        borrarCanvas();
    });

    inputColorPicker.addEventListener('input', function() {
        // Cambia el color del lápiz al color seleccionado en el input
        pen.setColor(inputColorPicker.value); 
    })

    //  Escuchamos el evento mousedown para realizar la acción correspondiente
    // segun el modo activo, y decir que estamos presionando el mouse.
    canvas.addEventListener('mousedown', function(e) {
        if(borrar) {
            //  Si estamos en modo borrar, decimos que la goma comience a borrar
            // y arranca el borrado desde el punto (x, y) donde se presiona el mouse y borra
            eraser.startErasing(e.offsetX, e.offsetY);
            eraser.delete(e.offsetX, e.offsetY);
        } else if (dibujar) {
            //  Si estamos en modo dibujar, decimos que el lapiz comienze a dibujar 
            // asi arranca la linea desde el punto (x, y) donde se presiona el mouse y dibuja
            pen.startDrawing(e.offsetX, e.offsetY); 
            pen.draw(e.offsetX, e.offsetY); 
        }
        // Decimos que estamos presionando el mouse
        mouseDown = true;
    });

    //  Mientras movemos el mouse en el canvas, verificar si esta el mouse
    // presionado y si esta presionado verificar en que modo estamos,
    // para dibujar con el objeto corrrespondiente .
    canvas.addEventListener('mousemove', function(e) {
        if (mouseDown) {
            //Verificamos el modo en el que estamos, si es borrar o dibujar
            if(dibujar) {
                pen.draw(e.offsetX, e.offsetY); // Dibuja la línea
            }
            if(borrar) {
                eraser.delete(e.offsetX, e.offsetY); // Borra la línea
            }
        }
    });

    //  Si levantamos el mouse, decimos que no estamos presionando el mouse
    // y verificamos en que modo estamos, para dejar de dibujar con el objeto correspondiente.
    canvas.addEventListener('mouseup', function() {
        if(dibujar) {
            pen.stopDrawing(); // Detiene el dibujo
        }
        if(borrar){
            eraser.stopErasing(); // Detiene el borrado
        }
        mouseDown = false;
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

    function borrarCanvas() {
        // Limpiar el canvas 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    //El filtro negativo pone los valores opuestos a los que ya tiene la imagen
    //por lo que se le resta 255 a cada valor de color (rojo, verde y azul)
    buttonFiltroNegativo.addEventListener('click', () => {
        filtroNegativo.aplicarFiltro(ctx, canvas);
    });

    //El filtro de brillo suma 50 a cada valor de color (rojo, verde y azul)
    //por lo que si el valor es mayor a 255, se le asigna 255
    buttonFiltroBrillo.addEventListener('click', () => {
        filtroBrillo.aplicarFiltro();
    });

    //El filtro de binarizacion convierte los valores de color (rojo, verde y azul)
    buttonFiltroBinarizacion.addEventListener('click', () => { 
        filtroBinarizacion.aplicarFiltro();
    });

    //El filtro sepia convierte los valores de color (rojo, verde y azul) 
    //a un color sepia, por lo que se le suma 50 al rojo y verde 
    buttonFiltroSepia.addEventListener('click', () => {
        filtroSepia.aplicarFiltro();
    })

    buttonFiltroBlur.addEventListener('click', () => {
        filtroBlur.aplicarFiltro();
    });

    buttonFiltroAumentarSaturacion.addEventListener('click', () => {
        filtroSaturacion.aplicarFiltro(2); // Aumentar saturación
    });

    buttonFiltroDisminuirSaturacion.addEventListener('click', () => {
        filtroSaturacion.aplicarFiltro(0.5); // Disminuir saturación
    });

    //  Para guardar la imagen del canvas como un archivo .png
    // podemos agarrar el contenido del canvas y convertirlo a un archivo .png
    // y luego descargarlo
    buttonDescargarImagen.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'mi_dibujo.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });