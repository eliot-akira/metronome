const createEmitter = require('../emitter')

module.exports = function createStore(props = {}) {

  const store = createEmitter()

  // State

  const state = {}

  const getState = key => key ? state[key] : state
  const setState = (newState = {}, options = {}) => {

    if (options.reset) {
      // Keep reference to same object
      Object.keys(state).forEach(key => delete state[key])
    }

    Object.assign(state, newState)

    if (options.silent) return

    store.emit('setState', state)
  }

  // Action

  const actionCallbacks = {}
  const actionContext = {}
  const boundActions = {}

  // Wrapper to pass state and bound actions to all actions
  const action = async (name, props = {}, ...args) => {

    // TODO: Middlewares

    if (typeof props!=='object') {
      args.unshift(props)
      props = { args }
    }

    try {

      const result = await actionCallbacks[name]({
        getState, setState,
        actions: boundActions,
        ...actionContext,
        ...props,
        state // Higher priority
      }, ...args)

      // i.e., send action name/props/state to Redux dev tools
      store.emit('action', { name, props, state })

      return result

    } catch (e) {
      console.log('ACTION ERROR', e, { name, props, state })
      store.emit('actionError', { name, props, state })
    }
  }

  const addActions = actions => {
    Object.keys(actions).forEach(key => {
      actionCallbacks[key] = actions[key]
      store[key] = boundActions[key] = (...args) => action(key, ...args)
    })
  }

  // Context to pass to every action
  const setActionContext = obj => Object.assign(actionContext, obj)

  // These return unsubscribers
  const onStateChange = fn => store.on('setState', fn)
  const onAction = fn => store.on('action', fn)


  if (props.actions) addActions(props.actions)
  if (props.createState) setState(props.createState(), { silent: true })

  Object.assign(store, {
    state, actions: boundActions,
    getState, setState, onStateChange,
    setActionContext, onAction
  })

  return store
}