/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { css } from 'lit';
import settings from '../../internal/vendor/@carbon/ibmdotcom-utilities/utilities/settings/settings';
import C4DTextCTA from './text-cta';
import styles from '../link-list/link-list.scss';
import { carbonElement as customElement } from '@carbon/web-components/es/globals/decorators/carbon-element';

const { stablePrefix: c4dPrefix } = settings;

/**
 * Link list item CTA.
 *
 * @element c4d-link-list-item-cta
 */
@customElement(`${c4dPrefix}-link-list-item-cta`)
class C4DLinkListItemCTA extends C4DTextCTA {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
    super.connectedCallback();
  }

  static get stableSelector() {
    return `${c4dPrefix}--link-list-item-cta`;
  }

  // `styles` here is a `CSSResult` generated by custom WebPack loader
  static get styles() {
    return css`
      ${super.styles}${styles}
    `;
  }
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default C4DLinkListItemCTA;
