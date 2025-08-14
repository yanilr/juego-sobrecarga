// Prevenir scroll de la página con flechas SOLO si el canvas está enfocado
document.addEventListener('keydown', function(e) {
  const flechas = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (flechas.includes(e.key)) {
    const active = document.activeElement;
    if (active && active.tagName === 'CANVAS') {
      e.preventDefault();
    }
  }
}, false);

// Variables globales únicas
let juegoIniciado = false;
let recursosCargados = false;
let canvas;
let fondoX = 0;
let fondoImg, bateriaImg, bateriaColor;
let carga = 100;
let obstaculos = [];
let positivosImgs = [], negativosImgs = [];
let personajeX = 30, personajeY = 220, personajeW = 210, personajeH = 220, velocidadY = 0, enSuelo = true;
let explosionImg, explotando = false, explosionFrame = 0, particulas = [], ripImg;
let vocacionImg, enojadaImg, ganarImg, sonidoCampana, musicaFondo, sonidoFin, sonidoGanaste, juegoGanado = false;
let tiempoInicio = 0, estadoPersonaje = "normal", estadoFrames = 0, maestrasaltoImg;
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
let fondoOscuroImg, caminaImg, atrasImg, abajoImg;
let corazonFondo, iniciobateriaImg, audioMarchaDocente, audioAgotamiento, videoMarchaDocente, videoAgotamiento;
let cajabuenaImg, cajamalaImg, marchandoImg, papelesImg;
let sonidoCarga, sonidoDescarga, sonidoExplosion, sonidoSuspiro, sonidoLatidoFin, sonidoWow;

// Evento especial de cajas
let eventoCajasActivo = false, resultadoCajas = null, animacionMarchaFrames = 0, animacionPapelesFrames = 0, contadorObstaculos = 0, cajaSeleccionada = 0;
let ignorarVictoriaDerrota = false, ignorarVictoriaDerrotaFrames = 0;
let secuenciaCajas = [10, 15, 20];
let indiceSecuenciaCajas = 0;
let obstaculosParaCajas = secuenciaCajas[indiceSecuenciaCajas];

/* ========== 
   UTILIDADES
   ========== */
function drawBg(img) {
  if (img) image(img, 0, 0, width, height);
  else background(24);
}
function dbgImg(name, img) {
  if (!img) console.warn('No se cargó', name);
  return !!img;
}
function safePlay(snd, vol = 1, loop = false) {
  if (!snd) return;
  try {
    snd.setVolume(vol);
    loop ? snd.loop() : snd.play();
  } catch (e) {}
}
function safeStop(snd) {
  if (!snd) return;
  try { if (snd.isPlaying()) snd.stop(); } catch(e) {}
}

/* ========== 
   PRELOAD
   ========== */
function preload() {
  // Imagen de corazón pequeño para animación de victoria
  img18 = loadImage('libraries/18.png');
  // Sonidos (si faltan, el juego igual corre)
  corazonFondo = loadSound('libraries/corazon.wav');
  sonidoCarga = loadSound('libraries/sonido_carga.mp3');
  sonidoDescarga = loadSound('libraries/sonido_descarga.mp3');
  sonidoExplosion = loadSound('libraries/sonidoExplosion.wav');
  sonidoCampana = loadSound('libraries/campana.wav');
  musicaFondo = loadSound('libraries/musicafondo.wav');
  sonidoFin = loadSound('libraries/fin.mp3');
  sonidoGanaste = loadSound('libraries/ganaste.mp3');
  sonidoLatidoFin = loadSound('libraries/latidofin.mp3');
  sonidoWow = loadSound('libraries/wow.mp3');
  sonidoSuspiro = loadSound('libraries/suspiro.wav');
  audioMarchaDocente = loadSound('libraries/marchadocente.mp3');
  audioAgotamiento = loadSound('libraries/agotamiento.mp3');

  // Imágenes
  iniciobateriaImg = loadImage('libraries/iniciobateria.png');
  fondoImg = loadImage('libraries/pasillo.png');
  bateriaImg = loadImage('libraries/bateria maestra (1).png');
  vocacionImg = loadImage('libraries/vocacion.png');
  enojadaImg = loadImage('libraries/enojada.png');
  maestrasaltoImg = loadImage('libraries/maestrasalta.png');
  explosionImg = loadImage('libraries/rayo.png');
  ripImg = loadImage('libraries/rip.png');
  ganarImg = loadImage('libraries/ganar.png');
  fondoOscuroImg = loadImage('libraries/fondooscuro.png');
  caminaImg = loadImage('libraries/camina.png');
  atrasImg = loadImage('libraries/atras.png');
  abajoImg = loadImage('libraries/abajo.png');
  cajabuenaImg = loadImage('libraries/cajabuena.png');
  cajamalaImg = loadImage('libraries/cajamala.png');
  marchandoImg = loadImage('libraries/marchando.png');
  papelesImg = loadImage('libraries/muchospapeles.png');
  for (let i = 13; i <= 19; i++) positivosImgs.push(loadImage(`libraries/${i}.png`));
  for (let i = 1; i <= 12; i++) negativosImgs.push(loadImage(`libraries/${i}.png`));
  // Los videos se crean en setup si se usan
}

