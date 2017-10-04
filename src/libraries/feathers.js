import axios from 'axios'
import feathers from 'feathers/client'
import rest from 'feathers-rest/client'
import authentication from 'feathers-authentication/client'
import hooks from 'feathers-hooks'

const isProduction = process.env.NODE_ENV === 'production'
const host = isProduction ? 'https://api.hivemind.id' : 'http://localhost:3030'
const api = feathers()
  .configure(hooks())
  .configure(rest(host).axios(axios))
  .configure(authentication({
    // Use localStorage to store our login token
    path: 'auth/login'
  }))

export default api
