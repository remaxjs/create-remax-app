import axios from 'axios';

const checkRepoVersion = async (repoName: string) => {
  const { tag_name } = await getResult(`https://api.github.com/repos/${repoName}/releases/latest`)
  return tag_name
}

const getResult = (url: string) => {
  return axios.get(url).then(data => {
    return data.data
  }).catch(e => {
    // console.error(e)
  })
}

export { checkRepoVersion }