/* ========== 
   SETUP
   ========== */
function setup() {
  canvas = createCanvas(900, 550);
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
    canvas.parent(document.body);
    canvas.elt.style.display = 'block';
    canvas.elt.style.margin = '40px auto 0 auto';
    canvas.elt.style.position = 'static';
    canvas.elt.style.left = '';
    canvas.elt.style.top = '';
    canvas.elt.style.transform = '';
    canvas.elt.style.boxShadow = '0 0 24px 2px rgba(0,0,0,0.15)';
  }
  bateriaColor = color(0, 255, 0);
  tiempoInicio = millis();
  juegoIniciado = false;
  if (sonidoCampana) {
    sonidoCampana.setVolume(0.2);
    sonidoCampana.play();
  }
  textFont('monospace');
}

/* ========== 
   DRAW
   ========== */
function draw() {
  clear();

  // Fondo (si no está, usa gris)
  drawBg(fondoImg);

  // Pantalla de inicio personalizada
  if (!juegoIniciado) {
    background(0, 120, 200);
    // Título principal
    textAlign(CENTER, CENTER);
    textSize(48);
    fill(255);
    stroke(0);
    strokeWeight(6);
    text('¡Que comience el ciclo lectivo!', width/2, height * 0.18);
    // Imagen de inicio centrada y más pequeña si la ventana es chica
    if (iniciobateriaImg) {
      let maxImgW = min(320, width * 0.48);
      let maxImgH = min(320, height * 0.48);
      let w = maxImgW;
      let h = maxImgH;
      image(iniciobateriaImg, width/2 - w/2, height * 0.28, w, h);
    }
    // Mensaje de inicio, más separado y legible
    textSize(30);
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    text('Presiona una tecla para comenzar', width/2, height * 0.82);
    return;
  }

  // Si está activo el evento de cajas, dibujar ese “modo” y salir
  if (eventoCajasActivo) {
    dibujarEventoCajas();
    return;
  }

  // Si hubo resultado (estamos en animación buena/mala o esperando Enter), manejar ahí
  if (resultadoCajas === 'buena' || resultadoCajas === 'mala') {
    dibujarAnimacionCajas();
    return;
  }
  if (resultadoCajas === 'esperandoEnterBuena' || resultadoCajas === 'esperandoEnterMala') {
    fill(0,150); rect(0, height-60, width, 60);
    fill(255); noStroke(); textAlign(CENTER, CENTER); textSize(22);
    stroke(0);
    strokeWeight(5);
    text('Después de la animación presiona Enter', width/2, height-30);
    noStroke();
    // noLoop(); // Nunca detener el loop global
    return;
  }

  // Scroll del fondo
  if (fondoImg) {
    image(fondoImg, fondoX, 0, width, height);
    image(fondoImg, fondoX + width, 0, width, height);
    fondoX -= 2;
    if (fondoX <= -width) fondoX = 0;
  }

  // Actualizar color de la “batería”
  if (carga > 150) bateriaColor = color(0,255,0);
  else if (carga > 80) bateriaColor = color(255,255,0);
  else if (carga > 30) bateriaColor = color(255,140,0);
  else bateriaColor = color(255,0,0);

  // Física simple
  if (!explotando) {
    velocidadY += 1; // gravedad
    personajeY += velocidadY;
    const base = height - personajeH - 20;
    if (personajeY > base) { personajeY = base; velocidadY = 0; enSuelo = true; }
    else enSuelo = false;
  }

  // Dibujar personaje
  let img = bateriaImg, w = personajeW, h = personajeH;
  if (estadoPersonaje === 'vocacion' && estadoFrames > 0) {
    img = vocacionImg; estadoFrames--; if (estadoFrames===0) estadoPersonaje='normal';
    w = personajeW * 1.13; h = personajeH * 1.13;
  } else if (estadoPersonaje === 'enojada' && estadoFrames > 0) {
    img = enojadaImg; estadoFrames--; if (estadoFrames===0) estadoPersonaje='normal';
    w = personajeW * 1.13; h = personajeH * 1.13;
  } else if (!enSuelo) {
    img = maestrasaltoImg;
    w = personajeW * 1.13; h = personajeH * 1.13;
  } else if (keyIsDown(RIGHT_ARROW)) {
    img = caminaImg;
    w = personajeW * 1.13; h = personajeH * 1.13;
  } else if (keyIsDown(LEFT_ARROW)) {
    img = atrasImg;
    w = personajeW * 1.13; h = personajeH * 1.13;
  } else if (keyIsDown(DOWN_ARROW)) {
    img = abajoImg; w = personajeW*0.8*1.13; h = personajeH*0.8*1.13;
  } else if (img === bateriaImg) {
    w = personajeW * 1.13; h = personajeH * 1.13;
  }
  tint(bateriaColor);
  const yOffset = keyIsDown(DOWN_ARROW) ? 60 : 0;
  image(img || bateriaImg, personajeX - (w-personajeW)/2, personajeY - (h-personajeH)/2 + yOffset, w, h);
  noTint();


  // Aumentar progresivamente la velocidad de los obstáculos
  // La velocidad base crece suavemente con el progreso
  let progreso = frameCount / 600; // cada 10 segundos aprox sube
  velocidadObstaculos = constrain(velocidadBase + progreso, velocidadBase, velocidadMax);
  // Obstáculos (dibujo + colisiones)
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    let obs = obstaculos[i];
    obs.vel = velocidadObstaculos;
    obs.x -= obs.vel;

    // Animación de ampliación y salida
    if (obs.animando) {
      let duracionAmpliacion = 40; // más frames para la ampliación
      let t = min(1, obs.animFrame / duracionAmpliacion);
      // Ampliar siempre hacia el costado derecho
      let destinoX = width - 120;
      let destinoY = height/2;
      let cx = lerp(obs.startX, destinoX, t);
      let cy = lerp(obs.startY, destinoY, t);
      let s = lerp(1.3, 4.2, t); // tamaño inicial y final un poco más grandes
      image(obs.img, cx - 90 * s/2, cy - 90 * s/2, 90 * s, 90 * s);
      obs.animFrame++;
      if (obs.animFrame > duracionAmpliacion && obs.animFrame <= duracionAmpliacion + 30) {
        // Salida volando hacia la derecha
        let t2 = (obs.animFrame - duracionAmpliacion) / 30;
        let salidaX = width + 200;
        let salidaY = -200;
        cx = lerp(destinoX, salidaX, t2);
        cy = lerp(destinoY, salidaY, t2);
        s = 3.5 - 1.5 * t2; // menos grande
        image(obs.img, cx - 90 * s/2, cy - 90 * s/2, 90 * s, 90 * s);
      }
      if (obs.animFrame > duracionAmpliacion + 30) {
        obstaculos.splice(i, 1);
      }
    }
    if (!obs.animando && obs.img) image(obs.img, obs.x - 65, obs.y - 65, 130, 130);
    if (!obs.animando && obs.x < -40) {
      obstaculos.splice(i, 1);
      contadorObstaculos++;
      continue;
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
        // En el aire: puede agarrar obstáculos altos, esquiva bajos
        if (obs.tipo === 'positivo') {
          // Obstáculo alto: puede agarrar si lo toca en el aire
          colisiona = (obs.x > personajeLeft && obs.x < personajeRight && obs.y > personajeTop && obs.y < personajeBottom);
        } else {
          // Obstáculo bajo: lo esquiva saltando
          colisiona = false;
        }
      } else if (agachado) {
        // Agachado: solo colisiona con obstáculos bajos
        if (obs.y > personajeBottom - 40) {
          // Obstáculo bajo, sí colisiona si pasa por la zona baja
          colisiona = (obs.x > personajeLeft && obs.x < personajeRight && obs.y > personajeBottom - 40 && obs.y < personajeBottom);
        } else {
          // Obstáculo alto, NO colisiona (esquiva)
          colisiona = false;
        }
      } else {
        // Parado: colisión con cualquier obstáculo que pase por la zona del cuerpo
        colisiona = (obs.x > personajeLeft && obs.x < personajeRight && obs.y > personajeTop && obs.y < personajeBottom);
      }
    }
    if (colisiona) {
      contadorObstaculos++;
      // Si se estaba ignorando la victoria/derrota, ahora se reactiva
      if (ignorarVictoriaDerrota) ignorarVictoriaDerrota = false;
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
  }

  // Generación periódica
  if (frameCount % 90 === 0) obstaculos.push(crearObstaculo());

  // Disparar el modo “cajas” según la secuencia 10, 15, 20...
  if (!eventoCajasActivo && !resultadoCajas && contadorObstaculos >= obstaculosParaCajas) {
    eventoCajasActivo = true;
    cajaSeleccionada = 0;
    // Avanzar en la secuencia y reiniciar si es necesario
    indiceSecuenciaCajas = (indiceSecuenciaCajas + 1) % secuenciaCajas.length;
    obstaculosParaCajas = secuenciaCajas[indiceSecuenciaCajas];
  }


  // Barra de carga
  dibujarBarra();

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

  // Derrota
  if (carga <= 0 && !explotando && !juegoGanado) {
    explotando = true;
    safeStop(musicaFondo);
    safePlay(sonidoExplosion, 1.0, false);
    particulas = [];
    for (let i=0;i<60;i++){
      const ang = map(i,0,60,0,TWO_PI);
      const vel = random(7,13);
      particulas.push({
        x: personajeX+personajeW/2,
        y: personajeY+personajeH/2,
        vx: cos(ang)*vel, vy: sin(ang)*vel,
        angulo: ang+random(-0.2,0.2),
        vida: 60, escala: random(1.2,1.6)
      });
    }
    window.derrotaTimer = millis();
    window.derrotaAnimacionActiva = true;
    window.juegoListoReiniciar = false;
    loop();
    return;
  }
  if (window.derrotaAnimacionActiva) {
    // Mostrar animación de rayos
    // ANIMACIÓN DE RAYOS DESDE EL CENTRO AL BORDE
    let duracionRayos = 900;
    let tRayo = constrain((millis() - window.derrotaTimer) / duracionRayos, 0, 1);
    background(0);
    if (fondoOscuroImg) image(fondoOscuroImg, 0, 0, width, height);
    let ripW = ripImg ? ripImg.width * 2.2 : 350;
    let ripH = ripImg ? ripImg.height * 2.2 : 200;
    let cx = width/2;
    let cy = height/2;
    let rayos = 48;
    for (let i = 0; i < rayos; i++) {
      let ang = map(i, 0, rayos, 0, TWO_PI) + random(-0.08, 0.08);
      let r1 = max(ripW, ripH)/2 + random(18, 60);
      let r2 = max(width, height) * random(0.7, 1.25);
      let x1 = cx + cos(ang) * r1;
      let y1 = cy + sin(ang) * r1;
      let x2 = cx + cos(ang) * r2;
      let y2 = cy + sin(ang) * r2;
      // Interpolación para animar del centro al borde
      let px = lerp(x1, x2, tRayo);
      let py = lerp(y1, y2, tRayo);
      let largo = dist(x1, y1, x2, y2) * (0.5 + 0.5 * tRayo);
      let escala = map(largo, 100, max(width, height), 0.7, 2.2);
      let rayoH = explosionImg ? explosionImg.height * escala : 30 * escala;
      let angulo = atan2(y2 - y1, x2 - x1);
      let alpha = map(1-tRayo, 0, 1, 0, 255);
      if (explosionImg) {
        push();
        translate(px, py);
        rotate(angulo);
        imageMode(CORNER);
        tint(255, alpha);
        image(explosionImg, 0, -rayoH/2, largo, rayoH);
        noTint();
        pop();
      } else {
        stroke(255, 255, 0, alpha);
        strokeWeight(random(3, 7));
        line(px, py, px + cos(ang) * largo, py + sin(ang) * largo);
      }
    }
    if (tRayo < 1) {
      return;
    }
    // FIN ANIMACIÓN RAYOS
    else {
      safePlay(sonidoExplosion, 1.0, false);
      if (fondoOscuroImg) image(fondoOscuroImg, 0, 0, width, height);
      // Imagen RIP más grande
      if (ripImg) {
        let ripW = ripImg.width * 2.2;
        let ripH = ripImg.height * 2.2;
        let cx = width/2;
        let cy = height/2;
        image(ripImg, cx - ripW/2, cy - ripH/2, ripW, ripH);
        // Texto arriba y abajo de RIP en estilo pixel, adaptado a ventana
        textFont('Press Start 2P', 24);
        fill(255);
        let margen = max(24, ripH * 0.12);
        let sizeArriba = constrain(width * 0.035, 18, 38);
        let sizeAbajo = constrain(width * 0.025, 14, 30);
        textAlign(CENTER, BOTTOM);
        textSize(sizeArriba);
        text('¡Mi cuerpo se apaga,', cx, cy - ripH/2 - margen);
        textAlign(CENTER, TOP);
        textSize(sizeAbajo);
        text('pero la vocación sigue encendida!', cx, cy + ripH/2 + margen*0.5);
      }
      safePlay(sonidoLatidoFin, 0.8, false);
      window.derrotaAnimacionActiva = false;
      window.juegoListoReiniciar = true;
      noLoop();
    }
    return;
  }

  // Victoria
  if (carga >= 200 && !juegoGanado && !explotando) {
    juegoGanado = true;
    safeStop(musicaFondo);
    safePlay(sonidoGanaste, 1.0, false);
    setTimeout(function(){ safePlay(corazonFondo, 1.0, false); }, 1200);
    window.animacionVictoriaActiva = true;
    window.corazonesVictoria = [];
    // Más corazones, de diferentes tamaños y dispersos por toda la ventana
    for (let i=0;i<60;i++){
      window.corazonesVictoria.push({
        x: width/2,
        y: height/2,
        vx: random(-10, 10),
        vy: random(-12, 12),
        escala: random(0.5, 1.7),
        alpha: 255,
        destinoX: random(0, width),
        destinoY: random(0, height)
      });
    }
    window.frameVictoria = 0;
    loop();
    return;
  }
  if (window.animacionVictoriaActiva) {
    background(0,180,80);
    // Mostrar imagen de ganar ajustada a la ventana
    if (ganarImg) {
      image(ganarImg, 0, 0, width, height);
    }
    // Animar corazones dispersos
    for (let c of window.corazonesVictoria) {
      if (window['img18']) {
        push();
        tint(255, c.alpha);
        image(window['img18'], c.x, c.y, 40*c.escala, 40*c.escala);
        pop();
      }
      // Movimiento hacia destino y desvanecimiento
      c.x += (c.destinoX - c.x) * 0.08 + c.vx * 0.2;
      c.y += (c.destinoY - c.y) * 0.08 + c.vy * 0.2;
      c.vx *= 0.92;
      c.vy *= 0.92;
      c.alpha -= 2.5;
      if (c.alpha < 0) c.alpha = 0;
    }
    window.frameVictoria++;
  // Mostrar texto motivacional en dos líneas, pequeño, blanco con borde negro, sin burbuja
  let mensaje1 = '¡La energía no viene del sistema,';
  let mensaje2 = 'sino de mi pasión!';
  let fontSize = Math.floor(constrain(width*0.018, 10, 24));
  textAlign(CENTER, BOTTOM);
  textFont('Press Start 2P', 24);
  textSize(fontSize);
  stroke(0);
  strokeWeight(5);
  fill(255);
  text(mensaje1, width/2, height - 54);
  text(mensaje2, width/2, height - 28);
  noStroke();
  // Mensaje de reinicio con borde negro
  textAlign(CENTER, BOTTOM);
  textFont('Press Start 2P', 24);
  let reinicioSize = Math.floor(constrain(width*0.013, 8, fontSize - 2));
  textSize(reinicioSize);
  stroke(0);
  strokeWeight(5);
  fill('#ff5eaa');
  text('Presiona cualquier letra para volver a jugar', width/2, height-8);
  noStroke();
  textFont('monospace');
    // Termina animación tras unos segundos
    if (window.frameVictoria > 80) {
      window.animacionVictoriaActiva = false;
      window.juegoListoReiniciar = true;
      noLoop();
    }
    return;
  }
}

