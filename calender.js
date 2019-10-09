
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
}



const Boot = () => {
  console.log("*** 2019年10月 ***");
  prt_calendar(2, 31);
  return 0;
};

Boot();
return;
