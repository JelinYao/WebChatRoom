var log4js = require('log4js');
log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {//控制台输出
            type: 'console',
        },
        req: {//请求转发日志
            type: 'dateFile',//制定日志文件按照时间打印
            //filename: 'logs/reqlog/req',//制定输出文件日志
            filename: 'req',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        err: {//错误日志
            type: 'dateFile',
            filename: 'logs/errlog/err',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        oth: {//其他日志
            type: 'dateFile',
            filename: 'logs/errlog/err',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        //appenders:采用的appender,取appenders项,level:设置级别
        default: {appenders: ['stdout', 'req'], level: 'debug'},
        err: { appenders: ['stdout', 'err'], level: 'error' },
    }  
});


exports.getLogger = function(name) {
    //name取categories项
    return log4js.getLogger(name || 'default');
};