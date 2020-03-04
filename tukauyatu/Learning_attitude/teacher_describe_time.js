const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const file_name = './../totals/teacher_describe_time.txt';
const url = '/documents/se9.pdf';


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync(file_name, '');
  //期間の設定(手動)
  const start_time = new Date('2019-11-27T15:00:00');
  const finish_time = new Date('2019-11-27T16:30:00');

  let current_page_num = 0;
  let current_time = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync(file_name, `Describe_time\n`);
  fs.appendFileSync(file_name, `From, To, From_time, To_time, destance\n`);
  for(let i of student_operation_log){
    const future_page_num = i.page_num;
    const future_time = new Date(i.created_at);

    if(start_time.getTime() > future_time.getTime() || finish_time.getTime() < future_time.getTime()){
      continue;
    }

    if(future_page_num < 4)continue;
    if(current_page_num >= future_page_num)continue;

    if(current_time == 0){
      current_page_num = future_page_num;
      current_time = future_time;
      continue;
    }

    fs.appendFileSync(file_name, `${current_page_num}, ${future_page_num}, ${Zero_Padding(current_time.getHours())}:${Zero_Padding(current_time.getMinutes())}:${Zero_Padding(current_time.getSeconds())}, ${Zero_Padding(future_time.getHours())}:${Zero_Padding(future_time.getMinutes())}:${Zero_Padding(future_time.getSeconds())}, ${future_time.getTime() - current_time.getTime()}\n`);

    current_page_num = future_page_num;
    current_time = future_time;
  }
}

const Boot = async () => {
  // let student_operation_log = await Query('select * from learning_operation_log where url = "se4.pdf" and page_num > 0 order by student_number, id;', []);
  let student_operation_log = await Query('select * from teacher_page_turning where url = ?;', [url]);
  Process(student_operation_log);
  return 0;
};


const Connection = async () => {
  db = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "2019_final"
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
