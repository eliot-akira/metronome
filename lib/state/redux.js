// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/

const key = '__REDUX_DEVTOOLS_EXTENSION__'

const ReduxDevTools =
  process.env.NODE_ENV!=='production'
  && typeof window !== 'undefined'
  && window[key]
    ? window[key] : null

module.exports = function connectReduxDevTools(name, store) {

  if (!ReduxDevTools) return

  if (typeof name==='object') {
    name = 'App'
    store = name
  }

  const options = { serialize: true }
  const broadcaster = ReduxDevTools.connect({ name })

  broadcaster.init(store.getState())

  store.on('action', ({ name, props, state }) => {
    broadcaster.send({ type: name, ...props },
      state, options, name
    )
  })
}