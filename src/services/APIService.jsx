import axios from 'axios';
import basePath from './basePath';

const APIService = {
  async getAll(path) {
    //console.log(basePath.apiUrl() + path);
    //axios.get('/controller/getAll')
    return await axios.get(basePath.apiUrl() + path);
  },
  async getById(path, id) {
    //axios.get('/controller/getById/12345')
    return await axios.get(basePath.apiUrl() + path + '/' + id);
  },
  async getByName(path, name) {
    //axios.get('/controller/getById/12345')
    return await axios.get(basePath.apiUrl() + path + '/' + name);
  },
  async postByObject(path, credentials) {
    //axios.put('/controller/xxx', { hello: 'world' });
    return await axios.post(basePath.apiUrl() + path ,credentials);
  },
  async Post(path, credentials) {
    //axios.post('/controller/Save', JSON.parse(data))
    return await axios.post(basePath.apiUrl() + path, credentials);
  },
  async Put(path, credentials) {
    //axios.put('/controller/Update', { hello: 'world' });
    return await axios.put(basePath.apiUrl() + path, credentials);
  },
  async Delete(path, id) {
    //axios.delete('/controller/Delete/id');
    return await axios.delete(basePath.apiUrl() + path + '/' + id);
  }
}

export default APIService;
