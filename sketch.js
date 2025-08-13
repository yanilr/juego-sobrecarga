let corazonFondo;
let iniciobateriaImg;
let audioMarchaDocente;
let audioAgotamiento;
let videoMarchaDocente;
let videoAgotamiento;
let cajabuenaImg, cajamalaImg, marchandoImg, papelesImg;
// Variables globales
let fondoX = 0;
let fondoImg;
let bateriaImg;
let bateriaColor;
let carga = 100; // 0 a 200
let obstaculos = [];
let sonidoCarga, sonidoDescarga, sonidoExplosion, sonidoSuspiro;

let personajeX = 30;
let personajeY = 220; // altura inicial ajustada para personaje
let personajeW = 210; // ancho 
let personajeH = 220; // alto 
let velocidadY = 0;
let enSuelo = true;

let explosionImg;
let explotando = false;
let explosionFrame = 0;

let particulas = [];
let ripImg;

let vocacionImg, enojadaImg;
let ganarImg;
let sonidoCampana; // Variable para el sonido de la campana
let musicaFondo;
let sonidoFin;
let sonidoGanaste;
let juegoGanado = false;
let tiempoInicio = 0;
let estadoPersonaje = "normal";
let estadoFrames = 0;

let maestrasaltoImg;

let positivosImgs = [], negativosImgs = [];
let obstaculoAnimado = null;
let animFrame = 0;

let velocidadBase = 3;
let velocidadObstaculos = velocidadBase;
let velocidadMax = 20;
let progresoJuego = 0;

let burbujaTexto = null;
let burbujaFrames = 0;
let burbujasDisponibles = [];
const burbujasPositivas = [
  "El aula me salva",
  "Verlos aprender me carga",
  "Su emoción me enseña",
  "Miradas curiosas me devuelven la esperanza",
  "Sigo de pie me sostienen hilos invisibles."
];

let burbujaTextoNeg = null;
let burbujaFramesNeg = 0;
let burbujasNegDisponibles = [];
const burbujasNegativas = [
  "¿Otra reunión? No puedo más.",
  "El sueldo no alcanza, pero mi vocación sí.",
  "Pero ¿de dónde saco más?",
  "Somos más que papeles y estadísticas.",
  "Hoy también traje trabajo a casa…",
  "Mi mente no para.",
  "No me alcanza la energía ni para mí."
];

let fondoOscuroImg;

let caminaImg;
let atrasImg;
let abajoImg;

function preload() {
  corazonFondo = loadSound('libraries/corazon.wav');
  iniciobateriaImg = loadImage('libraries/iniciobateria.png');
  fondoImg = loadImage('libraries/pasillo.png'); // Imagen de fondo
  bateriaImg = loadImage('libraries/bateria maestra (1).png');
  vocacionImg = loadImage('libraries/vocacion.png');
  enojadaImg = loadImage('libraries/enojada.png');
  maestrasaltoImg = loadImage('libraries/maestrasalta.png');
  explosionImg = loadImage('libraries/PropsInPixels_16x50.png'); // Imagen de rayos amarillos
  ripImg = loadImage('libraries/rip.png'); // Emoticon RIP
  ganarImg = loadImage('libraries/ganar.png'); // Imagen de ganar
  fondoOscuroImg = loadImage('libraries/fondooscuro.png');
  caminaImg = loadImage('libraries/camina.png');
  atrasImg = loadImage('libraries/atras.png');
  abajoImg = loadImage('libraries/abajo.png');
  cajabuenaImg = loadImage('libraries/cajabuena.png');
  cajamalaImg = loadImage('libraries/cajamala.png');
  marchandoImg = loadImage('libraries/marchando.png');
  papelesImg = loadImage('libraries/muchospapeles.png');
  audioMarchaDocente = loadSound('libraries/marchadocente.mp3');
  audioAgotamiento = loadSound('libraries/agotamiento.mp3');
  for (let i = 13; i <= 19; i++) positivosImgs.push(loadImage(`libraries/${i}.png`));
  for (let i = 1; i <= 12; i++) negativosImgs.push(loadImage(`libraries/${i}.png`));
  sonidoCarga = loadSound('libraries/sonido_carga.mp3'); // Debes agregar un sonido en la carpeta
  sonidoDescarga = loadSound('libraries/sonido_descarga.mp3'); // Debes agregar un sonido en la carpeta
  sonidoExplosion = loadSound('libraries/sonido_explosion.wav'); // Sonido de explosión
  sonidoCampana = loadSound('libraries/campana.wav'); // Sonido de campana al inicio
  musicaFondo = loadSound('libraries/musicafondo.wav'); // Música de fondo
  sonidoFin = loadSound('libraries/fin.mp3'); // Sonido al perder
  sonidoGanaste = loadSound('libraries/ganaste.mp3'); // Sonido al ganar
  sonidoLatidoFin = loadSound('libraries/latidofin.mp3'); // Sonido de latido al perder
  sonidoWow = loadSound('libraries/wow.mp3'); // Sonido wow al atrapar positivo

  sonidoSuspiro = loadSound('libraries/suspiro.wav'); // Sonido de suspiro al atrapar negativo

  // Los videos se crean en setup para asegurar el canvas
}


