'use strict';

describe('ons.notification', () => {
  it('exists', () => {
    expect(ons.notification).to.be.ok;
  });

  describe('#alert()', () => {
    let dialog,
      resolvePromise,
      callback = chai.spy();

    beforeEach(() => {
      resolvePromise = ons.notification.alert({message: 'hoge', modifier: 'fuga', cancelable: true, callback: callback});
      dialog = document.body.querySelector('ons-alert-dialog');
    });

    afterEach(() => {
      if (dialog.parentNode) {
        dialog.destroy();
      }
      dialog = null;
    });

    it('requires a message', () => {
      expect(() => ons.notification.alert()).to.throw(Error);
    });

    it('accepts a \'messageHTML\' parameter', () => {
      let message = '<strong>hoge</strong>';
      ons.notification.alert({messageHTML: message, id: 'test'});
      let dialog = document.getElementById('test');
      expect(dialog.innerHTML.indexOf(message)).to.be.above(-1);
      dialog.destroy();
    });

    it('displays an alert dialog', () => {
      expect(dialog).to.be.ok;
      expect(dialog.innerHTML.indexOf('hoge')).to.be.above(-1);
    });

    it('accepts a \'modifier\' parameter', () => {
      expect(dialog.getAttribute('modifier').indexOf('fuga')).to.be.above(-1);
    });

    it('hides the dialog when a button is clicked', () => {
      let button = dialog.querySelector('button');
      let event = new CustomEvent('click');
      let spy = chai.spy.on(dialog, 'hide');
      button.dispatchEvent(event);
      expect(spy).to.have.been.called.once;
    });

    it('resolves to the pressed button index', (done) => {
      resolvePromise.then(index => {
        expect(index).to.equal(0);
        done();
      });

      dialog.querySelector('button').click();
    });
  });

  describe('#confirm()', () => {
    let dialog,
      resolvePromise,
      callback = chai.spy();

    beforeEach(() => {
      resolvePromise = ons.notification.confirm({message: 'hoge', modifier: 'fuga', cancelable: true, callback: callback});
      dialog = document.body.querySelector('ons-alert-dialog');
    });

    afterEach(() => {
      if (dialog.parentNode) {
        dialog.destroy();
      }
      dialog = null;
    });

    it('requires a message', () => {
      expect(() => ons.notification.confirm()).to.throw(Error);
    });

    it('accepts a \'messageHTML\' parameter', () => {
      let message = '<strong>hoge</strong>';
      ons.notification.confirm({messageHTML: message, id: 'test'});
      let dialog = document.getElementById('test');
      expect(dialog.innerHTML.indexOf(message)).to.be.above(-1);
      dialog.destroy();
    });

    it('displays an alert dialog', () => {
      expect(dialog).to.be.ok;
      expect(dialog.innerHTML.indexOf('hoge')).to.be.above(-1);
    });

    it('accepts a \'modifier\' parameter', () => {
      expect(dialog.getAttribute('modifier').indexOf('fuga')).to.be.above(-1);
    });

    it('hides the dialog when a button is clicked', () => {
      let button = dialog.querySelector('button');
      let event = new CustomEvent('click');
      let spy = chai.spy.on(dialog, 'hide');
      button.dispatchEvent(event);
      expect(spy).to.have.been.called.once;
    });

    it('accepts a \'cancelable\' attribute', () => {
      let event = new CustomEvent('cancel');
      dialog.dispatchEvent(event);
      expect(callback).to.have.been.called.with(-1);
    });

    it('resolves to the pressed button index', (done) => {
      resolvePromise.then(index => {
        expect(index).to.equal(0);
        done();
      });

      dialog.querySelector('button').click();
    });
  });

  describe('#prompt()', () => {
    let dialog,
      resolvePromise,
      callback = chai.spy();

    beforeEach(() => {
      resolvePromise = ons.notification.prompt({message: 'hoge', modifier: 'fuga', submitOnEnter: true, cancelable: true, callback: callback});
      dialog = document.body.querySelector('ons-alert-dialog');
    });

    afterEach(() => {
      if (dialog.parentNode) {
        dialog.destroy();
      }
      dialog = null;
    });

    it('requires a message', () => {
      expect(() => ons.notification.prompt()).to.throw(Error);
    });

    it('accepts a \'messageHTML\' parameter', () => {
      let message = '<strong>hoge</strong>';
      ons.notification.prompt({messageHTML: message, id: 'test'});
      let dialog = document.getElementById('test');
      expect(dialog.innerHTML.indexOf(message)).to.be.above(-1);
      dialog.destroy();
    });

    it('displays an alert dialog', () => {
      expect(dialog).to.be.ok;
      expect(dialog.innerHTML.indexOf('hoge')).to.be.above(-1);
    });

    it('accepts a \'modifier\' parameter', () => {
      expect(dialog.getAttribute('modifier').indexOf('fuga')).to.be.above(-1);
    });

    it('accepts a \'submitOnEnter\' parameter', () => {
      let input = dialog.querySelector('input'),
        event = new CustomEvent('keypress');
      event.keyCode = 13;

      let spy = chai.spy.on(dialog, 'hide');

      input.dispatchEvent(event);
      expect(spy).to.have.been.called.once;
    });

    it('hides the dialog when a button is clicked', () => {
      let button = dialog.querySelector('button');
      let event = new CustomEvent('click');
      let spy = chai.spy.on(dialog, 'hide');
      button.dispatchEvent(event);
      expect(spy).to.have.been.called.once;
    });

    it('accepts a \'cancelable\' attribute', () => {
      let event = new CustomEvent('cancel');
      dialog.dispatchEvent(event);
      expect(callback).to.have.been.called.with(null);
    });

    it('resolves to the input value', (done) => {
      resolvePromise.then(value => {
        expect(value).to.equal('42');
        done();
      });

      dialog.querySelector('input').value = 42;
      dialog.querySelector('button').click();
    });
  });

  describe('autoStyling', () => {
    it('adds \'material\' modifier on Android', () => {
      ons.platform.select('android');
      ons.notification.alert({message: 'test', id: 'test'});
      let dialog = document.getElementById('test');
      expect(dialog.getAttribute('modifier')).to.equal('material');
      ons.platform.select('');
      dialog.remove();
    });

    it('removes \'material\' modifier on iOS', () => {
      ons.platform.select('ios');
      ons.notification.alert({message: 'test', id: 'test'});
      let dialog = document.getElementById('test');
      expect(dialog.getAttribute('modifier')).not.to.equal('material');
      ons.platform.select('');
      dialog.remove();
    });
  });
});
