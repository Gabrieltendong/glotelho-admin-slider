import { baseUrl, accessToken } from '../config'
import axios from 'axios'

export function getAllCategorie(){
  return new Promise((resolve, reject) => {
    axios.get(baseUrl + '/rest/fr_FR/V1/categories/', {
      headers: {
          'Authorization': 'Bearer ' + accessToken,
          "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then((res) => resolve(res))
    .catch((err) => reject(err))
  })
}
