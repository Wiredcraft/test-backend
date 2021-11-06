import log4js from 'log4js';

export const initSpec = (spec?: log4js.Configuration):log4js.Log4js => {
    if (spec) {
        log4js.configure(spec);
    }
    
    return log4js;
};
