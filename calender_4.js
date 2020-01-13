const fs = require('fs');

const format_padding = (holiday_list, month, day) => {
  const current_holiday_list = chk_holiday(holiday_list, month, day);
  let format_num;
  if(current_holiday_list){
    format_num = '@' + ('    ' + day).slice(-2);
    holiday_list = current_holiday_list;
  }else{
    format_num = ('    ' + day).slice(-3);
  }
  return format_num;
}

const add_holiday = () => {
  var fileName = './2020holidays.txt';
  const msg = fs.readFileSync(fileName, {encoding: "utf-8"});
  let holiday_list = msg.split('\n');

  for(let i = 0; i < holiday_list.length; i++){
    holiday_list[i] = holiday_list[i].split(' ');
  }

  return holiday_list;
}

const chk_holiday = (holiday_list, month, day) => {
  if(month + 1 !== parseInt(holiday_list[0][0]))return null;
  if(day !== parseInt(holiday_list[0][1]))return null;

  return holiday_list.shift();
}

// ここにやりたい処理を入れる
const out_calender = (holiday_list) => {
  const tuki = ["JAN", "FEB", "MAR", "APR" , "MAY" ,"JUN" , "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const youbi = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const year_last_day = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let first_date = 3;
  for(let i = 0; i < year_last_day.length; i++){
    fs.appendFileSync('./calender.txt', `*** 2020 ${tuki[i]} ***\n`);

    let total = "";
    for(let i of youbi)total += `${i} `;
    total += '\n';

    // 月曜開始なら０、日曜開始なら１
    let current_num = 1 - first_date;
    while(current_num <= year_last_day[i]){
      if(current_num <= 0){
        total += '*** ';
      }else{
        const format_num = format_padding(holiday_list, i, current_num);
        total += `${format_num} `;
        if((current_num + first_date) % 7 == 0)total += "\n";
      }
      current_num++;
    }
    fs.appendFileSync('./calender.txt', total + '\n');
    first_date = ((current_num - 1) + first_date) % 7;
  }
}

const Boot = () => {
  fs.writeFileSync('./calender.txt', '');
  const holiday_list = add_holiday();
  out_calender(holiday_list);
  return 0;
};

Boot();
return;
