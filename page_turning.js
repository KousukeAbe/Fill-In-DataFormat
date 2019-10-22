const mysql = require('mysql');
const util = require('util');
const fs = require('fs');


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync('./page_turning.txt', '');
  //期間の設定(手動)
  const start_time = new Date('2019-10-09T15:00:00');
  const finish_time = new Date('2019-10-09T16:30:00');

  // let finish_time = [new Date('2019-10-09T06:39:56'), new Date('2019-10-09T06:50:17'), new Date('2019-10-09T07:22:05'), new Date('2019-10-09T07:24:41')];

  // var fileName = './5.txt';
  // const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  // let target_list = msg.split('\n');

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync('./page_turning.txt', `操作数\n`);
  for(let i of student_operation_log){

    // if(!target_list.includes(i.student_number))continue;
    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;
      student_list.push(current_student_number);
      page_operation.push([]);
    }

    current_time = new Date(i.created_at);
    if(start_time.getTime() > current_time.getTime() || finish_time.getTime() < current_time.getTime()){
      continue;
    }
    page_operation[page_operation.length - 1].push({});
    page_operation[page_operation.length - 1][page_operation[page_operation.length - 1].length - 1].page_num = i.page_num;
    page_operation[page_operation.length - 1][page_operation[page_operation.length - 1].length - 1].created_at = `${Zero_Padding(current_time.getHours())}:${Zero_Padding(current_time.getMinutes())}:${Zero_Padding(current_time.getSeconds())}`;
  }
  for(let u of student_list){
    fs.appendFileSync('./page_turning.txt', `${u},,`);
  }

  fs.appendFileSync('./page_turning.txt', `\n`);
  while(flag){
    flag = false;
    for(let i = 0; i < page_operation.length; i++){
      if(page_operation[i].length > column_count){
        flag = true;
        fs.appendFileSync('./page_turning.txt', `${page_operation[i][column_count].created_at},${page_operation[i][column_count].page_num},`);
      }else{
        fs.appendFileSync('./page_turning.txt', ` , ,`);

      }
    }
    column_count++;
    fs.appendFileSync('./page_turning.txt', `\n`);
  }
}

const Boot = async () => {
  // let student_operation_log = await Query('select * from student_page_turning where url = "/documents/se3.pdf" and page_num > 0 order by student_number, id;', []);
  let student_operation_log = await Query('select * from teacher_page_turning where url = "/documents/se3.pdf" and page_num > 0 order by id;', []);
  Process(student_operation_log);
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
