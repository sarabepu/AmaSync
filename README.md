# AmaSync Server☁️👯‍♂️

## Authors:

* [Sara Bejarano](https://sarabepu.github.io/website) 👩‍💻💃
* [Mariana Rodriguez](https://mrodriguez21.github.io) 👩‍💻🤘

## Description:

AmaSync is a chrome extension for watching Amazon Prime Video remotely with your friends. 
It has the following functionalities:
- Create rooms 
- Join your friend's room
- Real time synchronization of movies/series 
- Chats in room
- Cutomizable name of users

## Deployment


### Prerequisites: 
Nodejs >= 10, npm, react

### Local deployment:
- Clone this repo
- #### Generate SSL certificate
    
```bash
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```

- Change the routes to the certificate on server/bin/www
- Run the following commands

  ```bash
  cd amasync
  cd server
  npm install
  npm start
  ```
- Go to https://localhost:8080 and allow the self-signed certificate your browser. It will say it's insecure because it was generated locally, but it's ok (don't trust the browser, trust me bro 🙊).

- Test that it's working creating a websocket in your **browser console**

        let ws= new WebSocket('wss://localhost:8080')

You're all set 😉

## License

This project is licensed by the MIT [License](https://raw.githubusercontent.com/sarabepu/amasync/master/LICENSE).
