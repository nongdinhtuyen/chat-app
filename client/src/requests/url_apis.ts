type EndpointFunction<T extends any[]> = (...args: T) => string
type Endpoint = string | EndpointFunction<any[]>
type Endpoints = {
  [key: string]: Endpoint
}
type MappedEndpoints<T> = {
  [K in keyof T]: T[K] extends EndpointFunction<infer P> ? (...args: P) => string : string
}

function createEndpointProxy<T extends Endpoints>(
  prefix: string,
  endpoints: T,
): MappedEndpoints<T> {
  return new Proxy(endpoints, {
    get(target, prop) {
      const endpoint = target[prop as keyof T]
      if (typeof endpoint === 'function') {
        return (...args: any[]) => `${prefix}/${endpoint(...args)}`
      }
      if (endpoint === '') {
        return prefix
      }
      return `${prefix}/${endpoint}`
    },
  }) as any
}

const taskPrefix = 'tasks'
const authPrefix = 'auth'
const userPrefix = 'users'

export const taskEndpoints = {
  getTasks: `tasks`,
  getTaskById: (id: string) => `tasks/${id}`,
  createTask: `tasks`,
  updateTask: (id: string) => `tasks/${id}`,
  deleteTask: `tasks`,
}

export const authEndpoints = createEndpointProxy(authPrefix, {
  login: `login`,
  create: `create`,
})

export const userEndpoints = createEndpointProxy(userPrefix, {
  getUsers: '',
  createUsers: '',
})
