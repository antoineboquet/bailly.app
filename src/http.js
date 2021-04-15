export function HttpError (response) {
  return response
}

export default {
  fetch: async (query) => {
    const queryUrl = process.env.VUE_APP_API + query

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
