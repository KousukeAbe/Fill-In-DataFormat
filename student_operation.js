const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync('./student_operation.txt', '');
  const start_time = new Date('2019-10-02T06:00:00');
  const finish_time = new Date('2019-10-02T07:30:00');

  var fileName = './group_a.txt';
  const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  let target_list = msg.split('\n');

  let page_operation = [];
  let current_student_number = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync('./student_operation.txt', `操作数\n`);
  for(let i of student_operation_log){

    if(!target_list.includes(i.student_number))continue;

    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;

      for(let u of page_operation){
        fs.appendFileSync('./student_operation.txt', `${u[0]}, ${u[1]}\n`);
      }
      fs.appendFileSync('./student_operation.txt', `${current_student_number}\n`);
      page_operation = [];

    }

    current_time = new Date(i.created_at);
    if(start_time.getTime() > current_time.getTime() || finish_time.getTime() < current_time.getTime()){
      continue;
    }

    const search_index = page_operation.findIndex((data) => {
      return data[0] == i.page_num;
    });

    if(search_index != -1){
      //ここの切り替えで操作を帰れる
      page_operation[search_index][1] += i.count_key;
      // page_operation[search_index][1] += i.count_mouseup;
    }else{
      page_operation.push([i.page_num, i.count_key, i.count_mouseup]);
    }
  }
  for(let u of page_operation){
    fs.appendFileSync('./student_operation.txt', `${u[0]}, ${u[1]}\n`);
  }
}

const Boot = async () => {
  let student_operation_log = await Query('select * from learning_operation_log where url = "se2.pdf" and page_num > 0 order by student_number, id;', []);
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
