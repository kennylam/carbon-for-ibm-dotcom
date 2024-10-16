/**
 * @license
 *
 * Copyright IBM Corp. 2022, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { property } from 'lit/decorators.js';
import settings from '@carbon/ibmdotcom-utilities/es/utilities/settings/settings.js';
import StableSelectorMixin from '../../globals/mixins/stable-selector';
import C4DStructuredListHeaderCell from '../structured-list/structured-list-header-cell';
import styles from './pricing-table.scss';
import { PRICING_TABLE_HEADER_CELL_TYPES } from './defs';
import { carbonElement as customElement } from '@carbon/web-components/es/globals/decorators/carbon-element';

const { prefix, stablePrefix: c4dPrefix } = settings;

/**
 * @element c4d-pricing-table-header-cell
 *
 * @csspart container - The cell container. Usage `c4d-pricing-table-header-cell::part(container)`
 * @csspart heading-container - The heading area container. Usage `c4d-pricing-table-header-cell::part(heading-container)`
 * @csspart tag-wrapper - A wrapper around the tags. Usage `c4d-pricing-table-header-cell::part(tag-wrapper)`
 * @csspart content-container - The content area container. Usage `c4d-pricing-table-header-cell::part(content-container)`
 * @csspart content - The cell content. Usage `c4d-pricing-table-header-cell::part(content)`
 * @csspart cta - The action. Usage `c4d-pricing-table-header-cell::part(cta)`
 */

@customElement(`${c4dPrefix}-pricing-table-header-cell`)
class C4DPricingTableHeaderCell extends StableSelectorMixin(
  C4DStructuredListHeaderCell
) {
  @property({ reflect: true })
  type: PRICING_TABLE_HEADER_CELL_TYPES =
    PRICING_TABLE_HEADER_CELL_TYPES.COMPLEX;

  render() {
    const { type } = this;
    const { tagWrapperSelector } = this
      .constructor as typeof C4DPricingTableHeaderCell;

    return type === PRICING_TABLE_HEADER_CELL_TYPES.COMPLEX
      ? html`
          <div
            class="${prefix}--pricing-table-header-cell-inner"
            part="container">
            <div part="heading-container">
              <slot name="highlight-label"></slot>
              <slot name="headline"></slot>
              <slot name="caption"></slot>
              <div class="${tagWrapperSelector}" part="tag-wrapper">
                <slot name="tag"></slot>
              </div>
              <div
                class="${prefix}--pricing-table-cell-inner"
                part="content-container">
                <div
                  class="${prefix}--pricing-table-cell-content"
                  part="content">
                  <slot></slot>
                </div>
                <slot name="toggle"></slot>
              </div>
            </div>
            <div part="cta">
              <slot name="cta"></slot>
            </div>
          </div>
        `
      : html`
          <div
            class="${prefix}--pricing-table-cell-inner"
            part="content-container">
            <div class="${prefix}--pricing-table-cell-content" part="content">
              ${super.render()}
            </div>
          </div>
        `;
  }

  static get tagWrapperSelector() {
    return `${prefix}--pricing-table-header-cell-tag-wrapper`;
  }

  static get stableSelector() {
    return `${c4dPrefix}--pricing-table-header-cell`;
  }

  static styles = styles;
}

export default C4DPricingTableHeaderCell;
