exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg, detail: err.detail })
  }
  else next(err);
  };
  
  exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '23502' || err.code === '22P02') {
      res.status(400).send({ msg: 'bad request', detail : 'Invalid data type' });
    } else if (err.code === '23503') {
      res.status(404).send({ msg: 'Route not found' });
    }
  
    next(err);
  };
  
  exports.handleServerErrrors = (err, req, res, next) => {
    console.log(err, 'Uncaught Error');
    res.status(500).send('Internal server error');
  };