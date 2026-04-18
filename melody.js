/**

- 🎵 MaloMelody.js — tout à la racine
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

const NOTES = {
C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00,B4:493.88,
C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880.00,B5:987.77,
C6:1046.50,D6:1174.66,E6:1318.51,_:0
};

function playNote(freq, startTime, duration, volume=0.16, type=‘sine’) {
if (!freq) return;
const c = getCtx();
const osc = c.createOscillator();
const gain = c.createGain();
const filter = c.createBiquadFilter();
filter.type = ‘lowpass’; filter.frequency.value = 2200;
osc.type = type; osc.frequency.value = freq;
osc.connect(filter); filter.connect(gain); gain.connect(c.destination);
gain.gain.setValueAtTime(0, startTime);
gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
gain.gain.setValueAtTime(volume, startTime + duration - 0.05);
gain.gain.linearRampToValueAtTime(0, startTime + duration);
osc.start(startTime); osc.stop(startTime + duration + 0.01);
currentNodes.push(osc);
}

function playSequence(sequence, bpm=120, loop=true, volume=0.16) {
stop(); isPlaying = true;
const c = getCtx();
const beat = 60 / bpm;
function scheduleOnce(offset) {
let t = offset, total = 0;
sequence.forEach(([note, beats]) => {
const dur = beats * beat;
playNote(NOTES[note] || 0, c.currentTime + t, dur * 0.88, volume);
t += dur; total += dur;
});
return total;
}
const dur = scheduleOnce(0);
if (loop) {
let n = 0;
function doLoop() {
if (!isPlaying) return;
n++; scheduleOnce(n * dur);
setTimeout(doLoop, (n * dur - 0.5) * 1000);
}
setTimeout(doLoop, (dur - 0.5) * 1000);
}
}

function stop() {
isPlaying = false;
currentNodes.forEach(n => { try { n.stop(); } catch(e){} });
currentNodes = [];
}

const MELODIES = {
menu: { bpm:110, seq:[
[‘C5’,.5],[‘E5’,.5],[‘G5’,.5],[‘C6’,1],
[‘B5’,.5],[‘G5’,.5],[‘E5’,.5],[‘C5’,1],
[‘D5’,.5],[‘F5’,.5],[‘A5’,.5],[‘G5’,1],
[‘E5’,.5],[‘C5’,.5],[‘D5’,.5],[‘C5’,2]
]},
bulles: { bpm:130, seq:[
[‘C5’,.25],[‘E5’,.25],[‘G5’,.25],[‘C6’,.25],
[‘B5’,.25],[‘G5’,.25],[‘E5’,.25],[‘C5’,.25],
[‘D5’,.25],[‘F5’,.25],[‘A5’,.25],[‘D6’,.25],
[‘C6’,.25],[‘A5’,.25],[‘F5’,.25],[‘D5’,.25],
[‘E5’,.25],[‘G5’,.25],[‘B5’,.25],[‘E6’,.25],
[‘D6’,.25],[‘B5’,.25],[‘G5’,.25],[‘E5’,.25],
[‘C5’,.5],[‘E5’,.5],[‘G5’,.5],[‘C6’,1]
]},
animaux: { bpm:100, seq:[
[‘G4’,1],[‘A4’,1],[‘B4’,1],[‘C5’,1],
[‘D5’,1],[‘E5’,1],[‘D5’,2],
[‘C5’,1],[‘B4’,1],[‘A4’,1],[‘G4’,2],
[‘E4’,1],[‘G4’,1],[‘F4’,1],[‘E4’,2]
]},
puzzle: { bpm:90, seq:[
[‘E5’,.5],[‘D5’,.5],[‘C5’,1],[‘E5’,1],
[‘G5’,.5],[‘F5’,.5],[‘E5’,2],
[‘D5’,.5],[‘E5’,.5],[‘F5’,1],[‘D5’,1],
[‘C5’,.5],[‘D5’,.5],[‘E5’,2]
]},
comptines: { bpm:95, seq:[
[‘C5’,1],[‘C5’,1],[‘C5’,1],[‘D5’,1],
[‘E5’,2],[‘D5’,2],
[‘C5’,1],[‘E5’,1],[‘D5’,1],[‘D5’,1],
[‘C5’,4],
[‘E5’,1],[‘E5’,1],[‘E5’,1],[‘F5’,1],
[‘G5’,2],[‘G5’,2],
[‘F5’,1],[‘E5’,1],[‘D5’,1],[‘C5’,1],
[‘G4’,4]
]},
marin: { bpm:85, seq:[
[‘A4’,1],[‘C5’,1],[‘E5’,1],[‘G5’,1],
[‘F5’,.5],[‘E5’,.5],[‘D5’,1],[‘C5’,2],
[‘G4’,1],[‘B4’,1],[‘D5’,1],[‘F5’,1],
[‘E5’,.5],[‘D5’,.5],[‘C5’,1],[‘A4’,2]
]},
cuisine: { bpm:115, seq:[
[‘C5’,.5],[‘D5’,.5],[‘E5’,.5],[‘C5’,.5],
[‘E5’,.5],[‘C5’,.5],[‘E5’,1],
[‘F5’,.5],[‘G5’,.5],[‘F5’,.5],[‘E5’,.5],
[‘D5’,.5],[‘C5’,.5],[‘D5’,1],
[‘C5’,.5],[‘B4’,.5],[‘A4’,.5],[‘G4’,.5],
[‘C5’,2]
]},
tracteur: { bpm:125, seq:[
[‘G4’,.5],[‘G4’,.5],[‘D5’,.5],[‘D5’,.5],
[‘E5’,.5],[‘E5’,.5],[‘D5’,1],
[‘C5’,.5],[‘C5’,.5],[‘B4’,.5],[‘B4’,.5],
[‘A4’,.5],[‘A4’,.5],[‘G4’,1],
[‘G4’,.5],[‘A4’,.5],[‘B4’,.5],[‘G4’,.5],
[‘C5’,2]
]}
};

function play(name) {
const m = MELODIES[name];
if (!m) return;
playSequence(m.seq, m.bpm, true, 0.15);
}

function playOnce(name) {
const m = MELODIES[name];
if (!m) return;
playSequence(m.seq, m.bpm, false, 0.2);
}

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
osc.start(c.currentTime); osc.stop(c.currentTime + 0.22);
}

function playSuccess() {
const c = getCtx();
[523,659,784].forEach((f,i) => {
const osc = c.createOscillator();
const gain = c.createGain();
osc.connect(gain); gain.connect(c.destination);
osc.frequency.value = f; osc.type = ‘sine’;
gain.gain.setValueAtTime(0.2, c.currentTime + i*.12);
gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i*.12 + .3);
osc.start(c.currentTime + i*.12);
osc.stop(c.currentTime + i*.12 + .35);
});
}

function playBravo() {
const c = getCtx();
[523,659,784,1047].forEach((f,i) => {
const osc = c.createOscillator();
const gain = c.createGain();
osc.connect(gain); gain.connect(c.destination);
osc.frequency.value = f; osc.type = ‘sine’;
gain.gain.setValueAtTime(0.2, c.currentTime + i*.15);
gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + i*.15 + .4);
osc.start(c.currentTime + i*.15);
osc.stop(c.currentTime + i*.15 + .45);
});
}

return { play, playOnce, stop, playPop, playSuccess, playBravo };
})();

if (‘serviceWorker’ in navigator) {
window.addEventListener(‘load’, () => {
navigator.serviceWorker.register(‘sw.js’).catch(() => {});
});
}
