'use strict';

describe('OnsSplitterElement', () => {
  it('exists', () => {
    expect(window.OnsSplitterElement).to.be.ok;
  });

  let splitter;
  beforeEach(() => {
    splitter = ons._util.createElement(`
      <ons-splitter>
        <ons-splitter-side side="left">Left</ons-splitter-side>
        <ons-splitter-side side="right" collapse>Right</ons-splitter-side>
        <ons-splitter-content></ons-splitter-content>
      </ons-splitter>
    `);

    document.body.appendChild(splitter);
  });

  afterEach(() => {
    splitter.remove();
    splitter = null;
  });

  it('provides _hide(), _show(), _destroy() methods', () => {
    expect(splitter._hide instanceof Function).to.be.ok;
    expect(splitter._show instanceof Function).to.be.ok;
    expect(splitter._destroy instanceof Function).to.be.ok;
  });

  describe('page lifecycle events propagation', () => {
    it('should trigger "init" lifecyle event', (done) => {
      const splitter = ons._util.createElement(`
        <ons-splitter>
          <ons-splitter-content><ons-page>content</ons-page></ons-splitter-content>
        </ons-splitter>
      `);

      document.body.addEventListener('init', event => {
        expect(event.target.nodeName.toLowerCase()).to.be.equal('ons-page');
        splitter.remove();
        done();
      });

      document.body.appendChild(splitter);
    });

    it('should trigger "show" lifecyle event', (done) => {
      const splitter = ons._util.createElement(`
        <ons-splitter>
          <ons-splitter-content><ons-page>content</ons-page></ons-splitter-content>
        </ons-splitter>
      `);

      document.body.addEventListener('show', (event) => {
        expect(event.target.nodeName.toLowerCase()).to.be.equal('ons-page');
        splitter.remove();
        done();
      });

      document.body.appendChild(splitter);
    });
  });


  describe('#openRight()', () => {
    it('should open right ons-splitter-side', () => {
      return expect(splitter.openRight()).to.eventually.be.fulfilled.then(() => {
        expect(splitter.rightIsOpen()).to.be.true;
        return expect(splitter.openLeft()).to.eventually.be.fulfilled.then(e => expect(e).not.to.be.ok);
      });
    });
  });

  describe('#openLeft()', () => {
    it('should be rejected on "split" mode with ons-splitter-side element', () => {
      return expect(splitter.openLeft()).to.eventually.be.fulfilled.then(e => expect(e).not.to.be.ok);
    });
  });

  describe('#closeRight()', () => {
    it('should close right ons-splitter-side', () => {
      expect(splitter.rightIsOpen()).to.be.false;
      return splitter.openRight().then(() => {
        expect(splitter.rightIsOpen()).to.be.true;
        return expect(splitter.closeRight()).to.eventually.be.fulfilled.then(() => {
          expect(splitter.rightIsOpen()).to.be.false;
        });
      });
    });
  });

  describe('#closeLeft()', () => {
    it('should be rejected on "split" mode with ons-splitter-side element', () => {
      expect(splitter.closeLeft()).to.eventually.be.rejected;
    });
  });

  describe('#getDeviceBackButtonHandler()', () => {
    it('should return handler object', () => {
      expect(splitter.getDeviceBackButtonHandler()).to.be.an('object');
    });
  });

  describe('#_compile()', () => {
    it('does not compile twice', () => {
      let div1 = document.createElement('div');
      let div2 = document.createElement('div');
      div1.innerHTML = `
        <ons-splitter>
          <ons-splitter-side side="left">Left</ons-splitter-side>
          <ons-splitter-side side="right" collapse>Right</ons-splitter-side>
          <ons-splitter-content>Content</ons-splitter-content>
        </ons-splitter>
      `;
      div2.innerHTML = div1.innerHTML;
      expect(div1.isEqualNode(div2)).to.be.true;
    });
  });
});
