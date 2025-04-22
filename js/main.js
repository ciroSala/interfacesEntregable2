
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const buttonGoma = document.getElementById('buttonGoma');
    const buttonLapiz = document.getElementById('buttonLapiz');
    const buttonBorrar = document.getElementById('buttonBorrar');
    const buttonCargarImagen = document.getElementById('buttonCargarImagen');
    const cargarImagenInput = document.getElementById('cargarImagen');
    
    // estado para saber si se está dibujando o no
    let dibujando = false;

    buttonBorrar.addEventListener('click', () => {
        borrarCanvas();
    });

    //si seleccionamos el lapiz, acomodamos el contexto para dibujar
    buttonLapiz.addEventListener('click', function() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 5;
        ctx.lineCap = 'butt';
    });

    //si seleccionamos la goma, acomodamos el contexto para borrar
    buttonGoma.addEventListener('click', function() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
    });

    canvas.addEventListener('mousedown', function(e) {
        //console.log(e.clientX, e.clientY);
        ctx.fillStyle = 'black';
        ctx.lineWidth = 50;
        dibujando = true;
        ctx.beginPath();
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
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function borrarCanvas() {
        // Limpiar el canvas y el input de carga de imagen
        // para que si deseamos cargar la misma imagen, se llame el evento change
        // y se cargue la imagen nuevamente
        cargarImagenInput.value = '';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
