import axios from 'axios';

// eslint-disable-next-line max-len
const API_URL = `${process.env.GATSBY_WORKSHOPCHALLENGE_API_ENDPOINT}/api/login`;
const data = {
  username: '',
  password: '',
};
const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

class AuthService {
  login() {
    return axios({
      method: 'POST',
      url: API_URL,
      data,
      headers: options,
    }).then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
