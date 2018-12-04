import ArticleModel from '../helpers/articles';

const verifySlug = {
  slugChecker: async (request, response, next) => {
    const articleSlug = request.params.slug;
    const foundArticle = await ArticleModel.checkSlug(articleSlug);
    if (foundArticle.slug === articleSlug) {
      return next();
    }
    return response.status(404).json({
      status: 'Fail',
      message: 'Article not found'
    });
  }
};

export default verifySlug;
