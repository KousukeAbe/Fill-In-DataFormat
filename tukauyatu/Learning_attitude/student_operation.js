const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const file_name = './../totals/student_operation.txt';


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync(file_name, '');
  //期間の設定(手動)
  const start_time = new Date('2019-10-16T06:00:00');
  const finish_time = new Date('2019-10-16T07:30:00');

  let time_table = [];
  for(let i = 0; i <= 90; i++){
    let insert_time = new Date(start_time);
    insert_time.setMinutes(insert_time.getMinutes() + i);
    time_table.push(`${Zero_Padding(insert_time.getHours())}:${Zero_Padding(insert_time.getMinutes())}`);
  }

  // let finish_time = [new Date('2019-10-09T06:39:56'), new Date('2019-10-09T06:50:17'), new Date('2019-10-09T07:22:05'), new Date('2019-10-09T07:24:41')];

  // var fileName = './group_d.txt';
  // const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  // let target_list = msg.split('\n');

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;


  //生徒のページ遷移分ループ
  fs.appendFileSync(file_name, `操作数\n`);
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
    page_operation[page_operation.length - 1][page_operation[page_operation.length - 1].length - 1].keyup = i.count_key + i.count_mouseup;
    page_operation[page_operation.length - 1][page_operation[page_operation.length - 1].length - 1].created_at = `${Zero_Padding(current_time.getHours())}:${Zero_Padding(current_time.getMinutes())}`;
  }
  for(let u of time_table){
    fs.appendFileSync(file_name, `${u},`);
  }

  fs.appendFileSync(file_name, `\n`);
  for(let i = 0; i < page_operation.length; i++){
    fs.appendFileSync(file_name, `${student_list[i]},`);
    for(let p = 0; p < time_table.length;p++){
      const target = page_operation[i].find((time) => {
        return (time.created_at == time_table[p]);
      });

      if(target){
        fs.appendFileSync(file_name, `${target.keyup},`);
      }else{
        fs.appendFileSync(file_name, `欠,`);
      }
    }
    fs.appendFileSync(file_name, '\n');
  }
}

const Boot = async () => {
  let student_operation_log = await Query('select * from learning_operation_log where url = "se4.pdf" and page_num > 0 order by student_number, id;', []);
  // let student_operation_log = await Query('select * from teacher_page_turning where url = "/documents/se3.pdf" and display_out > 0 order by id;', []);
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
