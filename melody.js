/**

- 🎵 MaloMelody.js
- Mélodies d’enfants générées en Web Audio API
- Pas de fichiers MP3 nécessaires - tout en pur JS !
  */

window.MaloMelody = (() => {
let ctx = null;
let currentNodes = [];
let isPlaying = false;

function getCtx() {
if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
if (ctx.state === ‘suspended’) ctx.resume();
return ctx;
}

// Fréquences des notes (octave 4 et 5)
const NOTES = {
C4:261.63, D4:293.66, E4:329.63, F4:349.23,
G4:392.00, A4:440.00, B4:493.88,
C5:523.25, D5:587.33, E5:659.25, F5:698.46,
G5:783.99, A5:880.00, B5:987.77,
C6:1046.50, _:0
};

// Joue une note
function playNote(freq, startTime, duration, volume=0.18, type=‘sine’) {
if (freq === 0) return;
const c = getCtx();
const osc = c.createOscillator();
const gain = c.createGain();
const filter = c.createBiquadFilter();

```
filter.type = 'lowpass';
filter.frequency.value = 2000;

osc.type = type;
osc.frequency.value = freq;
osc.connect(filter);
filter.connect(gain);
gain.connect(c.destination);

gain.gain.setValueAtTime(0, startTime);
gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
gain.gain.setValueAtTime(volume, startTime + duration - 0.05);
gain.gain.linearRampToValueAtTime(0, startTime + duration);

osc.start(startTime);
osc.stop(startTime + duration + 0.01);
currentNodes.push(osc);
```

}

// Joue une séquence [ [note, durée], … ]
function playSequence(sequence, bpm=120, loop=true, volume=0.18, onEnd=null) {
stop();
isPlaying = true;
const c = getCtx();
const beatDur = 60 / bpm;

```
function scheduleOnce(startOffset) {
  let t = startOffset;
  let totalDur = 0;
  sequence.forEach(([note, beats]) => {
    const dur = beats * beatDur;
    playNote(NOTES[note] || 0, c.currentTime + t, dur * 0.88, volume);
    t += dur;
    totalDur += dur;
  });
  return totalDur;
}

const dur = scheduleOnce(0);

if (loop) {
  // Re-schedule en boucle
  let loopCount = 0;
  function doLoop() {
    if (!isPlaying) return;
    loopCount++;
    scheduleOnce(loopCount * dur);
    setTimeout(doLoop, (loopCount * dur - 0.5) * 1000);
  }
  setTimeout(doLoop, (dur - 0.5) * 1000);
} else if (onEnd) {
  setTimeout(onEnd, dur * 1000);
}
```

}

function stop() {
isPlaying = false;
currentNodes.forEach(n => { try { n.stop(); } catch(e){} });
currentNodes = [];
}

// =============================
// 🎵 MÉLODIES PAR PAGE
// =============================

const MELODIES = {

```
// 🌍 Menu principal — "Joyeux et accueillant"
menu: {
  bpm: 110,
  sequence: [
    ['C5',0.5],['E5',0.5],['G5',0.5],['C6',1],
    ['B5',0.5],['G5',0.5],['E5',0.5],['C5',1],
    ['D5',0.5],['F5',0.5],['A5',0.5],['G5',1],
    ['E5',0.5],['C5',0.5],['D5',0.5],['C5',2],
  ]
},

// 🐘 Animaux — "Promenons-nous dans les bois" (mélodie inspirée)
animaux: {
  bpm: 100,
  sequence: [
    ['G4',1],['A4',1],['B4',1],['C5',1],
    ['D5',1],['E5',1],['D5',2],
    ['C5',1],['B4',1],['A4',1],['G4',2],
    ['E4',1],['G4',1],['F4',1],['E4',2],
  ]
},

// 🧩 Puzzle — "Douce et concentrée"
puzzle: {
  bpm: 90,
  sequence: [
    ['E5',0.5],['D5',0.5],['C5',1],['E5',1],
    ['G5',0.5],['F5',0.5],['E5',2],
    ['D5',0.5],['E5',0.5],['F5',1],['D5',1],
    ['C5',0.5],['D5',0.5],['E5',2],
  ]
},

// 🎵 Comptines — "Au clair de la lune"
comptines: {
  bpm: 95,
  sequence: [
    ['C5',1],['C5',1],['C5',1],['D5',1],
    ['E5',2],['D5',2],
    ['C5',1],['E5',1],['D5',1],['D5',1],
    ['C5',4],
    ['E5',1],['E5',1],['E5',1],['F5',1],
    ['G5',2],['G5',2],
    ['F5',1],['E5',1],['D5',1],['C5',1],
    ['G4',4],
  ]
},

// 🐠 Marin — "Douce et ondulante"
marin: {
  bpm: 85,
  sequence: [
    ['A4',1],['C5',1],['E5',1],['G5',1],
    ['F5',0.5],['E5',0.5],['D5',1],['C5',2],
    ['G4',1],['B4',1],['D5',1],['F5',1],
    ['E5',0.5],['D5',0.5],['C5',1],['A4',2],
    ['C5',0.5],['D5',0.5],['E5',1],['A5',1],
    ['G5',0.5],['F5',0.5],['E5',2],
    ['D5',1],['C5',1],['B4',1],['A4',2],
  ]
},

// 🍎 Cuisine — "Brioche et joyeuse"
cuisine: {
  bpm: 115,
  sequence: [
    ['C5',0.5],['D5',0.5],['E5',0.5],['C5',0.5],
    ['E5',0.5],['C5',0.5],['E5',1],
    ['F5',0.5],['G5',0.5],['F5',0.5],['E5',0.5],
    ['D5',0.5],['C5',0.5],['D5',1],
    ['G4',0.5],['A4',0.5],['B4',0.5],['C5',0.5],
    ['D5',0.5],['E5',0.5],['D5',1],
    ['C5',0.5],['B4',0.5],['A4',0.5],['G4',0.5],
    ['C5',2],
  ]
},

// 🚜 Tracteur — "Rythmée et aventureuse"
tracteur: {
  bpm: 125,
  sequence: [
    ['G4',0.5],['G4',0.5],['D5',0.5],['D5',0.5],
    ['E5',0.5],['E5',0.5],['D5',1],
    ['C5',0.5],['C5',0.5],['B4',0.5],['B4',0.5],
    ['A4',0.5],['A4',0.5],['G4',1],
    ['D5',0.5],['D5',0.5],['C5',0.5],['C5',0.5],
    ['B4',0.5],['B4',0.5],['A4',1],
    ['G4',0.5],['A4',0.5],['B4',0.5],['G4',0.5],
    ['C5',2],
  ]
},

// 🫧 Bulles — "Légère et pétillante"
bulles: {
  bpm: 130,
  sequence: [
    ['C5',0.25],['E5',0.25],['G5',0.25],['C6',0.25],
    ['B5',0.25],['G5',0.25],['E5',0.25],['C5',0.25],
    ['D5',0.25],['F5',0.25],['A5',0.25],['D6',0.25],
    ['C6',0.25],['A5',0.25],['F5',0.25],['D5',0.25],
    ['E5',0.25],['G5',0.25],['B5',0.25],['E6',0.25],
    ['D6',0.25],['B5',0.25],['G5',0.25],['E5',0.25],
    ['C5',0.5],['E5',0.5],['G5',0.5],['C6',1],
  ]
},

// 🎉 Bravo ! (son de victoire)
bravo: {
  bpm: 160,
  loop: false,
  sequence: [
    ['C5',0.5],['E5',0.5],['G5',0.5],
    ['C6',0.5],['E6',0.5],
    ['G5',0.25],['C6',0.25],['E6',0.25],['G6',1],
  ]
},

// 💫 Pop bulle (court)
pop: {
  bpm: 200,
  loop: false,
  sequence: [
    ['C6',0.25],['G5',0.25],['E5',0.25],['C5',0.25],
  ]
}
```

};

// Lance une mélodie par nom de page
function play(name, loop=true) {
const m = MELODIES[name];
if (!m) return;
playSequence(m.sequence, m.bpm, m.loop !== undefined ? m.loop : loop, 0.16);
}

// Son court (bravo, pop, etc.)
function playOnce(name, onEnd=null) {
const m = MELODIES[name];
if (!m) return;
playSequence(m.sequence, m.bpm, false, 0.22, onEnd);
}

// Son de pop pour bulle
function playPop(pitch=1) {
const c = getCtx();
const osc = c.createOscillator();
const gain = c.createGain();
osc.connect(gain); gain.connect(c.destination);
osc.type = ‘sine’;
osc.frequency.setValueAtTime(800 * pitch, c.currentTime);
osc.frequency.exponentialRampToValueAtTime(200 * pitch, c.currentTime + 0.15);
gain.gain.setValueAtTime(0.25, c.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
osc.start(c.currentTime);
osc.stop(c.currentTime + 0.2);
}

// Son de succès (forme bien placée)
function playSuccess() {
const c = getCtx();
[523, 659, 784].forEach((f, i) => {
const osc = c.createOscillator();
const gain = c.createGain();
osc.connect(gain); gain.connect(c.destination);
osc.frequency.value = f;
osc.type = ‘sine’;
gain.gain.setValueAtTime(0.2, c.currentTime + i*0.12);
gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i*0.12 + 0.3);
osc.start(c.currentTime + i*0.12);
osc.stop(c.currentTime + i*0.12 + 0.35);
});
}

// Son d’animal (grave ou aigu selon l’animal)
function playAnimalSound(type) {
const c = getCtx();
const sounds = {
lion:     [[150,0.3,‘sawtooth’],[120,0.4,‘sawtooth’],[90,0.5,‘sawtooth’]],
elephant: [[80,0.4,‘sawtooth’],[60,0.5,‘sawtooth’]],
chat:     [[600,0.1,‘sine’],[800,0.1,‘sine’],[600,0.15,‘sine’]],
chien:    [[400,0.08,‘square’],[300,0.08,‘square’],[400,0.1,‘square’]],
vache:    [[120,0.3,‘sawtooth’],[100,0.5,‘sawtooth’]],
grenouille:[[300,0.05,‘square’],[300,0.05,‘square’]],
oiseau:   [[1200,0.08,‘sine’],[1400,0.08,‘sine’],[1200,0.1,‘sine’]],
poisson:  [[400,0.05,‘sine’],[500,0.05,‘sine’]],
};
const s = sounds[type] || sounds.oiseau;
let t = c.currentTime;
s.forEach(([freq, dur, type2]) => {
const osc = c.createOscillator();
const gain = c.createGain();
osc.connect(gain); gain.connect(c.destination);
osc.frequency.value = freq;
osc.type = type2;
gain.gain.setValueAtTime(0.2, t);
gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
osc.start(t); osc.stop(t + dur + 0.01);
t += dur;
});
}

return { play, playOnce, stop, playPop, playSuccess, playAnimalSound, playNote, getCtx };
})();

// Enregistrement Service Worker PWA
if (‘serviceWorker’ in navigator) {
window.addEventListener(‘load’, () => {
navigator.serviceWorker.register(’/sw.js’).catch(() => {});
});
}
