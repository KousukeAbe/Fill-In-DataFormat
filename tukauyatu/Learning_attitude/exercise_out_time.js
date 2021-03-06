const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const file_name = '../totals/sync_late.txt';
const page_num_list = [10, 13, 20, 21];


const Zero_Padding = (num) => {
  return ("00000000" + num).slice(-2);
}

// ここにやりたい処理を入れる
const Process = (teacher_page_turning, page_turning) => {
  fs.writeFileSync(file_name, '');
  fs.appendFileSync(file_name, `非同期率\n`);

  const start = new Date('2019-10-30T15:00:00');
  const finish = new Date('2019-10-30T16:30:00');

  let page_operation = [];
  let time_table = [];
  let student_list = [];


  for(let page_num of page_num_list){
    let start_time = new Date('2019-10-30T15:00:00');
    let finish_time = new Date('2019-10-30T16:30:00');

    for(let i = 0; i < teacher_page_turning.length; i++){
      let current_time = new Date(teacher_page_turning[i].created_at);
      if(start.getTime() > current_time.getTime() || finish.getTime() < current_time.getTime()){
        continue;
      }
      if(teacher_page_turning[i].page_num == page_num){
        start_time = current_time;
        start_time.setSeconds(0);
        finish_time = new Date(teacher_page_turning[i + 1].created_at);
        finish_time.setSeconds(0);
        finish_time.setMinutes(finish_time.getMinutes() + 1);
        break;
      }
    }

    let teacher_index_start = 0;

    let current_student_number = 0;
    let current_page_num = 1;
    let current_time = null;
    let async_time = 0;
    let current_type = null;
    let latest_time = finish_time;

    let current_teacher_index = 0;

    //講義時間外のデータの削除
    let last_student_index = 0;
    while(start_time.getTime() > new Date(teacher_page_turning[teacher_index_start].created_at).getTime())teacher_index_start++;
    // current_teacher_index = teacher_index_start - 1; //途中の同期率よう
    current_teacher_index = teacher_index_start;

    let student_page_turning = [];
    student_page_turning.push(page_turning[0]);
    current_student_number = page_turning[0].student_number;
    for(let p = 1; p < page_turning.length - 1; p++){
      if(page_turning[p].student_number != current_student_number){
        current_student_number = page_turning[p].student_number;
        student_page_turning.push(page_turning[p]);
        continue;
      }

      if(page_turning[p].student_number != page_turning[p + 1].student_number){
        student_page_turning.push(page_turning[p]);
        continue;
      }

      let current_time = new Date(page_turning[p].created_at);
      let turning_time = new Date(page_turning[p+1].created_at);
      if((turning_time.getTime() - current_time.getTime()) > 5000){
        student_page_turning.push(page_turning[p]);
      }
    }

    //生徒のページ遷移分ループ
    let p = 1;
    let index = -1;

    while(p < student_page_turning.length){

      //対象の学生が終わったときの処理
      if(student_page_turning[p].student_number != current_student_number){
        current_student_number = student_page_turning[p].student_number;
        if(student_list.indexOf(current_student_number) == -1){
          student_list.push(current_student_number);
          page_operation.push([]);
        }
        index++;

        current_teacher_index = teacher_index_start;
        last_student_index = 1;
        last_time = start_time;

        async_time += finish_time.getTime() - latest_time.getTime();

        page_operation[index].push({});
        page_operation[index][page_operation[index].length - 1].sync_late = `${Math.floor(async_time / (finish_time.getTime() - start_time.getTime()) * 10000) / 100}`;
        latest_time = finish_time;
        async_time = 0;
        p++;
        continue;
      }

      // 講義時間外のデータの削除
      current_time = new Date(student_page_turning[p].created_at);
      if(!teacher_page_turning[current_teacher_index + 1] || !student_page_turning[p + 1]){
        p++;
        continue;
      }
      if(start_time.getTime() > current_time.getTime() || finish_time.getTime() < current_time.getTime()){
        p++;
        continue;
      }
      if(student_page_turning[p].student_number != student_page_turning[p + 1].student_number){
        p++;
        continue;
      }
      latest_time = current_time;
      // fs.appendFileSync(file_name,`${p}: ${student_page_turning[p].id}\n`);
      // fs.appendFileSync(file_name, `${Zero_Padding(current_time.getHours())}:${Zero_Padding(current_time.getMinutes())}:${Zero_Padding(current_time.getSeconds())},${student_page_turning[p].page_num}\n`);
      //どっちのデータが遅いかを比較
      if(current_time.getTime() > new Date(teacher_page_turning[current_teacher_index].created_at).getTime()){
        if(new Date(student_page_turning[p + 1].created_at).getTime() > new Date(teacher_page_turning[current_teacher_index + 1].created_at).getTime()){
          if(new Date(student_page_turning[p].created_at).getTime() < new Date(teacher_page_turning[current_teacher_index + 1].created_at).getTime()){
            if(student_page_turning[p].page_num != teacher_page_turning[current_teacher_index].page_num){
              // console.log(student_page_turning[p].student_number, student_page_turning[p].page_num);
              // console.log("1", new Date(teacher_page_turning[current_teacher_index + 1].created_at), new Date(student_page_turning[p].created_at));
              async_time += new Date(teacher_page_turning[current_teacher_index + 1].created_at).getTime() - new Date(student_page_turning[p].created_at).getTime();
            }
          }
        }else{
          if(student_page_turning[p].page_num != teacher_page_turning[current_teacher_index].page_num){
            // console.log(student_page_turning[p].student_number, student_page_turning[p].page_num);
            // console.log("2", new Date(student_page_turning[p + 1].created_at),new Date(student_page_turning[p].created_at));
            async_time += new Date(student_page_turning[p + 1].created_at).getTime() - new Date(student_page_turning[p].created_at).getTime();
          }
        }
        current_teacher_index++;
      }else{
        if(new Date(student_page_turning[p + 1].created_at).getTime() > new Date(teacher_page_turning[current_teacher_index + 1].created_at).getTime()){
          if(student_page_turning[p].page_num != teacher_page_turning[current_teacher_index].page_num){
            // console.log(student_page_turning[p].student_number, student_page_turning[p].page_num);
            // console.log("3", new Date(teacher_page_turning[current_teacher_index + 1].created_at), new Date(teacher_page_turning[current_teacher_index].created_at));
            async_time += new Date(teacher_page_turning[current_teacher_index + 1].created_at).getTime() - new Date(teacher_page_turning[current_teacher_index].created_at).getTime();
          }
        }else{
          if(new Date(student_page_turning[p + 1].created_at).getTime() > new Date(teacher_page_turning[current_teacher_index].created_at).getTime()){
            if(student_page_turning[p].page_num != teacher_page_turning[current_teacher_index].page_num){
              // console.log(student_page_turning[p].student_number, student_page_turning[p].page_num);
              // console.log("4", new Date(student_page_turning[p + 1].created_at), new Date(teacher_page_turning[current_teacher_index].created_at));
              async_time += new Date(student_page_turning[p + 1].created_at).getTime() - new Date(teacher_page_turning[current_teacher_index].created_at).getTime();
            }
          }else{
            if(new Date(teacher_page_turning[current_teacher_index].created_at).getDate() != new Date(teacher_page_turning[current_teacher_index - 1].created_at).getDate()){
              p++;
              continue;
            }
            if(student_page_turning[p].page_num != teacher_page_turning[current_teacher_index - 1].page_num){
              // console.log(student_page_turning[p].student_number, student_page_turning[p].page_num);
              // console.log("4", new Date(student_page_turning[p + 1].created_at), new Date(teacher_page_turning[current_teacher_index].created_at));
              async_time += new Date(student_page_turning[p + 1].created_at).getTime() - new Date(student_page_turning[p].created_at).getTime();
            }
          }
        }
      }
      p++;
    }
  }

  fs.appendFileSync(file_name, `\n`);
  for(let i = 0; i < page_operation.length; i++){
    fs.appendFileSync(file_name, `${student_list[i]},`);
    for(let p = 0; p < page_operation[i].length;p++){
        fs.appendFileSync(file_name, `${page_operation[i][p].sync_late},`);
    }
    fs.appendFileSync(file_name, '\n');
  }
}

const Boot = async () => {
  let teacher_page_turning = await Query('select * from teacher_page_turning where url = "/documents/se6.pdf" and page_num > 0;', []);
  let student_page_turning = await Query('select * from student_page_turning where url = "/documents/se6.pdf" and page_num > 0 order by student_number, id;', []);
  Process(teacher_page_turning, student_page_turning);
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
