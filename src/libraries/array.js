export function chunkArr (arr, size) {
  const chunkedArr = []

  for (let i = 0; i < arr.length; i++) {
    const last = chunkedArr[chunkedArr.length - 1]

    if (!last || last.length === size) {
      chunkedArr.push([arr[i]])
    } else {
      last.push(arr[i])
    }
  }

  return chunkedArr
}
