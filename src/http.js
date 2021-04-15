export function HttpError (response) {
  return response
}

export default {
  fetch: async (query) => {
    let baseUrl = 'https://api/bailly.app/'
    if (process.env.NODE_ENV === 'development') baseUrl = '/api/'

    const queryUrl = baseUrl + query

    const params = {
      method: 'GET',
      headers: {
        credentials: 'include',
        Accept: 'application/json'
      }
    }

    const response = await fetch(queryUrl, params)
    const json = (await response.json()) || {}

    if (!response.ok) throw new HttpError(response)
    else return json
  }
}