/* ========== 
   DIBUJADO AUXILIAR
   ========== */
function dibujarBarra() {
  const bx=10, by=10, bw=400, bh=28;
  fill(50); rect(bx,by,bw,bh);
  fill(bateriaColor); rect(bx,by, map(carga,0,200,0,bw), bh);
  const pct = int(map(carga,0,200,0,100));
  textAlign(CENTER,CENTER); textSize(18); fill(0); stroke(255); strokeWeight(2);
  text(pct+'%', bx+bw/2, by+bh/2+1);
}

function dibujarEventoCajas() {
  background(0,120,200);

  // Texto
  textAlign(CENTER,TOP); textSize(22); fill(255); stroke(0); strokeWeight(4);
  const msg = 'Con las flechas izquierda y derecha seleccioná una caja. ENTER para elegir.';
  text(msg, width/2, 20);

  const cajaW=180,cajaH=180;
  const x1=width/2-200, y1=height/2-90;
  const x2=width/2+20,  y2=height/2-90;

  // Resalte
  noStroke();
  if (cajaSeleccionada===0) { fill(255,255,0,90); rect(x1-12,y1-12,cajaW+24,cajaH+24,20); }
  if (cajaSeleccionada===1) { fill(255,255,0,90); rect(x2-12,y2-12,cajaW+24,cajaH+24,20); }

  // Cajas
  if (cajabuenaImg) image(cajabuenaImg,x1,y1,cajaW,cajaH); else { fill(80,200,120); rect(x1,y1,cajaW,cajaH,18); }
  if (cajamalaImg)  image(cajamalaImg,x2,y2,cajaW,cajaH);  else { fill(200,80,80);  rect(x2,y2,cajaW,cajaH,18); }
}

