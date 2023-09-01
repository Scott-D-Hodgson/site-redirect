import express from 'express';
import https from 'https';

const app = express();
const port = 443;
let ip = null;

function GetIp() {
  let callback = (err, rip) => {
    if (err) {
      return console.log(err);
    };
    if (ip != rip) {
      console.log(`External IP changed: ${rip}`);
    };
    ip = rip;
  };
  https.get({
    host: 'api.ipify.org',
  }, response => {
    let rip = '';
    response.on('data', (data) => {
        rip += data;
    });
    response.on('end', () => {
      if(rip){
        callback(null, rip);
      } else {
        callback('Could not get public ip address');
      };
    });
  });    
};

GetIp();

app.use(express.json());

app.all('*', (req, res, next) => {
  GetIp();
  res.status(200).json({
    'ip': ip
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});