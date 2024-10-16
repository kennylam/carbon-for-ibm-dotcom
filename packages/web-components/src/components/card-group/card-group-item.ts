/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { property } from 'lit/decorators.js';
import settings from '../../internal/vendor/@carbon/ibmdotcom-utilities/utilities/settings/settings';
import { carbonElement as customElement } from '@carbon/web-components/es/globals/decorators/carbon-element';
import C4DCard from '../card/card';
import styles from './card-group.scss';

const { stablePrefix: c4dPrefix } = settings;

/**
 * Card Group item.
 *
 * @element c4d-card-group-item
 */
@customElement(`${c4dPrefix}-card-group-item`)
class C4DCardGroupItem extends C4DCard {
  /**
   * `true` if the card group is using border.
   */
  @property({ type: Boolean, reflect: true })
  border = false;

  /**
   * `true` if the card group item is empty.
   */
  @property({ type: Boolean, reflect: true })
  empty = false;

  static get stableSelector() {
    return `${c4dPrefix}--card-group-item`;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('ctaType')) {
      this.shadowRoot
        ?.querySelector('c4d-image')
        ?.setAttribute('card-group-item', '');
    }
  }

  /**
   * A selector that will return the child footer.
   */
  static get selectorFooter() {
    return `${c4dPrefix}-card-footer`;
  }

  static styles = styles;
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default C4DCardGroupItem;
