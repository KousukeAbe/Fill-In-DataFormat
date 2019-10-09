const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync('./teacher_page_turning.txt', '');
  const start_time = new Date('2019-10-02T15:00:00');
  const finish_time = new Date('2019-10-02T16:30:00');

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync('./teacher_page_turning.txt', `操作数\n`);
  student_list.push(999999);
  page_operation.push([]);
  for(let i of student_operation_log){

    current_time = new Date(i.created_at);
    if(start_time.getTime() > current_time.getTime() || finish_time.getTime() < current_time.getTime()){
      continue;
    }

    page_operation[page_operation.length - 1].push({});
    page_operation[page_operation.length - 1][page_operation[page_operation.length - 1].length - 1].page_num = i.page_num;
    page_operation[page_operation.length - 1][page_operation[page_operation.length - 1].length - 1].created_at = `${Zero_Padding(current_time.getHours())}:${Zero_Padding(current_time.getMinutes())}:${Zero_Padding(current_time.getSeconds())}`;
  }
  for(let u of student_list){
    fs.appendFileSync('./teacher_page_turning.txt', `${u},,`);
  }

  fs.appendFileSync('./teacher_page_turning.txt', `\n`);
  while(flag){
    flag = false;
    for(let i = 0; i < page_operation.length; i++){
      if(page_operation[i].length > column_count){
        flag = true;
        fs.appendFileSync('./teacher_page_turning.txt', `${page_operation[i][column_count].created_at},${page_operation[i][column_count].page_num},`);
      }else{
        fs.appendFileSync('./teacher_page_turning.txt', ` , ,`);
      }
    }
    column_count++;
    fs.appendFileSync('./teacher_page_turning.txt', `\n`);
  }
}

const Boot = async () => {
  let student_operation_log = await Query('select * from teacher_page_turning where url = "/documents/se2.pdf" and page_num > 0;', []);
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
