let apiRoot = ''

if (process.env.BUILD_MODE == 'dev') {
  apiRoot = 'http://localhost:8017/v1'
}
if (process.env.BUILD_MODE == 'production') {
  apiRoot = 'https://trello-api-m0z4.onrender.com/v1'
}

export const API_URL = apiRoot

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12
