# Metronome

See [example](https://eliot-akira.github.io/metronome/).

## Install

Web - Use minified script: [docs/metronome.min.js](docs/metronome.min.js)

```html
<script type="text/javascript" src="metronome.min.js"></script>
```

This exports the module as a global variable `metronome`.

## Use

### Player

```js
metronome.start()
metronome.pause()
metronome.stop()
```

### Settings

```js
metronome.setVolume(0)
metronome.setTempo(80)
```

### Events

```js
metronome.on('beat', function(event) {
  const pos = event.position
  console.log('Total beat count', pos.totalBeats)
  console.log('Bar count', pos.bars)
  console.log('Beat count', pos.beats)
})

metronome.on('play', function() {
  console.log('Start playing')
})

metronome.on('play', function() {
  console.log('Stopped')
})
```


## Develop

Clone repo

```bash
git clone https://github.com/eliot-akira/metronome
cd metronome
```

Install dependencies

```bash
npm install
```

Build for development and watch files for changes

```bash
npm run dev
```

Build for production

```bash
npm run build
```
