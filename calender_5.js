const Boot = () => {
  let current_date = new Date();
  let orinpic = new Date('2020-07-24 20:00:00');
  let difference = Math.floor((orinpic - current_date) / 86400000);
  console.log(`オリンピックまであと${difference}日!!`);
  return 0;
};

Boot();
return;