// --- Evento especial de cajas ---
let eventoCajasActivo = false;
let resultadoCajas = null; // null, 'buena', 'mala'
let animacionMarchaFrames = 0;
let animacionPapelesFrames = 0;
let contadorObstaculos = 0;

function setup() {
  let canvas = createCanvas(900, 550);
  // Centrar el canvas en el contenedor si existe
  let contenedor = document.getElementById('juego-container');
  if (contenedor) {
    contenedor.appendChild(canvas.elt);
    contenedor.style.display = 'flex';
    contenedor.style.justifyContent = 'center';
    contenedor.style.alignItems = 'flex-start';
    contenedor.style.width = '100vw';
    contenedor.style.minHeight = '100vh';
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = 'relative';
    contenedor.style.left = '0';
    contenedor.style.top = '0';
    contenedor.style.background = 'transparent';
    canvas.elt.style.display = 'block';
    canvas.elt.style.margin = '40px auto 0 auto';
    canvas.elt.style.boxShadow = '0 0 24px 2px rgba(0,0,0,0.15)';
  } else {
    // Si no existe el contenedor, centrar en body
    canvas.parent(document.body);
    canvas.elt.style.display = 'block';
    canvas.elt.style.margin = '40px auto 0 auto';
    canvas.elt.style.position = 'static';
    canvas.elt.style.left = '';
    canvas.elt.style.top = '';
    canvas.elt.style.transform = '';
    canvas.elt.style.boxShadow = '0 0 24px 2px rgba(0,0,0,0.15)';
  }
  // Los videos ya no se usan para sonido, solo para mostrar si se desea
  videoMarchaDocente = null;
  videoAgotamiento = null;
  bateriaColor = color(0, 255, 0);
  tiempoInicio = millis();
  juegoIniciado = false;
  if (sonidoCampana) {
    sonidoCampana.setVolume(0.2); // volumen bajo
    sonidoCampana.play();
  }
}

