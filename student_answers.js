const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync('./student_answers.txt', '');
  const start_time = new Date('2019-10-02T06:00:00');
  const finish_time = new Date('2019-10-02T07:30:00');

  var fileName = './group_d.txt';
  const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  let target_list = msg.split('\n');

  let answer_count = 0;
  let current_student_number = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync('./student_answers.txt', `回答数\n`);
  for(let i of student_operation_log){
    if(!target_list.includes(i.student_number))continue;

    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;
      fs.appendFileSync('./student_answers.txt', `${answer_count}\n${current_student_number},`);
      answer_count = 0;
    }

    current_time = new Date(i.created_at);
    if(start_time.getTime() > current_time.getTime() || finish_time.getTime() < current_time.getTime()){
      continue;
    }

    answer_count++;
  }
  fs.appendFileSync('./student_answers.txt', `${answer_count}\n`);
}

const Boot = async () => {
  let student_operation_log = await Query('select * from correct_answers where url = "/documents/se2.pdf" and page_num > 0 and correct_answer_status = 1 order by student_number, id;', []);
  Process(student_operation_log);
  return 0;
};


const Connection = async () => {
  db = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "2019second"
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
