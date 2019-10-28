const mysql = require('mysql');
const util = require('util');
const fs = require('fs');


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log, teacher_operation_log) => {
  fs.writeFileSync('./teacher_open_answer.txt', '');
  fs.appendFileSync('./teacher_open_answer.txt', `時間\n`);

  const start_time = new Date('2019-10-09T06:00:00');
  //  ここは手動
  let finish_time = new Date('2019-10-09T07:30:00');

  // var fileName = './5.txt';
  // const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  // let target_list = msg.split('\n');

  let target_brank = [];
  for(let i of teacher_operation_log){
    const target = target_brank.find((blank) =>{
      return (blank.id === i.blank_id);
    });

    if(!target){
      let date = new Date(i.created_at);
      date.setHours(date.getHours() - 9);

      if(start_time.getTime() > date.getTime() || finish_time.getTime() < date.getTime()){
        continue;
      }

      target_brank.push({id: i.blank_id, date: date});
      fs.appendFileSync('./teacher_open_answer.txt', `${i.blank_id}, ${Zero_Padding(date.getHours())}:${Zero_Padding(date.getMinutes())}:${Zero_Padding(date.getSeconds())}\n`);

    }
  }
}

const Boot = async () => {
  let teacher_operation_log = await Query('select blank_id, created_at from teacher_remove_blank where url = ?;', ['/documents/se3.pdf']);
  let student_operation_log = await Query('select * from correct_answers where url = ? order by student_number', ['/documents/se3.pdf']);
  Process(student_operation_log, teacher_operation_log);
  return 0;
};


const Connection = async () => {
  db = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "2019secondVer2"
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
