import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect } from 'chai';
import ReportArticle from '../../../../src/controllers/reportArticle';
import models from '../../../../src/db/models';
import errorResponse from '../../../../src/helpers';

chai.should();
chai.use(sinonChai);

const { Report } = models;

describe('Report Article', () => {
  afterEach(() => sinon.restore());

  it('fails to report an article with invalid report type', async () => {
    const request = {
      body: {}
    };
    const response = {
      status() {},
      send() {}
    };

    sinon.stub(response, 'status').returnsThis();
    await ReportArticle.report(request, response);

    expect(response.status).to.have.been.calledWith(400);
  });

  it('throws when reporting an article', async () => {
    const request = {
      body: { type: 'spam' },
      userData: { payload: { id: 1 } },
      article: { id: 3 }
    };

    const response = {
      status() {},
      send() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(Report, 'create').throws();
    await ReportArticle.report(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('ask for context when report type is \'other\'', async () => {
    const request = {
      body: { type: 'other' },
      userData: { payload: { id: 1 } },
      article: { id: 3 }
    };

    const response = {
      status() {},
      send() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.spy(response, 'send');
    sinon.stub(Report, 'create').resolves(true);

    await ReportArticle.report(request, response);

    expect(response.status).to.have.been.calledWith(400);
    expect(response.send).to.have.been.calledWith(errorResponse(["Please help us understand why you're reporting this article by providing context."]));
  });

  it('reports an article', async () => {
    const request = {
      body: { type: 'spam' },
      userData: { payload: { id: 1 } },
      article: { id: 3 }
    };

    const response = {
      status() {},
      send() {}
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.spy(response, 'send');
    sinon.stub(Report, 'create').resolves(true);

    await ReportArticle.report(request, response);

    expect(response.send).to.have.been.calledWith({ success: { msg: 'Report received' } });
  });
});
