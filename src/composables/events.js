const eventBus = new Comment('global-event-bus');
const listeners = {}

export const EVENT_AWS_AUTH_CHANGED = 'aws-auth-changed'
export const EVENT_CONFIG_LOADED = 'config-loaded'

export function useEvents() {

  /**
   * @param {string} event 
   * @param {function} callback 
   * @returns {number} index
   */
  const on = (event, callback) => {
    const index = (new Date()).getTime()
    listeners[index] = {
      listener: ({ detail }) => {
        callback(detail)
      },
      event
    }
    eventBus.addEventListener(event, listeners[index].listener)
    return index
  }

  /**
   * @param {string} event 
   * @param {function} callback 
   * @returns {void}
   */
  const once = (event, callback) => {
    eventBus.addEventListener(event, ({ detail }) => {
      callback(detail)
      eventBus.removeEventListener(event, callback)
    })
  }

  /**
   * @param {number} index 
   */
  const off = (index) => {
    const listener = listeners[index]
    if (!listener) {
      return
    }
    eventBus.removeEventListener(listener.event, listener.listener)
    delete listeners[index]
  }

  /**
   * @param {string} event 
   * @param {object} data 
   */
  const emit = (event, data) => {
    eventBus.dispatchEvent(new CustomEvent(event, {
      detail: data
    }))
  }

  return {
    on,
    once,
    off,
    emit
  }
}