function draw() {
  // Evento especial: mostrar cajas
  if (eventoCajasActivo) {
    // Usar fondoOscuroImg como fondo
    if (fondoOscuroImg) {
      image(fondoOscuroImg, 0, 0, width, height);
    } else {
      background(30, 30, 30);
    }
    // Solo mostrar texto y cajas si NO se ha elegido ninguna
    if (!resultadoCajas) {
      textAlign(CENTER, CENTER);
      textSize(22);
      fill(255);
      stroke(0);
      strokeWeight(4);
      let textoCajas = 'Con las flechas izquierda y derecha seleccioná una caja';
      let maxAncho = width - 60;
      let palabras = textoCajas.split(' ');
      let lineaActual = '';
      let lineas = [];
      for (let i = 0; i < palabras.length; i++) {
        let testLinea = lineaActual + (lineaActual ? ' ' : '') + palabras[i];
        if (textWidth(testLinea) > maxAncho && lineaActual) {
          lineas.push(lineaActual);
          lineaActual = palabras[i];
        } else {
          lineaActual = testLinea;
        }
      }
      if (lineaActual) lineas.push(lineaActual);
      let yTexto = 80;
      for (let i = 0; i < lineas.length; i++) {
        text(lineas[i], width/2, yTexto + i * 28);
      }
      // Dibuja las dos cajas como imágenes
      let cajaW = 180, cajaH = 180;
      let x1 = width/2 - 200, y1 = height/2;
      let x2 = width/2 + 20, y2 = height/2;
      // Sombra para la caja seleccionada
      if (typeof cajaSeleccionada === 'undefined') cajaSeleccionada = 0;
      if (cajaSeleccionada === 0) {
        fill(255,255,0,80); noStroke(); rect(x1-10, y1-10, cajaW+20, cajaH+20, 24); }
      if (cajaSeleccionada === 1) {
        fill(255,255,0,80); noStroke(); rect(x2-10, y2-10, cajaW+20, cajaH+20, 24); }
      // Cajas
      if (cajabuenaImg) image(cajabuenaImg, x1, y1, cajaW, cajaH);
      else { fill(80, 200, 120); rect(x1, y1, cajaW, cajaH, 18); }
      if (cajamalaImg) image(cajamalaImg, x2, y2, cajaW, cajaH);
      else { fill(200, 80, 80); rect(x2, y2, cajaW, cajaH, 18); }
    }
    // Ya no se muestra ningún mensaje tras elegir una caja
    noLoop();
    return;
  }
  // Animación tras elegir caja buena
  if (resultadoCajas === 'buena') {
    // Pausar todos los sonidos excepto el audio de marcha docente
    if (musicaFondo && musicaFondo.isPlaying()) musicaFondo.stop();
    if (sonidoGanaste && sonidoGanaste.isPlaying()) sonidoGanaste.stop();
    if (corazonFondo && corazonFondo.isPlaying()) corazonFondo.stop();
    if (sonidoFin && sonidoFin.isPlaying()) sonidoFin.stop();
    if (sonidoLatidoFin && sonidoLatidoFin.isPlaying()) sonidoLatidoFin.stop();
    if (audioAgotamiento && audioAgotamiento.isPlaying()) audioAgotamiento.stop();
    background(0, 120, 200);
    // Iniciar audio si no está sonando
    if (audioMarchaDocente && !audioMarchaDocente.isPlaying()) {
      audioMarchaDocente.setVolume(1.0);
      audioMarchaDocente.play();
      animacionMarchaFrames = 0;
    }
    // Animación progresiva de acercamiento de imágenes (de lejos a cerca)
    if (marchandoImg && audioMarchaDocente) {
      let duracion = audioMarchaDocente.duration() || 6;
      let totalFrames = duracion * 60;
      let capas = 12;
      let avance = constrain(animacionMarchaFrames / totalFrames, 0, 1);
      for (let i = 0; i < capas; i++) {
        let t = map(i, 0, capas - 1, 0, 1);
        if (avance >= t) {
          let escala = map(i, 0, capas - 1, 0.7, Math.max(width/220, height/210)*1.05);
          let imgW = 220 * escala;
          let imgH = 210 * escala;
          let x = width/2 - imgW/2;
          let y = height/2 - imgH/2;
          image(marchandoImg, x, y, imgW, imgH);
        }
      }
      animacionMarchaFrames++;
      // Mostrar texto y permitir saltar animación
      fill(0, 120, 200, 220);
      rect(0, height-50, width, 50);
      textAlign(CENTER, BOTTOM);
      textSize(22);
      fill(255);
      stroke(0);
      strokeWeight(4);
      text('Después de la animación presiona Enter', width/2, height - 18);
      noStroke();
      // Si termina el audio o frames, avanzar automáticamente
      if (audioMarchaDocente.currentTime() >= duracion - 0.05 || animacionMarchaFrames >= totalFrames) {
        if (audioMarchaDocente.isPlaying()) audioMarchaDocente.stop();
        carga = min(200, carga + 180);
        resultadoCajas = 'esperandoEnterBuena';
        animacionMarchaFrames = 0;
        loop();
        return;
      }
    }
    return;
  }
  // Espera Enter tras animación buena
  if (resultadoCajas === 'esperandoEnterBuena') {
    background(0, 120, 200);
    fill(0, 120, 200, 220);
    rect(0, height-50, width, 50);
    textAlign(CENTER, BOTTOM);
    textSize(22);
    fill(255);
    stroke(0);
    strokeWeight(4);
    text('Después de la animación presiona Enter', width/2, height - 18);
    noStroke();
    // NoLoop para pausar el juego hasta Enter
    noLoop();
    return;
  }
  // Animación tras elegir caja mala
  if (resultadoCajas === 'mala') {
    // Pausar todos los sonidos excepto el audio de agotamiento
    if (musicaFondo && musicaFondo.isPlaying()) musicaFondo.stop();
    if (sonidoGanaste && sonidoGanaste.isPlaying()) sonidoGanaste.stop();
    if (corazonFondo && corazonFondo.isPlaying()) corazonFondo.stop();
    if (sonidoFin && sonidoFin.isPlaying()) sonidoFin.stop();
    if (sonidoLatidoFin && sonidoLatidoFin.isPlaying()) sonidoLatidoFin.stop();
    if (audioMarchaDocente && audioMarchaDocente.isPlaying()) audioMarchaDocente.stop();
    background(220);
    // Iniciar audio si no está sonando
    if (audioAgotamiento && !audioAgotamiento.isPlaying()) {
      audioAgotamiento.setVolume(1.0);
      audioAgotamiento.play();
      animacionPapelesFrames = 0;
      window.papelesFijos = [];
    }
    // Animación progresiva de papeles: imágenes fijas llenando y desbordando la pantalla
    if (papelesImg && audioAgotamiento) {
      let duracion = audioAgotamiento.duration() || 6;
      let totalFrames = duracion * 60;
      let totalPapeles = 18;
      let avance = constrain(animacionPapelesFrames / totalFrames, 0, 1);
      let papelesAMostrar = floor(avance * totalPapeles * 2.5) + 1;
      if (!window.papelesFijos) window.papelesFijos = [];
      while (window.papelesFijos.length < papelesAMostrar) {
        let w = random(width*0.4, width*1.1);
        let h = random(height*0.4, height*1.1);
        let x = random(-w*0.5, width - w*0.5);
        let y = random(-h*0.5, height - h*0.5);
        window.papelesFijos.push({x, y, w, h});
      }
      for (let papel of window.papelesFijos) {
        image(papelesImg, papel.x, papel.y, papel.w, papel.h);
      }
      animacionPapelesFrames++;
      // Mostrar texto y permitir saltar animación
      fill(220, 220, 220, 220);
      rect(0, height-50, width, 50);
      textAlign(CENTER, BOTTOM);
      textSize(22);
      fill(80);
      stroke(0);
      strokeWeight(4);
      text('Después de la animación presiona Enter', width/2, height - 18);
      noStroke();
      // Si termina el audio o frames, avanzar automáticamente
      if (audioAgotamiento.currentTime() >= duracion - 0.05 || animacionPapelesFrames >= totalFrames) {
        if (audioAgotamiento.isPlaying()) audioAgotamiento.stop();
        carga = max(0, carga - 180);
        resultadoCajas = 'esperandoEnterMala';
        animacionPapelesFrames = 0;
        loop();
        return;
      }
    }
    return;
  }
  // Espera Enter tras animación mala
  if (resultadoCajas === 'esperandoEnterMala') {
    background(220);
    fill(220, 220, 220, 220);
    rect(0, height-50, width, 50);
    textAlign(CENTER, BOTTOM);
    textSize(22);
    fill(80);
    stroke(0);
    strokeWeight(4);
    text('Después de la animación presiona Enter', width/2, height - 18);
    noStroke();
    noLoop();
    return;
  }
  if (!juegoIniciado) {
    background(0, 120, 200);
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(255);
    stroke(0);
    strokeWeight(6);
    text('¡Que comience el ciclo lectivo!', width/2, height/2 - 60);
    // Imagen de inicio centrada debajo del texto principal
    if (iniciobateriaImg) {
      let w = 220;
      let h = 220;
      image(iniciobateriaImg, width/2 - w/2, height/2 - 30, w, h);
    }
    // Mensaje al pie
    textSize(28);
    noStroke();
    fill(255);
    textAlign(CENTER, BOTTOM);
    text('Presiona una tecla para comenzar', width/2, height - 30);
    return;
  }
  if (juegoGanado) {
    // Pantalla de victoria
    if (ganarImg) {
      image(ganarImg, 0, 0, width, height);
    } else {
      background(0, 200, 0);
    }
    textAlign(CENTER, BOTTOM);
    textSize(44);
    fill(255);
    stroke(0);
    strokeWeight(6);
    let textoVictoria = '¡La energía no viene del sistema, sino de mi pasión!';
    let maxAncho = width - 60;
    let lineas = [];
    let palabras = textoVictoria.split(' ');
    let lineaActual = '';
    for (let i = 0; i < palabras.length; i++) {
      let testLinea = lineaActual + (lineaActual ? ' ' : '') + palabras[i];
      if (textWidth(testLinea) > maxAncho && lineaActual) {
        lineas.push(lineaActual);
        lineaActual = palabras[i];
      } else {
        lineaActual = testLinea;
      }
    }
    if (lineaActual) lineas.push(lineaActual);
    let y = height - 60 - (lineas.length - 1) * 48;
    for (let i = 0; i < lineas.length; i++) {
      text(lineas[i], width/2, y + i * 48);
    }
    noLoop();
    return;
  }

  // Fondo scroll con imagen
  image(fondoImg, fondoX, 0, width, height);
  image(fondoImg, fondoX + width, 0, width, height);
  fondoX -= 2;
  if (fondoX <= -width) fondoX = 0;

  // Disparador del evento especial: tras 10 obstáculos
  if (!eventoCajasActivo && contadorObstaculos >= 10) {
    eventoCajasActivo = true;
    cajaSeleccionada = 0;
    redraw();
    return;
  }
// Detectar clic en las cajas
// Selección de caja con flechas y enter
function keyPressed() {
  if (eventoCajasActivo) {
    // Bloqueo absoluto: si ya se eligió una caja, no permite ninguna acción hasta reiniciar
    if (resultadoCajas) return;
    if (keyCode === LEFT_ARROW) {
      cajaSeleccionada = 0;
      redraw();
      return;
    }
    if (keyCode === RIGHT_ARROW) {
      cajaSeleccionada = 1;
      redraw();
      return;
    }
    if (keyCode === ENTER || keyCode === 32) { // Enter o Espacio para elegir
      if (cajaSeleccionada === 0) {
        resultadoCajas = 'buena';
        eventoCajasActivo = false;
        animacionMarchaFrames = 0;
        loop();
        return;
      } else if (cajaSeleccionada === 1) {
        resultadoCajas = 'mala';
        eventoCajasActivo = false;
        animacionPapelesFrames = 0;
        loop();
        return;
      }
    }
    return;
  }
  // Permitir saltar animación de caja buena o mala con Enter
  if ((resultadoCajas === 'buena' || resultadoCajas === 'mala') && keyCode === ENTER) {
    if (resultadoCajas === 'buena' && audioMarchaDocente && audioMarchaDocente.isPlaying()) audioMarchaDocente.stop();
    if (resultadoCajas === 'mala' && audioAgotamiento && audioAgotamiento.isPlaying()) audioAgotamiento.stop();
    if (resultadoCajas === 'buena') {
      carga = min(200, carga + 180);
      resultadoCajas = 'esperandoEnterBuena';
    } else if (resultadoCajas === 'mala') {
      carga = max(0, carga - 180);
      resultadoCajas = 'esperandoEnterMala';
    }
    animacionMarchaFrames = 0;
    animacionPapelesFrames = 0;
    loop();
    return;
  }
  // Al presionar Enter en espera tras animación, reanuda el juego normal y permite nuevo evento tras otros 10 obstáculos
  if ((resultadoCajas === 'esperandoEnterBuena' || resultadoCajas === 'esperandoEnterMala') && keyCode === ENTER) {
    resultadoCajas = null;
    animacionMarchaFrames = 0;
    animacionPapelesFrames = 0;
    eventoCajasActivo = false;
    cajaSeleccionada = 0;
    contadorObstaculos = 0;
    loop();
    return;
  }
  // ...resto de keyPressed existente...
}

  // Progreso del juego basado en frameCount
  progresoJuego = min(1, frameCount / (40 * 160)); // 90 segundos para llegar a velocidad máxima
  velocidadObstaculos = velocidadBase + (velocidadMax - velocidadBase) * progresoJuego;

  // Actualiza color según carga
  if (carga > 150) {
    bateriaColor = color(0, 255, 0); // Verde
  } else if (carga > 80) {
    bateriaColor = color(255, 255, 0); // Amarillo
  } else if (carga > 30) {
    bateriaColor = color(255, 140, 0); // Naranja
  } else {
    bateriaColor = color(255, 0, 0); // Rojo
  }

  // Condición de victoria
  if (carga >= 200) {
    juegoGanado = true;
    if (sonidoGanaste && !sonidoGanaste.isPlaying()) sonidoGanaste.play();
    if (corazonFondo && !corazonFondo.isPlaying()) {
      corazonFondo.setVolume(1.5); // volumen máximo absoluto
      corazonFondo.loop();
    }
    if (musicaFondo && musicaFondo.isPlaying()) {
      musicaFondo.stop();
    }
    loop(); // Por si estaba parado por derrota
    return;
  }

  // FÍSICA DEL PERSONAJE
  if (!explotando) {
    velocidadY += 1; // gravedad
    personajeY += velocidadY;
    if (personajeY > height - personajeH - 20) { // suelo
      personajeY = height - personajeH - 20;
      velocidadY = 0;
      enSuelo = true;
    } else {
      enSuelo = false;
    }
  }

  // Dibuja personaje o explosión
  if (carga > 0 && !explotando) {
    tint(bateriaColor);
    let imgToShow = bateriaImg;
    let w = personajeW;
    let h = personajeH;
    if (estadoPersonaje === "vocacion" && estadoFrames > 0) {
      imgToShow = vocacionImg;
      estadoFrames--;
      if (estadoFrames === 0) estadoPersonaje = "normal";
    } else if (estadoPersonaje === "enojada" && estadoFrames > 0) {
      imgToShow = enojadaImg;
      w = personajeW * 1.0;
      h = personajeH * 1.0;
      estadoFrames--;
      if (estadoFrames === 0) estadoPersonaje = "normal";
    } else if (!enSuelo) {
      imgToShow = maestrasaltoImg;
    } else if (keyIsDown(RIGHT_ARROW)) {
      imgToShow = caminaImg;
    } else if (keyIsDown(LEFT_ARROW)) {
      imgToShow = atrasImg;
    } else if (keyIsDown(DOWN_ARROW)) {
      imgToShow = abajoImg;
      w = personajeW * 0.8;
      h = personajeH * 0.8;
    }
    // Dibuja el personaje en la posición correspondiente
    if (keyIsDown(DOWN_ARROW)) {
      image(imgToShow, personajeX - (w - personajeW) / 2, personajeY - (h - personajeH) / 2 + 60, w, h);
    } else {
      image(imgToShow, personajeX - (w - personajeW) / 2, personajeY - (h - personajeH) / 2, w, h);
    }
    noTint();

    // Dibuja burbuja de texto positiva si está activa (en el centro superior)
    if (burbujaTexto && burbujaFrames > 0) {
      let bx = width/2;
      let by = 60;
      textAlign(CENTER, CENTER);
      textSize(22);
      // Estilo pixel art
      fill(255);
      stroke(0);
      strokeWeight(8);
      textFont('monospace');
      // Fondo burbuja
      let tw = textWidth(burbujaTexto) + 34;
      let th = 44;
      rectMode(CENTER);
      fill(255, 240);
      stroke(0, 180);
      rect(bx, by, tw, th, 10);
      fill(40);
      noStroke();
      text(burbujaTexto, bx, by+2);
      burbujaFrames--;
      if (burbujaFrames === 0) burbujaTexto = null;
    }
    // Dibuja burbuja de texto negativa si está activa (en el centro superior)
    if (burbujaTextoNeg && burbujaFramesNeg > 0) {
      let bx = width/2;
      let by = 110;
      textAlign(CENTER, CENTER);
      textSize(22);
      // Estilo pixel art
      fill(255);
      stroke(0);
      strokeWeight(8);
      textFont('monospace');
      // Fondo burbuja negra
      let tw = textWidth(burbujaTextoNeg) + 34;
      let th = 44;
      rectMode(CENTER);
      fill(0, 230);
      stroke(255, 180);
      rect(bx, by, tw, th, 10);
      fill(255);
      noStroke();
      text(burbujaTextoNeg, bx, by+2);
      burbujaFramesNeg--;
      if (burbujaFramesNeg === 0) burbujaTextoNeg = null;
    }
  } else if (carga <= 0 || explotando) {
    if (!explotando) {
      crearExplosion(personajeX + personajeW / 2, personajeY + personajeH / 2);
      explotando = true;
      if (sonidoExplosion) sonidoExplosion.play();
      if (sonidoFin && !sonidoFin.isPlaying()) sonidoFin.play();
      if (musicaFondo && musicaFondo.isPlaying()) {
        musicaFondo.stop();
      }
      if (sonidoLatidoFin && !sonidoLatidoFin.isPlaying()) {
        sonidoLatidoFin.setVolume(0.1); // volumen bajo
        sonidoLatidoFin.loop();
      }
    }
    // Mostrar fondo oscuro al perder
    if (fondoOscuroImg) {
      image(fondoOscuroImg, 0, 0, width, height);
    }
    // Dibujar partículas de rayos
    for (let p of particulas) {
      push();
      translate(p.x, p.y);
      rotate(p.angulo);
      let escala = p.escala || 1.0;
      image(explosionImg, -8 * escala, -25 * escala, 16 * escala, 50 * escala);
      pop();
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 1.02; // aceleración
      p.vy *= 1.02;
      p.vida--;
    }
    particulas = particulas.filter(p => p.vida > 0 && p.x > -60 && p.x < width + 60 && p.y > -60 && p.y < height + 60);
    explosionFrame++;
    // Mostrar emoticon RIP
    let ripY = height/2 - 60;
    let textoArriba = '¡Mi cuerpo se apaga,';
    let textoAbajo = 'pero la vocación sigue encendida!';
    if (explosionFrame > 60 || particulas.length === 0) {
      textAlign(CENTER, BOTTOM);
      textSize(32);
      fill(255);
      stroke(0);
      strokeWeight(6);
      // Texto arriba del RIP
      text(textoArriba, width/2, ripY - 20);
    }
    if (ripImg) {
      image(ripImg, width/2 - 60, ripY, 120, 120);
    }
    if (explosionFrame > 60 || particulas.length === 0) {
      // Texto abajo del RIP
      textAlign(CENTER, TOP);
      text(textoAbajo, width/2, ripY + 120 + 20);
      noLoop(); // Detiene el juego
    }
    return;
  }

  // Obstáculos
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    let obs = obstaculos[i];
    if (!obs.animando) {
      obs.x -= velocidadObstaculos;
      if (obs.tipo === 'positivo' && obs.img) {
        image(obs.img, obs.x - 110, obs.y - 110, 120, 120); // tamaño obstaculos +
      } else if (obs.tipo === 'negativo' && obs.img) {
        image(obs.img, obs.x - 110, obs.y - 110, 120, 120); // tamaño obstáculos -
      }
      // Si el obstáculo sale de pantalla, cuenta para el evento
      if (obs.x < -40) {
        contadorObstaculos++;
        obstaculos.splice(i, 1);
        continue;
      }
    }
    // Colisión
    let centroX = personajeX + personajeW / 2;
    let centroY = personajeY + personajeH / 2;
    let agachado = keyIsDown(DOWN_ARROW);
    let personajeTop = personajeY + (agachado ? (personajeH * 0.2) + 60 : 0);
    let personajeBottom = personajeY + (agachado ? (personajeH * 0.8) + 60 : personajeH);
    let personajeLeft = personajeX;
    let personajeRight = personajeX + (agachado ? personajeW * 0.8 : personajeW);
    let obsRadio = 60; // radio de colisión estándar
    let colisiona = false;
    if (!obs.animando) {
      if (!enSuelo) {
        // Si está en el aire, NO colisiona con obstáculos
        colisiona = false;
      } else if (agachado) {
        // Agachado: solo colisiona con obstáculos bajos
        if (obs.y > personajeTop + (personajeBottom - personajeTop) * 0.5) {
          // Obstáculo bajo, sí colisiona
          colisiona = dist(obs.x, obs.y, centroX, personajeTop + (personajeBottom - personajeTop) / 2) < obsRadio;
        } else {
          // Obstáculo alto, NO colisiona (esquiva)
          colisiona = false;
        }
      } else {
        // Parado: colisión SIEMPRE que pase por la zona del personaje
        colisiona = (obs.x > personajeLeft && obs.x < personajeRight && obs.y > personajeTop && obs.y < personajeBottom);
      }
    }
    if (colisiona) {
      contadorObstaculos++;
      obs.animando = true;
      obs.animFrame = 0;
      obs.startX = obs.x;
      obs.startY = obs.y;
      obs.dir = random() > 0.5 ? 1 : -1;
      obstaculoAnimado = obs;
      animFrame = 0;
      if (obs.tipo === 'positivo') {
        carga = min(200, carga + 30);
        if (sonidoCarga && !sonidoCarga.isPlaying()) {
          sonidoCarga.setVolume(0.3); // volumen reducido
          sonidoCarga.play();
        }
        if (sonidoWow) {
          sonidoWow.setVolume(0.7); // volumen medio-alto
          sonidoWow.play();
        }
        // Mostrar burbuja de texto positiva aleatoria, sin repetir hasta agotar todas
        if (burbujasDisponibles.length === 0) {
          burbujasDisponibles = burbujasPositivas.slice();
        }
        let idx = floor(random(burbujasDisponibles.length));
        burbujaTexto = burbujasDisponibles[idx];
        burbujasDisponibles.splice(idx, 1);
        burbujaFrames = 60; // 1 segundo aprox
        estadoPersonaje = "vocacion";
        estadoFrames = 20;
      } else {
        carga = max(0, carga - 40);
        if (sonidoDescarga && !sonidoDescarga.isPlaying()) {
          sonidoDescarga.setVolume(0.3); // volumen reducido
          sonidoDescarga.play();
        }
        if (sonidoSuspiro) {
          sonidoSuspiro.setVolume(1.0); // volumen máximo
          sonidoSuspiro.play();
        }
        // Mostrar burbuja de texto negativa aleatoria, sin repetir hasta agotar todas
        if (burbujasNegDisponibles.length === 0) {
          burbujasNegDisponibles = burbujasNegativas.slice();
        }
        let idx = floor(random(burbujasNegDisponibles.length));
        burbujaTextoNeg = burbujasNegDisponibles[idx];
        burbujasNegDisponibles.splice(idx, 1);
        burbujaFramesNeg = 60; // 1 segundo aprox
        estadoPersonaje = "enojada";
        estadoFrames = 20;
      }
    }
    // Animación de ampliación y salida
    if (obs.animando) {
      let duracionAmpliacion = 40; // más frames para la ampliación
      let t = min(1, obs.animFrame / duracionAmpliacion);
      // Ampliar siempre hacia el costado derecho
      let destinoX = width - 120;
      let destinoY = height/2;
      let cx = lerp(obs.startX, destinoX, t);
      let cy = lerp(obs.startY, destinoY, t);
      let s = lerp(1, 3.5, t); // menos grande (antes era 5)
      image(obs.img, cx - 70 * s/2, cy - 70 * s/2, 70 * s, 70 * s);
      obs.animFrame++;
      if (obs.animFrame > duracionAmpliacion && obs.animFrame <= duracionAmpliacion + 30) {
        // Salida volando hacia la derecha
        let t2 = (obs.animFrame - duracionAmpliacion) / 30;
        let salidaX = width + 200;
        let salidaY = -200;
        cx = lerp(destinoX, salidaX, t2);
        cy = lerp(destinoY, salidaY, t2);
        s = 3 - 1.5 * t2; // menos grande
        image(obs.img, cx - 70 * s/2, cy - 70 * s/2, 70 * s, 70 * s);
      }
      if (obs.animFrame > duracionAmpliacion + 30) {
        obstaculos.splice(i, 1);
      }
    }
    if (!obs.animando && obs.x < -40) {
      obstaculos.splice(i, 1);
    }
  }

  // Genera nuevos obstáculos
  if (frameCount % 90 === 0) {
    obstaculos.push(crearObstaculo());
  }

  // Barra de carga
  let barraX = 10;
  let barraY = 10;
  let barraW = 400; // ancho fijo de 400
  let barraH = 28;
  fill(50);
  rect(barraX, barraY, barraW, barraH);
  fill(bateriaColor);
  rect(barraX, barraY, map(carga, 0, 200, 0, barraW), barraH);
  // Mostrar porcentaje numérico
  let porcentaje = int(map(carga, 0, 200, 0, 100));
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(0);
  stroke(255);
  strokeWeight(3);
  text(porcentaje + '%', barraX + barraW/2, barraY + barraH/2 + 1);
}

