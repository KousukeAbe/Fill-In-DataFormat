const mysql = require('mysql');
const util = require('util');
const fs = require('fs');


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}
// ここにやりたい処理を入れる
const Process = (student_operation_log) => {
  fs.writeFileSync('./student_exercise_beforeanswer.txt', '');
  const start_time = new Date('2019-10-09T06:00:00');
  //  ここは手動
  let finish_time = [new Date('2019-10-09T06:39:56'), new Date('2019-10-09T06:50:17'), new Date('2019-10-09T07:22:05'), new Date('2019-10-09T07:24:41')];

  // var fileName = './group_a.txt';
  // const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  // let target_list = msg.split('\n');
  let target_page_num = [14,17,24,25];

  let page_operation = [];
  let student_list = [];
  let current_student_number = 0;
  let flag = true;
  let column_count = 0;

  //生徒のページ遷移分ループ
  fs.appendFileSync('./student_exercise_beforeanswer.txt', `操作数\n`);
  for(let i of student_operation_log){

    // if(!target_list.includes(i.student_number))continue;
    if(!target_page_num.includes(i.page_num))continue;
    //対象の学生が終わったときの処理
    if(i.student_number != current_student_number){
      current_student_number = i.student_number;
      student_list.push(current_student_number);
      page_operation.push([{'14':0, '17':0, '24':0, '25':0}]);
    }

    //解説の空欄の排除　
    if(i.page_num == 17){
      if(i.blank_id != 857)continue;
    }

    if(i.page_num == 24){
      if(i.blank_id != 883)continue;
    }

    if(i.page_num == 25){
      if(i.blank_id != 888){
        if(i.blank_id != 893)continue;
      }
    }

    const index_num = target_page_num.indexOf(i.page_num);

    current_time = new Date(i.created_at);
    if(start_time.getTime() > current_time.getTime() || finish_time[index_num].getTime() < current_time.getTime()){
      continue;
    }
    page_operation[page_operation.length - 1][0][String(i.page_num)]++;
  }

  for(let u of student_list){
    fs.appendFileSync('./student_exercise_beforeanswer.txt', `${u},`);
  }

  fs.appendFileSync('./student_exercise_beforeanswer.txt', `\n`);
  for(let p = 0; p < target_page_num.length; p++){
    for(let i = 0; i < page_operation.length; i++){
      fs.appendFileSync('./student_exercise_beforeanswer.txt', `${page_operation[i][0][String(target_page_num[p])]},`);
    }
    fs.appendFileSync('./student_exercise_beforeanswer.txt', `\n`);
  }
}

const Boot = async () => {
  let student_operation_log = await Query('select * from correct_answers where url = ? order by student_number', ['/documents/se3.pdf']);
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
