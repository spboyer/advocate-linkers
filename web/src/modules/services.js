/* eslint-disable no-console */
import axios from 'axios';

const bitly = {
  shorten: (url, shortner) => {
    return axios
      .get('https://api-ssl.bitly.com/v3/shorten?', {
        params: {
          format: 'json',
          apiKey: shortner.apiKey,
          login: shortner.username,
          longUrl: url
        }
      })
      .then(response => {
        if (response.status == 200) {
          const longUrl = response.data.data.long_url;
          const bitly = response.data.data.url;

          console.log(longUrl);
          console.log(bitly);

          return bitly;
        } else {
          console.log('Yikes ERROR, status code != 200 :( ');
        }
      })
      .catch(error => {
        console.log('Error! ' + error);
      });
  }
};

const cda = {
  shorten: url => {
    return axios({
      method: 'post',
      url: 'https://cda.ms/save',
      data: JSON.stringify({ url: url }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status == 200) {
          const shorty = response.data.url;

          console.log(shorty);

          return shorty;
        } else {
          console.log('Yikes ERROR, status code != 200 :( ');
        }
      })
      .catch(error => {
        console.log('Error! ' + error);
      });
  }
};

export const services = {
  bitly,
  cda
};