function crearObstaculo() {
  let tipo = random() > 0.5 ? 'positivo' : 'negativo';
  let img = tipo === 'positivo' ? random(positivosImgs) : random(negativosImgs);
  return {
    x: width + 30,
    y: random(height - 120, height - 30),
    tipo: tipo,
    img: img,
    animando: false,
    scale: 1,
    dir: 1
  };
}

function crearExplosion(x, y) {
  particulas = [];
  for (let i = 0; i < 100; i++) { // 90 rayos (antes 50)
    let angulo = map(i, 0, 100, 0, TWO_PI);
    let velocidad = random(7, 13);
    particulas.push({
      x: x,
      y: y,
      vx: cos(angulo) * velocidad,
      vy: sin(angulo) * velocidad,
      angulo: angulo + random(-0.2, 0.2),
      vida: 60,
      escala: random(1.2, 1.6) // escala para rayos más grandes
    });
  }
}

function keyPressed() {
  // --- Evento especial de cajas ---
  if (eventoCajasActivo) {
    if (keyCode === LEFT_ARROW) {
      cajaSeleccionada = 0;
      redraw();
      return;
    }
    if (keyCode === RIGHT_ARROW) {
      cajaSeleccionada = 1;
      redraw();
      return;
    }
    if (keyCode === ENTER || keyCode === 32) { // Enter o Espacio para elegir
      if (cajaSeleccionada === 0) {
        resultadoCajas = 'buena';
        eventoCajasActivo = false;
        animacionMarchaFrames = 0;
        loop();
        return;
      } else if (cajaSeleccionada === 1) {
        resultadoCajas = 'mala';
        eventoCajasActivo = false;
        animacionPapelesFrames = 0;
        loop();
        return;
      }
    }
    return;
  }
  if (!juegoIniciado) {
    // Iniciar juego al presionar cualquier tecla
    fondoX = 0;
    carga = 100;
    obstaculos = [];
    personajeX = 30;
    personajeY = height - personajeH - 20;
    velocidadY = 0;
    enSuelo = true; // SIEMPRE en el suelo al iniciar
    explotando = false;
    explosionFrame = 0;
    particulas = [];
    juegoGanado = false;
    estadoPersonaje = "normal";
    estadoFrames = 0;
    animFrame = 0;
    velocidadObstaculos = 4;
    progresoJuego = 0;
    contadorObstaculos = 0;
    eventoCajasActivo = false;
    resultadoCajas = null;
    animacionMarchaFrames = 0;
    animacionPapelesFrames = 0;
    obstaculos.push(crearObstaculo());
    juegoIniciado = true;
    if (musicaFondo && !musicaFondo.isPlaying()) {
      musicaFondo.setVolume(0.2);
      musicaFondo.loop();
    }
    return;
  }
  // Controles normales del juego
  if (keyCode === UP_ARROW && enSuelo) {
    velocidadY = -28; // salto más alto
  }
  if (keyCode === RIGHT_ARROW) {
    personajeX = min(width - personajeW, personajeX + 20);
  }
  if (keyCode === LEFT_ARROW) {
    personajeX = max(0, personajeX - 20);
  }
  if (keyCode === DOWN_ARROW) {
    personajeY = min(height - personajeH - 20, personajeY + 20);
  }
  // Reiniciar juego con Enter
  if (keyCode === ENTER) {
    // Restaurar variables principales
    fondoX = 0;
    carga = 100;
    obstaculos = [];
    personajeX = 30;
    personajeY = height - personajeH - 20;
    velocidadY = 0;
    enSuelo = true; // SIEMPRE en el suelo al reiniciar
    explotando = false;
    explosionFrame = 0;
    particulas = [];
    juegoGanado = false;
    estadoPersonaje = "normal";
    estadoFrames = 0;
    animFrame = 0;
    velocidadObstaculos = velocidadBase; // SIEMPRE vuelve a la velocidad base
    progresoJuego = 0;
    contadorObstaculos = 0;
    eventoCajasActivo = false;
    resultadoCajas = null;
    animacionMarchaFrames = 0;
    animacionPapelesFrames = 0;
    obstaculos.push(crearObstaculo());
    loop();
    if (corazonFondo && corazonFondo.isPlaying()) corazonFondo.stop();
    if (sonidoLatidoFin && sonidoLatidoFin.isPlaying()) sonidoLatidoFin.stop();
    if (sonidoCampana) {
      sonidoCampana.setVolume(0.2); // volumen bajo
      sonidoCampana.play();
    }
    if (musicaFondo && !musicaFondo.isPlaying()) {
      musicaFondo.setVolume(0.2);
      musicaFondo.loop();
    }
  }
}

