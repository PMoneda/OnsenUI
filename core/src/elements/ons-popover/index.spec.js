'use strict';

describe('OnsPopoverElement', () => {
  let popover, target;
  const popoverDisplay = () => window.getComputedStyle(popover).getPropertyValue('display');

  beforeEach(() => {
    popover = new OnsPopoverElement();
    target = ons._util.createElement('<div>Target</div>');

    document.body.appendChild(target);
    document.body.appendChild(popover);
  });

  afterEach(() => {
    popover.remove();
    target.remove();
    popover = target = null;
  });

  it('exists', () => {
    expect(window.OnsPopoverElement).to.be.ok;
  });

  it('provides \'modifier\' attribute', () => {
    let container = popover.querySelector('.popover__container'),
      content = popover.querySelector('.popover__content');

    popover.setAttribute('modifier', 'hoge');
    expect(popover.classList.contains('popover--hoge')).to.be.true;
    expect(container.classList.contains('popover__container--hoge')).to.be.true;
    expect(content.classList.contains('popover__content--hoge')).to.be.true;

    popover.setAttribute('modifier', ' foo bar');
    expect(popover.classList.contains('popover--foo')).to.be.true;
    expect(popover.classList.contains('popover--bar')).to.be.true;
    expect(popover.classList.contains('popover--hoge')).not.to.be.true;
    expect(container.classList.contains('popover__container--foo')).to.be.true;
    expect(container.classList.contains('popover__container--bar')).to.be.true;
    expect(container.classList.contains('popover__container--hoge')).not.to.be.true;
    expect(content.classList.contains('popover__content--foo')).to.be.true;
    expect(content.classList.contains('popover__content--bar')).to.be.true;
    expect(content.classList.contains('popover__content--hoge')).not.to.be.true;

    popover.classList.add('popover--piyo');
    container.classList.add('popover__container--piyo');
    popover.setAttribute('modifier', 'fuga');
    expect(popover.classList.contains('popover--piyo')).to.be.true;
    expect(popover.classList.contains('popover--fuga')).to.be.true;
    expect(container.classList.contains('popover__container--piyo')).to.be.true;
    expect(container.classList.contains('popover__container--fuga')).to.be.true;
  });

  it('should be hidden by default', () => {
    expect(popoverDisplay()).to.equal('none');
  });

  describe('elements', () => {
    ['_mask', '_popover', '_content', '_arrow'].forEach(name => {
      it(`has an element '${name}'`, () => {
        expect(popover[name]).to.be.an.instanceof(HTMLElement);
      });
    });
  });

  describe('#_onDeviceBackButton()', () => {
    it('should hide the popover if it is cancelable', () => {
      popover.setAttribute('animation', 'none');
      popover.setAttribute('cancelable', '');

      popover.show(target);
      expect(popoverDisplay()).to.equal('block');

      popover._onDeviceBackButton({callParentHandler: () => {}});
      expect(popoverDisplay()).to.equal('none');
    });

    it('should not hide the popover if it is not cancelable', () => {
      popover.setAttribute('animation', 'none');

      popover.show(target);
      expect(popoverDisplay()).to.equal('block');

      popover._onDeviceBackButton({callParentHandler: () => {}});
      expect(popoverDisplay()).to.equal('block');
    });
  });

  describe('#show()', () => {
    it('throws an error when called with invalid targets', () => {
      expect(() => popover.show()).to.throw(Error);
      expect(() => popover.show(42)).to.throw(Error);
      expect(() => popover.show({})).to.throw(Error);
      expect(() => popover.show([])).to.throw(Error);
      expect(() => popover.show(null)).to.throw(Error);
    });

    it('accepts an HTML element', () => {
      expect(popoverDisplay()).to.equal('none');
      popover.show(target);
      expect(popoverDisplay()).to.equal('block');
    });

    it('accepts a CSS selector', () => {
      expect(popoverDisplay()).to.equal('none');
      popover.show('div');
      expect(popoverDisplay()).to.equal('block');
    });

    it('accepts an Event object', () => {
      var ev = new Event('dummy');
      target.dispatchEvent(ev);
      expect(popoverDisplay()).to.equal('none');
      popover.show(ev);
      expect(popoverDisplay()).to.equal('block');
    });

    it('has an \'animationOptions\' parameter', () => {
      expect(() => popover.show(target, {animationOptions: {'duration': 1.0, delay: 1.0}}))
        .not.to.throw(Error);
    });

    describe('\'preshow\' event', () => {
      it('is fired', () => {
        let promise = new Promise(resolve => popover.addEventListener('preshow', resolve));
        popover.show(target);
        return expect(promise).to.eventually.be.fulfilled;
      });

      it('can be cancelled', () => {
        popover.addEventListener('preshow', e => e.cancel());
        popover.show(target);
        expect(popoverDisplay()).to.equal('none');
      });
    });

    describe('\'postshow\' event', () => {
      it('is fired', () => {
        let promise = new Promise(resolve => popover.addEventListener('postshow', resolve));
        popover.show(target);
        return expect(promise).to.eventually.be.fulfilled;
      });
    });

    it('returns a promise that resolves to the displayed element', () => {
      return expect(popover.show(target)).to.eventually.be.fulfilled.then(element => {
        expect(element).to.equal(popover);
        expect(popoverDisplay()).to.equal('block');
      });
    });
  });

  describe('#hide()', () => {
    beforeEach(() => {
      popover.show(target, {animation: 'none'});
    });

    it('hides the popover', () => {
      expect(popoverDisplay()).to.equal('block');
      popover.hide({animation: 'none'});
      expect(popoverDisplay()).to.equal('none');
    });

    describe('\'prehide\' event', () => {
      it('is fired', () => {
        let promise = new Promise(resolve => popover.addEventListener('prehide', resolve));
        popover.hide();
        return expect(promise).to.eventually.be.fulfilled;
      });

      it('can be cancelled', () => {
        popover.addEventListener('prehide', e => e.cancel());
        popover.hide({animation: 'none'});
        expect(popoverDisplay()).to.equal('block');
      });
    });

    describe('\'posthide\' event', () => {
      it('is fired', () => {
        let promise = new Promise(resolve => popover.addEventListener('posthide', resolve));
        popover.hide();
        return expect(promise).to.eventually.be.fulfilled;
      });
    });

    it('returns a promise that resolves to the hidden element', () => {
      return expect(popover.hide()).to.eventually.be.fulfilled.then(element => {
        expect(element).to.equal(popover);
        expect(popoverDisplay()).to.equal('none');
      });
    });
  });

  describe('#isShown()', () => {
    it('should return \'true\' if popover is visible', () => {
      popover.show(target, {animation: 'none'});
      expect(popover.isShown()).to.be.true;
    });

    it('should return \'false\' if popover is not visible', () => {
      expect(popover.isShown()).to.be.false;
    });
  });

  describe('#setCancelable()', () => {
    it('only accepts boolean arguments', () => {
      expect(() => popover.setCancelable()).to.throw(Error);
      expect(() => popover.setCancelable('hoge')).to.throw(Error);
      expect(() => popover.setCancelable(true)).not.to.throw(Error);
      expect(() => popover.setCancelable(false)).not.to.throw(Error);
    });

    it('sets the \'cancelable\' attribute', () => {
      expect(popover.hasAttribute('cancelable')).to.be.false;
      popover.setCancelable(true);
      expect(popover.hasAttribute('cancelable')).to.be.true;
    });

    it('removes the \'cancelable\' attribute', () => {
      popover.setAttribute('cancelable', '');
      popover.setCancelable(false);
      expect(popover.hasAttribute('cancelable')).to.be.false;
    });
  });

  describe('#isCancelable()', () => {
    it('returns \'true\' if \'cancelable\' attribute exists', () => {
      popover.setAttribute('cancelable', '');
      expect(popover.isCancelable()).to.be.true;
    });

    it('returns \'false\' if \'cancelable\' attribute does not exist', () => {
      expect(popover.isCancelable()).to.be.false;
    });
  });

  describe('#destroy()', () => {
    it('should remove the popover from the DOM', () => {
      expect(popover.parentNode).to.be.ok;
      popover.destroy();
      expect(popover.parentNode).not.to.be.ok;
    });
  });

  describe('#_cancel()', () => {
    it('should hide the popover if it is not cancelable', () => {
      popover.show(target, {animation: 'none'});
      popover._cancel();
      expect(popoverDisplay()).to.equal('block');
    });

    it('should hide the popover if it is cancelable', () => {
      popover.setAttribute('animation', 'none');
      popover.show(target);
      popover.setAttribute('cancelable', '');
      popover._cancel();
      expect(popoverDisplay()).to.equal('none');
    });
  });

  describe('\'direction\' attribute', () => {
    const classes = {
      up: 'popover--bottom',
      down: 'popover--top',
      left: 'popover--right',
      right: 'popover--left'
    };

    Object.keys(classes).forEach(key => {
      it(`can have the value '${key}'`, () => {
        popover.setAttribute('direction', key);
        popover.show(target, {animation: 'none'});
        expect(popover._popover.classList.contains(classes[key])).to.be.true;
      });
    });

  });

  describe('\'mask-color\' attribute', () => {
    let popover = ons._util.createElement('<ons-popover mask-color="red"></ons-popover>');
    expect(popover._mask.style.backgroundColor).to.equal('red');
  });

  describe('\'style\' attribute', () => {
    let popover = ons._util.createElement('<ons-popover style="background: blue">Test</ons-popover>');
    expect(popover._popover.style.background).to.equal('blue');
  });


  describe('#registerAnimator()', () => {
    it('throws an error if animator is not a PopoverAnimator', () => {
      expect(() => window.OnsPopoverElement.registerAnimator('hoge', 'hoge')).to.throw(Error);
    });

    it('registers a new animator', () => {
      class MyAnimator extends window.OnsPopoverElement.PopoverAnimator {
      }

      window.OnsPopoverElement.registerAnimator('hoge', MyAnimator);
    });
  });

  describe('#_compile()', () => {
    it('does not compile twice', () => {
      let div1 = document.createElement('div');
      let div2 = document.createElement('div');
      div1.innerHTML = '<ons-popover></ons-popover>';
      div2.innerHTML = div1.innerHTML;
      expect(div1.isEqualNode(div2)).to.be.true;
    });
  });

  describe('autoStyling', () => {
    it('adds \'material\' modifier on Android', () => {
      ons.platform.select('android');
      let e = document.createElement('ons-popover');
      expect(e.getAttribute('modifier')).to.equal('material');
      ons.platform.select('');
    });
  });
});

