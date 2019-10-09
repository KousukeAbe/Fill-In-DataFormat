const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
var LineStream = require('./line_stream');

const a = 'ERROR.CONNECTION_LOST:  { Error: Connection lost: The server closed the connection.';
const b = 'at Protocol.end (/home/akserver/デスクトップ/Fill-in_Workbook--2018Edition--master/node_modules/mysql/lib/protocol/Protocol.js:112:13)';
const c = 'at Socket.<anonymous> (/home/akserver/デスクトップ/Fill-in_Workbook--2018Edition--master/node_modules/mysql/lib/Connection.js:97:28)';
const d = 'at Socket.<anonymous> (/home/akserver/デスクトップ/Fill-in_Workbook--2018Edition--master/node_modules/mysql/lib/Connection.js:525:10)';
const e = 'at Socket.emit (events.js:208:7)';
const f = 'at emitNone (events.js:111:20)';
const g = 'at endReadableNT (_stream_readable.js:1064:12)';
const h = 'at _combinedTickCallback (internal/process/next_tick.js:138:11)';
const i = "at process._tickCallback (internal/process/next_tick.js:180:9) fatal: true, code: 'PROTOCOL_CONNECTION_LOST' }";
const j = 'ERROR.DB:  { Error: Connection lost: The server closed the connection.';

// ここにやりたい処理を入れる
const Process = () => {
  fs.writeFileSync('./new_log.txt', '');
  var fileName = './db_text.txt';
  var fileReaderStream = require('fs').createReadStream(fileName, {bufferSize: 10});
  fileReaderStream.setEncoding('utf8');

  var lineStream = new LineStream()
  lineStream.on('data', function(data) {
    if(data.includes(a))return;
    if(data.includes(b))return;
    if(data.includes(c))return;
    if(data.includes(d))return;
    if(data.includes(e))return;
    if(data.includes(f))return;
    if(data.includes(g))return;
    if(data.includes(h))return;
    if(data.includes(i))return;
    if(data.includes(j))return;
    fs.appendFileSync('./new_log.txt', `${data}\n`);
  });

  fileReaderStream.pipe(lineStream);
  lineStream.resume();
};

Process();
return;
