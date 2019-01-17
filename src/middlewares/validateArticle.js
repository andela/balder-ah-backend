const checkInput = (request, response, next) => {
  const {
    title,
    description,
    body,
    tags,
    imgUrl,
  } = request.body;
  const errors = [];
  const myRegex = /(https?:\/\/.*\.(?:png|jpg|JPEG|JPG|GIF))/i;
  if (imgUrl && !myRegex.test(imgUrl.trim())) {
    const error = {
      message: 'please enter a valid image URL'
    };
    errors.push(error);
  }
  if (title.match(/^\s*$/g) || description.match(/^\s*$/g) || body.match(/^\s*$/g)) {
    const error = {
      message: 'The title, description and the article body are required'
    };
    errors.push(error);
  }
  if (title.trim().length < 3 || title.trim().length > 50) {
    const error = {
      message: 'Title characters should be between 3 and 50'
    };
    errors.push(error);
  }
  if (description.trim().length < 5 || description.trim().length > 100) {
    const error = {
      message: 'Description characters should be between 3 and 50'
    };
    errors.push(error);
  }
  if (tags === undefined) {
    const error = {
      message: 'Please add a tags field'
    };
    errors.push(error);
  }
  if (!Array.isArray(tags)) {
    const error = {
      message: 'Please tags imput should be an array a tags'
    };
    errors.push(error);
  }
  const isArrayOfStrings = tags && typeof tags === 'object' ? tags.every(tag => typeof tag === 'string' && tag.length > 0) : null;
  if (!isArrayOfStrings) {
    const error = {
      message: 'Please all tags should be strings'
    };
    errors.push(error);
  }
  if (errors.length > 0) {
    return response.status(400).json({
      errors: { body: errors.map(error => error.message) }
    });
  }
  return next();
};

export default checkInput;
