const mysql = require('mysql');
const util = require('util');
const fs = require('fs');


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync('./student_exercise_answertime.txt', '');
  const start_time = new Date('2019-10-02T06:00:00');
  //  ここは手動
  let finish_time = [new Date('2019-10-02T06:46:38'), new Date('2019-10-02T06:49:20'), new Date('2019-10-02T07:24:56')];

  var fileName = './5.txt';
  const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  let target_list = msg.split('\n');
  let target_page_num = [20,21,28];

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync('./student_exercise_answertime.txt', `操作数\n`);
  for(let i of student_operation_log){

    if(!target_list.includes(i.student_number))continue;
    if(!target_page_num.includes(i.page_num))continue;
    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;
      student_list.push(current_student_number);
      page_operation.push([{'20':0, '21':0, '28':0}]);
    }

    const index_num = target_page_num.indexOf(i.page_num);

    current_time = new Date(i.created_at);
    if(start_time.getTime() > current_time.getTime() || finish_time[index_num].getTime() < current_time.getTime()){
      continue;
    }
    page_operation[page_operation.length - 1][0][String(i.page_num)] = current_time;
  }

  for(let u of student_list){
    fs.appendFileSync('./student_exercise_answertime.txt', `${u},`);
  }

  fs.appendFileSync('./student_exercise_answertime.txt', `\n`);
  for(let p = 0; p < target_page_num.length; p++){
    for(let i = 0; i < page_operation.length; i++){
      const visible_time = page_operation[i][0][String(target_page_num[p])];
      if(typeof visible_time == 'object'){
        fs.appendFileSync('./student_exercise_answertime.txt', `${Zero_Padding(visible_time.getHours())}:${Zero_Padding(visible_time.getMinutes())}:${Zero_Padding(visible_time.getSeconds())},`);
      }else{
        fs.appendFileSync('./student_exercise_answertime.txt', `0,`);
      }
    }
    fs.appendFileSync('./student_exercise_answertime.txt', `,`);
  }
}

const Boot = async () => {
  let student_operation_log = await Query('select * from correct_answers where url = ? order by student_number', ['/documents/se2.pdf']);
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
