if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}
//개발환경이 로컬인지 배포 이후 프로덕션 모드인지에 따라 앱을 시작했을때 환경을 나눠주는 분기점