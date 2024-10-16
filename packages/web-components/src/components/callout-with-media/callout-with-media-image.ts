/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { property } from 'lit/decorators.js';
import settings from '../../internal/vendor/@carbon/ibmdotcom-utilities/utilities/settings/settings';
import styles from './callout-with-media.scss';
import C4DImage from '../image/image';
import { COLOR_SCHEME } from '../../component-mixins/callout/defs';
import { carbonElement as customElement } from '@carbon/web-components/es/globals/decorators/carbon-element';

const { stablePrefix: c4dPrefix } = settings;

/**
 * Callout with media image.
 *
 * @element c4d-callout-with-media-image
 */
@customElement(`${c4dPrefix}-callout-with-media-image`)
class C4DCalloutWithMediaImage extends C4DImage {
  /**
   * The color-scheme type.
   */
  @property({ reflect: true, attribute: 'color-scheme' })
  colorScheme = COLOR_SCHEME.REGULAR;

  /**
   * The shadow slot this video container should be in.
   */
  @property({ reflect: true })
  slot = 'media';

  static styles = styles;
}

/* @__GENERATE_REACT_CUSTOM_ELEMENT_TYPE__ */
export default C4DCalloutWithMediaImage;
