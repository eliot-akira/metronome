
// Single instance of AudioContext

let context

module.exports = function getAudioContext() {

  if (!context) {
    try {
      context = new (
        window.AudioContext || window.webkitAudioContext
      )
    } catch (e) { /**/ }
  }

  return context
}