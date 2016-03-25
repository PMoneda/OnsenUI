/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import util from 'ons/util';
import autoStyle from 'ons/autostyle';
import ModifierUtil from 'ons/internal/modifier-util';
import BaseElement from 'ons/base-element';

const scheme = {
  '.list__item': 'list__item--*',
  '.list__item__left': 'list__item--*__left',
  '.list__item__center': 'list__item--*__center',
  '.list__item__right': 'list__item--*__right',
  '.list__item__label': 'list__item--*__label',
  '.list__item__title': 'list__item--*__title',
  '.list__item__subtitle': 'list__item--*__subtitle',
  '.list__item__thumbnail': 'list__item--*__thumbnail',
  '.list__item__icon': 'list__item--*__icon'
};

/**
 * @element ons-list-item
 * @category list
 * @modifier tight
 *   [en]Remove the space above and below the item content. This is useful for multi-line content.[/en]
 *   [ja]行間のスペースを取り除きます。複数行の内容をリストで扱う場合に便利です。[/ja]
 * @modifier tappable
 *   [en]Make the list item change appearance when it's tapped. On iOS it is better to use the "tappable" attribute for better behavior when scrolling.[/en]
 *   [ja]タップやクリックした時に効果が表示されるようになります。[/ja]
 * @modifier chevron
 *   [en]Display a chevron at the right end of the list item and make it change appearance when tapped.[/en]
 *   [ja]要素の右側に右矢印が表示されます。また、タップやクリックした時に効果が表示されるようになります。[/ja]
 * @description
 *   [en]Component that represents each item in the list. Must be put inside the ons-list component.[/en]
 *   [ja]リストの各要素を表現するためのコンポーネントです。ons-listコンポーネントと共に使用します。[/ja]
 * @seealso ons-list
 *   [en]ons-list component[/en]
 *   [ja]ons-listコンポーネント[/ja]
 * @seealso ons-list-header
 *   [en]ons-list-header component[/en]
 *   [ja]ons-list-headerコンポーネント[/ja]
 * @guide UsingList
 *   [en]Using lists[/en]
 *   [ja]リストを使う[/ja]
 * @codepen yxcCt
 * @example
 * <ons-list>
 *   <ons-list-header>Header Text</ons-list-header>
 *   <ons-list-item>Item</ons-list-item>
 *   <ons-list-item>Item</ons-list-item>
 * </ons-list>
 */
class ListItemElement extends BaseElement {

  /**
   * @attribute modifier
   * @type {String}
   * @description
   *   [en]The appearance of the list item.[/en]
   *   [ja]各要素の表現を指定します。[/ja]
   */

  /**
   * @attribute lock-on-drag
   * @type {String}
   * @description
   *   [en]Prevent vertical scrolling when the user drags horizontally.[/en]
   *   [ja]この属性があると、ユーザーがこの要素を横方向にドラッグしている時に、縦方向のスクロールが起きないようになります。[/ja]
   */

  /**
   * @attribute tappable
   * @type {Color}
   * @description
   *   [en]Changes the background color when tapped. An optional color value can be defined. Default color is "#d9d9d9".[/en]
   *   [ja][/ja]
   */

  createdCallback() {
    if (!this.hasAttribute('_compiled')) {
      this._compile();
    }
  }

  _compile() {
    autoStyle.prepare(this);
    this.classList.add('list__item');

    let left, center, right;

    for (let i = 0; i < this.children.length; i++) {
      const el = this.children[i];

      if (el.classList.contains('left')) {
        el.classList.add('list__item__left');
        left = el;
      }
      else if (el.classList.contains('center')) {
        center = el;
      }
      else if (el.classList.contains('right')) {
        el.classList.add('list__item__right');
        right = el;
      }
    }

    if (!center) {
      center = document.createElement('div');

      if (!left && !right) {
        center.innerHTML = this.innerHTML;
        this.innerHTML = '';
      } else {

        for (let i = this.childNodes.length - 1; i >= 0; i--) {
          let el = this.childNodes[i];
          if (el !== left && el !== right) {
            center.insertBefore(el, center.firstChild);
          }
        }
      }

      this.insertBefore(center, right || null);
    }

    center.classList.add('center');
    center.classList.add('list__item__center');

    this._updateRipple();

    ModifierUtil.initModifier(this, scheme);

    this.setAttribute('_compiled', '');
  }

  attributeChangedCallback(name, last, current) {
    switch (name) {
      case 'modifier':
        ModifierUtil.onModifierChanged(last, current, this, scheme);
        break;
      case 'ripple':
        this._updateRipple();
    }
  }

  attachedCallback() {
    this.addEventListener('drag', this._onDrag);
    this.addEventListener('touchstart', this._onTouch);
    this.addEventListener('mousedown', this._onTouch);
    this.addEventListener('touchend', this._onRelease);
    this.addEventListener('touchmove', this._onRelease);
    this.addEventListener('touchcancel', this._onRelease);
    this.addEventListener('mouseup', this._onRelease);
    this.addEventListener('mouseout', this._onRelease);
    this.addEventListener('touchleave', this._onRelease);

    this._originalBackgroundColor = this.style.backgroundColor;

    this.tapped = false;
  }

  detachedCallback() {
    this.removeEventListener('drag', this._onDrag);
    this.removeEventListener('touchstart', this._onTouch);
    this.removeEventListener('mousedown', this._onTouch);
    this.removeEventListener('touchend', this._onRelease);
    this.removeEventListener('touchmove', this._onRelease);
    this.removeEventListener('touchcancel', this._onRelease);
    this.removeEventListener('mouseup', this._onRelease);
    this.removeEventListener('mouseout', this._onRelease);
    this.removeEventListener('touchleave', this._onRelease);
  }

  get _transition() {
    return 'background-color 0.0s linear 0.02s';
  }

  get _tappable() {
    return this.hasAttribute('tappable');
  }

  get _tapColor() {
    return this.getAttribute('tappable') || '#d9d9d9';
  }

  _updateRipple() {
    util.updateRipple(this);
  }

  _onDrag(event) {
    const gesture = event.gesture;
    // Prevent vertical scrolling if the users pans left or right.
    if (this._shouldLockOnDrag() && ['left', 'right'].indexOf(gesture.direction) > -1) {
      gesture.preventDefault();
    }
  }

  _onTouch() {
    if (this.tapped) {
      return;
    }

    this.tapped = true;

    this.style.transition = this._transition;
    this.style.webkitTransition = this._transition;
    this.style.MozTransition = this._transition;

    if (this._tappable) {
      if (this.style.backgroundColor) {
        this._originalBackgroundColor = this.style.backgroundColor;
      }

      this.style.backgroundColor = this._tapColor;
    }
  }

  _onRelease() {
    this.tapped = false;

    this.style.transition = '';
    this.style.webkitTransition = '';
    this.style.MozTransition = '';

    this.style.backgroundColor = this._originalBackgroundColor || '';
  }

  _shouldLockOnDrag() {
    return this.hasAttribute('lock-on-drag');
  }
}

window.OnsListItemElement = document.registerElement('ons-list-item', {
  prototype: ListItemElement.prototype
});
