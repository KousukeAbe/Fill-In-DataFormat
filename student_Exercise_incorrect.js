const mysql = require('mysql');
const util = require('util');
const fs = require('fs');


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log, teacher_operation_log) => {
  fs.writeFileSync('./student_exercise_incorrect.txt', '');
  fs.appendFileSync('./student_exercise_incorrect.txt', `時間\n`);

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
    }
  }

  let answer_count = [];
  answer_count.push({});
  for(let i of target_brank){
    fs.appendFileSync('./student_exercise_incorrect.txt', `${i.id},`);
    answer_count[0][i.id] = -999;
  }
  fs.appendFileSync('./student_exercise_incorrect.txt', `\n`);

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;

  //生徒のページ遷移分ループ
  for(let i of student_operation_log){

    // if(!target_list.includes(i.student_number))continue;
    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;

      for(let i of target_brank)fs.appendFileSync('./student_exercise_incorrect.txt', `${answer_count[0][i.id]},`);
      fs.appendFileSync('./student_exercise_incorrect.txt', `\n`);
      fs.appendFileSync('./student_exercise_incorrect.txt', `${current_student_number},`);

      answer_count= [];
      answer_count.push({});
      for(let i of target_brank)answer_count[0][i.id] = -999;
    }

    current_time = new Date(i.created_at);
    // if(start_time.getTime() > current_time.getTime() || finish_time.getTime() < current_time.getTime()){
    //   continue;
    // }
    const target = target_brank.find((blank) =>{
      return (blank.id === i.blank_id);
    });

    answer_count[0][i.blank_id] = i.update_at ? 1 : 0;
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
