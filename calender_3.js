const fs = require('fs');

const format_padding = (num) => {
  return ('    ' + num).slice(-3);
}

// ここにやりたい処理を入れる
const prt_calendar = (first_date, last_day) => {
  let total = "";
  const youbi = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  for(let i of youbi)total += `${i} `;
  total += '\n';

  // 月曜開始なら０、日曜開始なら１
  let current_num = 1 - first_date;
  while(current_num <= last_day){
    if(current_num <= 0){
      total += '*** ';
    }else{
      const format_num = format_padding(current_num);
      total += `${format_num} `;
      if((current_num + first_date) % 7 == 0)total += "\n";
    }
    current_num++;
  }
  fs.appendFileSync('./calender.txt', total + '\n');
  return ((current_num - 1) + first_date) % 7;
}



const Boot = () => {
  fs.writeFileSync('./calender.txt', '');

  const year_last_day = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const tuki = ["JAN", "FEB", "MAR", "APR" , "MAY" ,"JUN" , "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  let first_date = 3;
  for(let i = 0; i < year_last_day.length; i++){
    fs.appendFileSync('./calender.txt', `*** 2020 ${tuki[i]} ***\n`);
    first_date = prt_calendar(first_date, year_last_day[i]);
  }
  return 0;
};

Boot();
return;
