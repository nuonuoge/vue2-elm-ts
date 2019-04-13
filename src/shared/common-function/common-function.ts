export const GetImgPath = (path) => {
  let suffix;
  if (!path) {
    return '//elm.cangdu.org/img/default.jpg';
  }
  if (path.indexOf('jpeg') !== -1) {
    suffix = '.jpeg';
  } else {
    suffix = '.png';
  }
  const url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
  return 'https://fuss10.elemecdn.com' + url;
};