function dibujarAnimacionCajas() {
  // Buena = animación de marcha docente acercándose y otras a los lados
  if (resultadoCajas === 'buena') {
    background(0,120,200);
    safeStop(musicaFondo);
    if (animacionMarchaFrames === 0) safePlay(audioMarchaDocente, 1.0, false);
    let totalFrames = 60;
    if (audioMarchaDocente && audioMarchaDocente.duration()) {
      totalFrames = int(audioMarchaDocente.duration() * 60); // 60 fps
    }
    if (marchandoImg) {
      // Imagen central acercándose
      let t = constrain(animacionMarchaFrames/totalFrames, 0, 1);
      let escala = lerp(1.0, 2.2, t);
      let y = lerp(height/2, height/2 + 60, t);
      let w = marchandoImg.width * escala;
      let h = marchandoImg.height * escala;
      image(marchandoImg, width/2 - w/2, y - h/2, w, h);
      // Otras imágenes a los lados, más pequeñas y retrasadas
      for (let i = 1; i <= 2; i++) {
        let tL = constrain((animacionMarchaFrames - i*8)/totalFrames, 0, 1);
        if (tL > 0) {
          let escalaL = lerp(0.7, 1.1, tL);
          let xL = lerp(width/2 - 120*i, width/2 - 180*i, tL);
          let yL = lerp(height/2, height/2 + 60, tL);
          let wL = marchandoImg.width * escalaL;
          let hL = marchandoImg.height * escalaL;
          image(marchandoImg, xL - wL/2, yL - hL/2, wL, hL);
        }
        let tR = constrain((animacionMarchaFrames - i*8)/totalFrames, 0, 1);
        if (tR > 0) {
          let escalaR = lerp(0.7, 1.1, tR);
          let xR = lerp(width/2 + 120*i, width/2 + 180*i, tR);
          let yR = lerp(height/2, height/2 + 60, tR);
          let wR = marchandoImg.width * escalaR;
          let hR = marchandoImg.height * escalaR;
          image(marchandoImg, xR - wR/2, yR - hR/2, wR, hR);
        }
      }
    }
    // Texto debajo
    fill(0,150); rect(0, height-60, width, 60);
  textAlign(CENTER, CENTER); textSize(22);
  stroke(0);
  strokeWeight(5);
  fill(255);
  text('Luego de la animación presiona Enter para continuar', width/2, height-30);
  noStroke();
    animacionMarchaFrames++;
    if (animacionMarchaFrames >= totalFrames + 36) {
      resultadoCajas = 'esperandoEnterBuena';
      animacionMarchaFrames = 0;
    }
    return;
  }

  // Mala = papeles superpuestos de diferentes tamaños y posiciones, sincronizados con el sonido
  if (resultadoCajas === 'mala') {
    background(220);
    let totalFrames = 60;
    if (audioAgotamiento && audioAgotamiento.duration()) {
      totalFrames = int(audioAgotamiento.duration() * 60);
    }
    if (animacionPapelesFrames === 0) safePlay(audioAgotamiento, 1.0, false);
    if (papelesImg) {
      randomSeed(42); // Para que la secuencia de posiciones sea igual cada vez
      for (let i = 0; i < 18; i++) {
        let t = constrain((animacionPapelesFrames - i*5)/totalFrames, 0, 1);
        if (t <= 0) continue;
        // Comienzan más chicos y crecen más lento, para dar efecto de acumulación
        let escalaBase = lerp(0.18, 1.5, t) * random(0.8, 1.15);
        let w = papelesImg.width * escalaBase;
        let h = papelesImg.height * escalaBase;
        let x = random(-w/2, width - w/2);
        let y = random(-h/2, height - h/2);
        image(papelesImg, x, y, w, h);
      }
    }
    // Texto debajo
    fill(0,150); rect(0, height-60, width, 60);
  textAlign(CENTER, CENTER); textSize(22);
  stroke(0);
  strokeWeight(5);
  fill(255);
  text('Luego de la animación presiona Enter para continuar', width/2, height-30);
  noStroke();
    animacionPapelesFrames++;
    if (animacionPapelesFrames >= totalFrames + 35) {
      resultadoCajas = 'esperandoEnterMala';
      animacionPapelesFrames = 0;
    }
    return;
  }
}

