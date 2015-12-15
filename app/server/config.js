var fs = require('fs');
var path = require('path');

exports.appName = 'gitmonitorApp';
exports.id = 'loopback-component-push-app2';

exports.apnsCertData = readCredentialsFile('cert.pem');
exports.apnsKeyData = readCredentialsFile('key.pem');


//--- Helper functions ---

function readCredentialsFile(name) {
  return fs.readFileSync(
    path.resolve(__dirname, 'secrets', name),
    'UTF-8'
  );
}
