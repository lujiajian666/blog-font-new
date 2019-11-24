import common from './common';
const develop = {
  baseUrl: 'http://www.lujiajian.xyz'
}

const product = {
  baseUrl: 'http://www.lujiajian.xyz'
}
let ex = product;
console.log('环境' + process.env.HOST_ENV)
if (process.env.HOST_ENV === 'dev') {
  ex = develop;
}
export default {
  ...common,
  ...ex
}