/* ========== 
   OBSTÁCULOS / DERROTA
   ========== */

function crearObstaculo() {
  let tipo = random() > 0.5 ? 'positivo' : 'negativo';
  let img = tipo === 'positivo' ? random(positivosImgs) : random(negativosImgs);
  let y;
  if (tipo === 'positivo') {
    // Obstáculo alto: para saltar (más cerca del suelo, no tan arriba)
    y = random(height - personajeH - 40, height - personajeH - 10);
    y = constrain(y, height - personajeH - 40, height - personajeH - 10);
  } else {
    // Obstáculo bajo: para agacharse
    y = random(height - 90, height - 60);
    y = constrain(y, height - 90, height - 60);
  }
  return {
    x: width + 30,
    y: y,
    tipo: tipo,
    img: img,
    animando: false,
    scale: 1,
    dir: 1,
    vel: velocidadObstaculos
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

function iniciarDerrota() {
  explotando = true;
  particulas = [];
  for (let i=0;i<100;i++){
    const ang = map(i,0,100,0,TWO_PI);
    const vel = random(7,13);
    particulas.push({
      x: personajeX+personajeW/2,
      y: personajeY+personajeH/2,
      vx: cos(ang)*vel, vy: sin(ang)*vel,
      angulo: ang+random(-0.2,0.2),
      vida: 60, escala: random(1.2,1.6)
    });
  }
  safePlay(sonidoExplosion, 1.0, false);
  safeStop(musicaFondo);
  safePlay(sonidoFin, 1.0, false);
  safePlay(sonidoLatidoFin, 0.1, true);
}

/* ========== 
   INPUT
   ========== */
let audioMarchaDocenteStarted = false;

function keyPressed() {
  // Reinicia el estado del juego completamente
  function reiniciarJuego() {
    fondoX = 0;
    carga = 100;
    obstaculos = [];
    personajeX = 30;
    personajeY = height - personajeH - 20;
    velocidadY = 0;
    enSuelo = true;
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
    window.animacionVictoriaActiva = false;
    window.juegoListoReiniciar = false;
    obstaculos.push(crearObstaculo());
    if (corazonFondo && corazonFondo.isPlaying()) corazonFondo.stop();
    if (sonidoLatidoFin && sonidoLatidoFin.isPlaying()) sonidoLatidoFin.stop();
    if (sonidoCampana) { sonidoCampana.setVolume(0.2); sonidoCampana.play(); }
    if (musicaFondo && !musicaFondo.isPlaying()) { musicaFondo.setVolume(0.2); musicaFondo.loop(); }
    juegoIniciado = true;
    loop();
  }
  // Reanudar audio por autoplay
  try {
    const ac = getAudioContext?.();
    if (ac && ac.state !== 'running') ac.resume();
  } catch(e){}

  // --- Evento especial de cajas ---
  if (eventoCajasActivo) {
    if (resultadoCajas) return;
    if (keyCode === LEFT_ARROW) { cajaSeleccionada = 0; redraw(); return; }
    if (keyCode === RIGHT_ARROW) { cajaSeleccionada = 1; redraw(); return; }
    if (keyCode === ENTER || keyCode === 32) {
      if (cajaSeleccionada === 0) { resultadoCajas = 'buena'; eventoCajasActivo = false; animacionMarchaFrames = 0; loop(); return; }
      if (cajaSeleccionada === 1) { resultadoCajas = 'mala'; eventoCajasActivo = false; animacionPapelesFrames = 0; loop(); return; }
    }
    return;
  }
  if ((resultadoCajas === 'buena' || resultadoCajas === 'mala') && keyCode === ENTER) {
    if (resultadoCajas === 'buena' && audioMarchaDocente && audioMarchaDocente.isPlaying()) audioMarchaDocente.stop();
    if (resultadoCajas === 'mala' && audioAgotamiento && audioAgotamiento.isPlaying()) audioAgotamiento.stop();
    if (resultadoCajas === 'buena') { carga = min(199, carga + 180); resultadoCajas = 'esperandoEnterBuena'; }
    else if (resultadoCajas === 'mala') { carga = max(1, carga - 180); resultadoCajas = 'esperandoEnterMala'; }
    animacionMarchaFrames = 0; animacionPapelesFrames = 0; loop(); return;
  }
  if ((resultadoCajas === 'esperandoEnterBuena' || resultadoCajas === 'esperandoEnterMala') && keyCode === ENTER) {
    resultadoCajas = null; animacionMarchaFrames = 0; animacionPapelesFrames = 0; eventoCajasActivo = false; cajaSeleccionada = 0; contadorObstaculos = 0; carga = 100; ignorarVictoriaDerrotaFrames = 30;
    // No cambiar la secuencia aquí, ya se avanza cuando aparece la caja
    if (musicaFondo && !musicaFondo.isPlaying()) { musicaFondo.setVolume(0.2); musicaFondo.loop(); }
    loop(); return;
  }
  if (!juegoIniciado) {
    fondoX = 0; carga = 100; obstaculos = []; personajeX = 30; personajeY = height - personajeH - 20; velocidadY = 0; enSuelo = true; explotando = false; explosionFrame = 0; particulas = []; juegoGanado = false; estadoPersonaje = "normal"; estadoFrames = 0; animFrame = 0; velocidadObstaculos = 4; progresoJuego = 0; contadorObstaculos = 0; eventoCajasActivo = false; resultadoCajas = null; animacionMarchaFrames = 0; animacionPapelesFrames = 0; window.animacionVictoriaActiva = false; window.juegoListoReiniciar = false; obstaculos.push(crearObstaculo()); juegoIniciado = true;
    if (musicaFondo && !musicaFondo.isPlaying()) { musicaFondo.setVolume(0.2); musicaFondo.loop(); }
    return;
  }
  // Si terminó por victoria o derrota (incluye animación de victoria)
  if (juegoGanado || explotando || window.juegoListoReiniciar) {
    window.animacionVictoriaActiva = false;
    window.juegoListoReiniciar = false;
    reiniciarJuego();
    return;
  }
  if (keyCode === UP_ARROW && enSuelo) velocidadY = -28;
  if (keyCode === RIGHT_ARROW) personajeX = min(width - personajeW, personajeX + 20);
  if (keyCode === LEFT_ARROW) personajeX = max(0, personajeX - 20);
  if (keyCode === DOWN_ARROW) personajeY = min(height - personajeH - 20, personajeY + 20);
  // Reinicio tras perder o ganar: cualquier letra
  if ((carga <= 0 || explotando || juegoGanado) && key.length === 1 && key.match(/[a-zA-Z]/)) {
    fondoX = 0; carga = 100; obstaculos = []; personajeX = 30; personajeY = height - personajeH - 20; velocidadY = 0; enSuelo = true; explotando = false; explosionFrame = 0; particulas = []; juegoGanado = false; estadoPersonaje = "normal"; estadoFrames = 0; animFrame = 0; velocidadObstaculos = velocidadBase; progresoJuego = 0; contadorObstaculos = 0; eventoCajasActivo = false; resultadoCajas = null; animacionMarchaFrames = 0; animacionPapelesFrames = 0; obstaculos.push(crearObstaculo()); loop(); if (corazonFondo && corazonFondo.isPlaying()) corazonFondo.stop(); if (sonidoLatidoFin && sonidoLatidoFin.isPlaying()) sonidoLatidoFin.stop(); if (sonidoCampana) { sonidoCampana.setVolume(0.2); sonidoCampana.play(); } if (musicaFondo && !musicaFondo.isPlaying()) { musicaFondo.setVolume(0.2); musicaFondo.loop(); } return;
  }
}

/* ========== 
   REDIMENSIÓN
   ========== */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ...código robusto y minimalista ya presente arriba...

