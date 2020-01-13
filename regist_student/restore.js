const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

// ここにやりたい処理を入れる
const Data_extract = async () => {
  var fileName = './student_list.txt';
  const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  let row_data = msg.split('\n');
  let student_list = [];
  for(let i of row_data){
    student_list.push(i.split('\t'));
  }
  student_list.pop();
  return student_list;
}

const Registration = async (data) => {
  for(let i of data){
    let id = await Query('SELECT id from user_info where student_number = ?', [parseInt(i[0])]);
    if(!id.length)continue;
    for(let p of id){
      if(p.id >= 192)continue;
      await Query('insert into regisublist(user_id, sub_id) values(? , 8);',[p.id]);
    }
  }
}

const Boot = async () => {
  const data = await Data_extract();
  Registration(data);
  return 0;
};


const Connection = async () => {
  db = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "template_express_socketio_auth"
  });
  db.query = util.promisify(db.query);
  return db;
}

const Disconnection = async () => {
	this.con.end();
}

const Query = async (query, holder) => {
  let db = await Connection();
  try {
    let results = await db.query(query, holder);
    db.end(); // mysqlのコネクションのプロセスを終了させる。（2018-11-07追記）
    return results;
  } catch (err) {
    throw new Error(err);
  }
}

Boot();
return;
