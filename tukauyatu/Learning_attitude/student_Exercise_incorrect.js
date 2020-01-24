const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const file_name = '../totals/student_exercise_incorrect.txt';
const pdf_name = '/documents/se9.pdf';
const target_page = [9, 20, 21, 26,27,28];


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log, teacher_operation_log, blank_log) => {
  const filter_brank = blank_log.filter((data) =>{
    return target_page.includes(data.page_num);
  });
  const target_brank = filter_brank.map((data) => data.id);
  console.log(target_brank);
  fs.writeFileSync(file_name, '');
  fs.appendFileSync(file_name, `時間\n`);

  const start_time = new Date('2019-10-20T06:00:00');
  //  ここは手動
  let finish_time = new Date('2019-10-20T07:30:00');

  // var fileName = './5.txt';
  // const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  // let target_list = msg.split('\n');

  let answer_count = [];
  answer_count.push({});
  for(let i of target_brank){
    fs.appendFileSync(file_name, `${i},`);
    answer_count[0][i] = -999;
  }
  fs.appendFileSync(file_name, `\n`);

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;

  //生徒のページ遷移分ループ
  for(let i of student_operation_log){

    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;

      for(let i of target_brank)fs.appendFileSync(file_name, `${answer_count[0][i]},`);
      fs.appendFileSync(file_name, `\n`);
      fs.appendFileSync(file_name, `${current_student_number},`);

      answer_count = [];
      answer_count.push({});
      for(let i of target_brank)answer_count[0][i] = -999;
    }

    const target = target_brank.find((blank) =>{
      return (blank === i.blank_id);
    });

    answer_count[0][i.blank_id] = i.update_at ? 1 : 0;
  }
}

const Boot = async () => {
  let blank_log = await Query('select id,page_num from blank where url = ?;', [pdf_name]);
  let teacher_operation_log = await Query('select blank_id, created_at from teacher_remove_blank where url = ?;', [pdf_name]);
  let student_operation_log = await Query('select * from correct_answers where url = ? order by student_number', [pdf_name]);
  Process(student_operation_log, teacher_operation_log, blank_log);
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
