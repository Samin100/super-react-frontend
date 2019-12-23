import moment from 'moment';

export function fake_data(start_date, end_date, min, max) {
  // generates fake data
  let start = moment(start_date);
  let end = moment(end_date);
  let data = [];
  for (var m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
    let obj = {
      count: Math.floor(Math.random() * (max - min + 1) + min),
      date: m.format('YYYY-MM-DD')
    }
    data.push(obj);
  }
  return data;
}
