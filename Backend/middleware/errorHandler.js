const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose/PostgreSQL duplicate key error
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }
  
  // Mongoose/PostgreSQL validation error
  if (err.code === '23502') {
    return res.status(400).json({
      success: false,
        message: 'Required field missing'
});
}
// JWT errors
if (err.name === 'JsonWebTokenError') {
return res.status(401).json({
success: false,
message: 'Invalid token'
});
}
if (err.name === 'TokenExpiredError') {
return res.status(401).json({
success: false,
message: 'Token expired'
});
}
// Default error
res.status(err.statusCode || 500).json({
success: false,
message: err.message || 'Server Error',
...(process.env.NODE_ENV === 'development' && { stack: err.stack })
});
};
module.exports = errorHandler;