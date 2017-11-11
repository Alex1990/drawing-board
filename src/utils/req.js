import axios from 'axios';
import _ from 'lodash';

const req = axios.create();

req.interceptors.response.use((response) => {
  return { response };
}, (error) => {
  let errMsg = '';
  if (error.response) {
    errMsg = _.get(error.response, 'data.message');
  } else {
    errMsg = error.message;
  }
  alert(errMsg);
  return { error };
});

export default req;
