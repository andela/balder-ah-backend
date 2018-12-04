const checkInput = (request, response, next) => {
  const {
    title,
    description,
    body,
  } = request.body;
  if (title.match(/^\s*$/g) || description.match(/^\s*$/g) || body.match(/^\s*$/g)) {
    return response.status(400).json({
      status: 'Fail',
      message: 'All fields are required',
    });
  }
  if (title.trim().length < 3 || title.trim().length >50) {
    return response.status(400).json({
      status: 'Fail',
      message: 'Please enter characters  between 3 and 50'
    });
  }
  if (description.trim().length < 5 || description.trim().length > 100) {
    return response.status(400).json({
      status: 'Fail',
      message: 'Please enter characters  between 5 and 100'
    });
  }
  return next();
};

export default checkInput;
