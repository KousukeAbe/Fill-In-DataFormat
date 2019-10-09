const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

// ここにやりたい処理を入れる
const Process = (data) => {
  let current_student_number = 0;
  let current_page_num = 1;
  let current_time = null;
  let current_stay_time = 0;
  let current_type = null;

  fs.writeFileSync('./display_time.txt', '');
  for(let dat of data){
    if(dat.student_number != current_student_number){
      current_student_number = dat.student_number;
      fs.appendFileSync('./display_time.txt', `${current_student_number}\n`);
      current_time = new Date(dat.created_at);
      current_type = dat.type;
      continue;
    }

    if(dat.page_num != current_page_num){
      fs.appendFileSync('./display_time.txt', `page ${dat.page_num}, ${current_stay_time}\n`);
      current_stay_time = 0;
      current_page_num = dat.page_num;
    }

    if(dat.type != current_type){
      const stay_time = (new Date(dat.created_at).getTime() - current_time.getTime()) / 1000;
      if(stay_time > 0)current_stay_time += stay_time;
      current_time = new Date(dat.created_at);
      current_type = dat.type;
    }else{
      current_time = new Date(dat.created_at);
    }
  }
}




const Boot = async () => {
  let total = await Query('select * from learning_action_log where url = "^12-jsp4.pdf" and student_number = 1721154 order by student_number, id', []);
  Process(total);
  return 0;
};


const Connection = async () => {
  db = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "2019first"
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
