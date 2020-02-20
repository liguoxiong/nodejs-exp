export const asyncCatchError = fn =>  (req, res, next) => {
    fn(req, res, next).catch(next);
};
