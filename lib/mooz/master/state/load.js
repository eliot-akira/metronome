// Load

// Async load actions will push promises here
let loading = []

module.exports = {

  pushLoading({ promise }) {
    loading.push(promise)
  },

  // Call this after all load methods

  awaitLoad() {
    return Promise.all(loading).then(() => {
      loading = []
    })
  }
}
