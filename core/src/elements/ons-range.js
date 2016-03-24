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

import autoStyle from 'ons/autostyle';
import ModifierUtil from 'ons/internal/modifier-util';
import BaseElement from 'ons/base-element';

const scheme = {
  '.range': 'range--*',
  '.range__left': 'range--*__left'
};

const INPUT_ATTRIBUTES = [
  'autofocus',
  'disabled',
  'inputmode',
  'max',
  'min',
  'name',
  'placeholder',
  'readonly',
  'size',
  'step',
  'validator',
  'value'
];

/**
 * @element ons-range
 * @category form
 * @description
 *   [en]Range input component.[/en]
 *   [ja][/ja]
 * @codepen xZQomM
 * @guide UsingFormComponents
 *   [en]Using form components[/en]
 *   [ja]フォームを使う[/ja]
 * @guide EventHandling
 *   [en]Event handling descriptions[/en]
 *   [ja]イベント処理の使い方[/ja]
 * @example
 * <ons-range value="20"></ons-range>
 * <ons-range modifier="material" value="10"></range>
 */
class MaterialInputElement extends BaseElement {

  createdCallback() {
    if (!this.hasAttribute('_compiled')) {
      this._compile();
    }

    this._updateBoundAttributes();
    this._onChange();
  }

  _compile() {
    autoStyle.prepare(this);

    this.innerHTML = `
      <input type="range" class="range">
      <div class="range__left"></div>
    `;

    ModifierUtil.initModifier(this, scheme);

    this.setAttribute('_compiled', '');
  }

  _onChange() {
    this._left.style.width = (100 * this._ratio) + '%';
  }

  get _ratio() {
    // Returns the current ratio.
    const min = this._input.min === '' ? 0 : parseInt(this._input.min);
    const max = this._input.max === '' ? 100 : parseInt(this._input.max);

    return (this.value - min) / (max - min);
  }

  attributeChangedCallback(name, last, current) {
    if (name === 'modifier') {
      ModifierUtil.onModifierChanged(last, current, this, scheme);
    }
    else if (INPUT_ATTRIBUTES.indexOf(name) >= 0) {
      this._updateBoundAttributes();

      if (name === 'min' || name === 'max') {
        this._onChange();
      }
    }
 }

  attachedCallback() {
    this.addEventListener('input', this._onChange);
  }

  detachedCallback() {
    this.removeEventListener('input', this._onChange);
  }

  _updateBoundAttributes() {
    INPUT_ATTRIBUTES.forEach((attr) => {
      if (this.hasAttribute(attr)) {
        this._input.setAttribute(attr, this.getAttribute(attr));
      }
      else {
        this._input.removeAttribute(attr);
      }
    });
  }

  get _input() {
    return this.querySelector('input');
  }

  get _left() {
    return this.querySelector('.range__left');
  }

  get value() {
    return this._input.value;
  }

  set value(val) {
    this._input.value = val;
    this._onChange();
    return this._input.val;
  }
}

window.OnsRangeElement = document.registerElement('ons-range', {
  prototype: MaterialInputElement.prototype
});
