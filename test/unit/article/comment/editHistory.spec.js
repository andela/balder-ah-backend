import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import Comment from '../../../../src/controllers/comment';
import errorResponse from '../../../../src/helpers';
import models from '../../../../src/db/models';

chai.should();
chai.use(sinonChai);

const { Comment: CommentModel } = models;

describe('Edit comment', () => {
  afterEach(() => sinon.restore());

  describe('Validates comment ID', () => {
    it('should return error for comment ID that is not a number', async () => {
      const request = {
        params: { commentId: 'invalid' }
      };
      const response = {
        status() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();
      await Comment.update(request, response);
      expect(response.status).to.have.been.calledWith(400);
    });

    it('should error for no ID supplied', async () => {
      const request = {
        params: {}
      };
      const response = {
        status() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();
      sinon.spy(response, 'json');
      await Comment.update(request, response);
      expect(response.status).to.have.been.calledWith(400);
      expect(response.json).to.have.been.calledWith(errorResponse(['Please provide ID of comment to update']));
    });
  });

  it('should not allow user to update another user\'s comment', async () => {
    const request = {
      params: {
        commentId: 1
      },
      userData: {
        payload: {
          id: 2
        }
      }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(CommentModel, 'findByPk').resolves({
      id: 1,
      userId: 4,
    });

    await Comment.update(request, response);
    expect(response.status).to.have.been.calledWith(403);
  });

  it('should fail to find comment by ID', async () => {
    const request = {
      params: { commentId: 1 },
      userData: {
        payload: {
          id: 2
        }
      },
      body: { body: 'nice article' }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(CommentModel, 'findByPk').resolves(false);

    await Comment.update(request, response);

    expect(response.status).to.have.been.calledWith(404);
  });


  it('should error for invalid comment body', async () => {
    const request = {
      params: { commentId: 1 },
      userData: {
        payload: {
          id: 2
        }
      },
      body: { body: '   ' }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(CommentModel, 'findByPk').resolves({
      userId: 2
    });

    await Comment.update(request, response);

    expect(response.status).to.have.been.calledWith(400);
  });

  it('should not update if new comment is same as old', async () => {
    const request = {
      params: { commentId: 1 },
      userData: {
        payload: {
          id: 2
        }
      },
      body: { body: 'nice article' }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(CommentModel, 'findByPk').resolves({
      userId: 2,
      body: 'nice article'
    });

    await Comment.update(request, response);

    expect(response.status).to.have.been.calledWith(200);
  });

  it('should encounter server error', async () => {
    const request = {
      params: { commentId: 1 },
      userData: {
        payload: {
          id: 2
        }
      },
      body: { body: 'nice article' }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(CommentModel, 'findByPk').throws();

    await Comment.update(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('should update/edit comment for the first time', async () => {
    const request = {
      params: { commentId: 1 },
      userData: {
        payload: {
          id: 2
        }
      },
      body: { body: 'nice article' }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    const save = sinon.spy();
    sinon.stub(CommentModel, 'findByPk').resolves({
      userId: 2,
      body: 'awesome',
      updatedAt: '2018-12-20',
      history: [null],
      save
    });

    await Comment.update(request, response);

    expect(response.status).to.have.been.calledWith(200);
    expect(save.calledOnce).to.equal(true);
  });

  it('should update/edit comment again', async () => {
    const request = {
      params: { commentId: 1 },
      userData: {
        payload: {
          id: 2
        }
      },
      body: { body: 'nice article' }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    const save = sinon.spy();
    sinon.stub(CommentModel, 'findByPk').resolves({
      userId: 2,
      body: 'awesome',
      updatedAt: '2018-12-20',
      history: [{ body: 'yay' }],
      save
    });

    await Comment.update(request, response);

    expect(response.status).to.have.been.calledWith(200);
    expect(save.calledOnce).to.equal(true);
  });
});
