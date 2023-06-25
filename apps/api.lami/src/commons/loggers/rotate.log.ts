import * as morgan from 'morgan';
import { join } from 'path';
import * as rfs from 'rotating-file-stream';
const {parse, stringify, toJSON, fromJSON} = require('flatted');

//# See more info https://www.npmjs.com/package/rotating-file-stream
export const accessLogStream = rfs.createStream('lpn-dev.log', {
  interval: '1d',
  path: join(__dirname, '../../logs'),
  maxFiles: 180,
  compress: 'gzip',
});

export const LoggerApplication = () => {
  return morgan(
    function (tokens, req, res) {
      return [
        tokens['date'](req, res),
        tokens['remote-addr'](req, res),
        'forward ip:',
        stringify(req.headers['x-forwarded-for']),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        'headers:',
        stringify(req['headers']),
        'body:',
        JSON.stringify(req['body']),
        'query:',
        JSON.stringify(req['query']),
        'params:',
        JSON.stringify(req['params']),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    },
    { stream: accessLogStream },
  )
}
