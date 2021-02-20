const wrap = (fn) => async (req, res, next) => {
  try {
    res.json(await fn(req, res) || {});
  } catch (error) {
    next(error);
  }
};
module.exports = wrap;
