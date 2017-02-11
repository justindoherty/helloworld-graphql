import { HelloworldGraphqlPage } from './app.po';

describe('helloworld-graphql App', function() {
  let page: HelloworldGraphqlPage;

  beforeEach(() => {
    page = new HelloworldGraphqlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
