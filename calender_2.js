
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
  console.log(total);
  return ((current_num - 1) + first_date) % 7;
}



const Boot = () => {
  const year_last_day = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const tuki = ["JAN", "FEB", "MAR", "APR" , "MAY" ,"JUN" , "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  let first_date = 3;
  for(let i = 0; i < year_last_day.length; i++){
    console.log(`\n*** 2020 ${tuki[i]} ***`);
    first_date = prt_calendar(first_date, year_last_day[i]);
  }
  return 0;
};

Boot();
return;
