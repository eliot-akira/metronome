
// Transport

module.exports = {

  start({ state, setState, master }) {
    if (state.isPlaying) return
    if (state.isPaused) {
      master.transport.start()
      return
    }
    setState({
      beat: 0,
      isPlaying: true, isPaused: false, isStopped: false
    })
    master.transport.start(master.loop)
  },

  pause({ state, setState, master }) {
    if (!state.isPlaying) return
    master.transport.pause()
    setState({
      isPlaying: false, isPaused: true, isStopped: true
    })
  },

  stop({ state, setState, master }) {
    master.transport.stop()
    setState({
      beat: 0,
      isPlaying: false, isPaused: false, isStopped: true
    })
  },

  setTempo({ setState, tempo }, arg) {
    tempo = tempo || arg
    if (!tempo || tempo < 5 || tempo > 300) return
    setState({ tempo })
  }
}
