const INDEXED_DB_NAME = 'bailly'
const INDEXED_DB_VERSION = '2'

export async function getIndexedDB () {
	return new Promise((resolve, reject) => {
    const connection = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION)

    connection.onsuccess = function () {
      resolve(this.result)
    }

    connection.onerror = function (event) {
      reject(event)
    }

    connection.onupgradeneeded = function (event) {
      const db = event.currentTarget.result

      if (event.oldVersion) {
        db.deleteObjectStore('dictionarySlices')
        db.deleteObjectStore('lastWords')
      }

      db.createObjectStore('dictionarySlices', { keyPath: 'id', unique: true })

      const lastWords = db.createObjectStore('lastWords', { keyPath: 'id', autoIncrement: true })
      lastWords.createIndex('definition.uri', 'definition.uri', { unique: true })
    }
	})
}
