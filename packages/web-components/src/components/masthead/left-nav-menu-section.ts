/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import HostListener from '@carbon/web-components/es/globals/decorators/host-listener.js';
import HostListenerMixin from '@carbon/web-components/es/globals/mixins/host-listener.js';
import ChevronLeft16 from '@carbon/web-components/es/icons/chevron--left/16.js';
import FocusMixin from '@carbon/web-components/es/globals/mixins/focus.js';
import { selectorTabbable } from '@carbon/web-components/es/globals/settings.js';
import settings from '../../internal/vendor/@carbon/ibmdotcom-utilities/utilities/settings/settings';
import styles from './masthead.scss';
import C4DLeftNav from './left-nav';
import { carbonElement as customElement } from '@carbon/web-components/es/globals/decorators/carbon-element.js';

const { prefix, stablePrefix: c4dPrefix } = settings;

/**
 * Masthead left nav menu section.
 *
 * @element c4d-left-nav-menu-section
 * @csspart side-nav-submenu-container - The container for the submenu. Usage: `c4d-left-nav-menu-section::part(side-nav-submenu-container)`
 * @csspart menu-item - The submenu item. Usage: `c4d-left-nav-menu-section::part(menu-item)`
 * @csspart menu-link - The side navigation link. Usage: `c4d-left-nav-menu-section::part(menu-link)`
 * @csspart menu-link-text - The text within the side navigation link. Usage: `c4d-left-nav-menu-section::part(menu-link-text back-button-text)`
 * @csspart back-button - The back button. Usage: `c4d-left-nav-menu-section::part(back-button)`
 * @fires c4d-left-nav-menu-beingtoggled
 *   The custom event fired before this side nav menu is being toggled upon a user gesture.
 *   Cancellation of this event stops the user-initiated action of toggling this side nav menu.
 * @fires c4d-left-nav-menu-toggled The custom event fired after this side nav menu is toggled upon a user gesture.
 */
@customElement(`${c4dPrefix}-left-nav-menu-section`)
class C4DLeftNavMenuSection extends HostListenerMixin(FocusMixin(LitElement)) {
  /**
   * Set aria-hidden property.
   */
  @property({ type: String, attribute: 'aria-hidden', reflect: true })
  ariaHidden = 'true';

  /**
   * The back button's text.
   */
  @property({ attribute: 'back-button-text' })
  backButtonText = 'Back';

  /**
   * `true` if the menu should be visible.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * id of the menu section.
   */
  @property({ type: String, attribute: 'section-id' })
  sectionId = '';

  /**
   * in transition mode.
   */
  @property({ type: Boolean, reflect: true })
  transition = false;

  /**
   * is a submenu menu section.
   */
  @property({ type: Boolean, attribute: 'is-submenu' })
  isSubmenu = false;

  /**
   * Render back button.
   */
  @property({ type: Boolean, reflect: true, attribute: 'show-back-button' })
  showBackBtn = false;

  /**
   * The title text.
   */
  @property()
  title = '';

  /**
   * The title url.
   */
  @property()
  titleUrl = '';

  private async _requestLeftNavMenuSectionUpdate() {
    const { eventToggle } = this.constructor as typeof C4DLeftNavMenuSection;
    return new Promise((resolve: Function): void => {
      this.dispatchEvent(
        new CustomEvent(eventToggle, {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            active: this.expanded,
            resolveFn: resolve,
          },
        })
      );

      setTimeout(() => {
        resolve();
      }, 0);
    });
  }

  /**
   * Handler for the `click` event on the back button.
   */
  private _handleClickBack() {
    const { eventToggle } = this.constructor as typeof C4DLeftNavMenuSection;
    const id = this.sectionId.split(', ');
    let panelId = '';
    /**
     * if second part of id string is '-1' that means user is on level 1 menu panel,
     * set first part of string to -1 to bring back to level 0 menu panel.
     */
    if (id[1] === '-1') {
      panelId = '-1, -1';
    } else {
      panelId = `${id[0]}, -1`;
    }
    const init = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        panelId,
      },
    };
    this.dispatchEvent(new CustomEvent(eventToggle, init));
  }

  @HostListener('transitionend')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleTransitionEnd() {
    setTimeout(() => {
      if (this.expanded) {
        // Allow active section to scroll
        this.style.overflow = '';
      } else {
        // Hide previous section & restrict size
        this.style.visibility = 'hidden';
        this.style.height = '0';
        this.style.overflow = 'hidden';
      }
    }, 0);
  }

  firstUpdated() {
    if (this.sectionId === '-1, -1') {
      this.expanded = true;
      this.ariaHidden = 'false';
    } else {
      this.expanded = false;
      this.ariaHidden = 'true';
      // Hide all submenus, and restrict their height/overflow.
      this.style.visibility = 'hidden';
      this.style.height = '0';
      this.style.overflow = 'hidden';
    }
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('expanded')) {
      // Allow incoming menu section to show before transition.
      if (this.expanded) {
        this.style.visibility = '';
        this.style.height = '';
      }
    }
    return true;
  }

  async updated(changedProperties) {
    await this._requestLeftNavMenuSectionUpdate();

    if (changedProperties.has('expanded')) {
      const { expanded, isSubmenu } = this;

      if (expanded) {
        // set focus to first element of menu panel to allow for tabbing through the menu
        let tabbable;
        if (isSubmenu) {
          // set focus to back button
          tabbable = this.shadowRoot?.querySelector('button');
        } else {
          // set focus to first menu item of section
          tabbable = (this.getRootNode() as ShadowRoot).querySelector(
            C4DLeftNav.selectorNavItems
          );
        }

        if (tabbable) {
          this.addEventListener(
            'transitionend',
            () => {
              (tabbable as HTMLElement).focus();
            },
            { once: true }
          );
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    if (document.dir) {
      this.dir = document.dir;
    }
  }

  render() {
    const {
      backButtonText,
      _handleClickBack: handleClickBack,
      showBackBtn,
    } = this;
    return html`
      <ul part="side-nav-submenu-container">
        ${showBackBtn
          ? html`
              <li
                part="menu-item back-button-wrapper"
                class="${prefix}--side-nav__menu-item ${prefix}--masthead__side-nav--submemu-back"
                role="none">
                <button
                  part="menu-link back-button"
                  class="${prefix}--side-nav__link"
                  @click="${handleClickBack}">
                  <span
                    part="menu-link-text back-button-text"
                    class="${prefix}--side-nav__link-text"
                    >${ChevronLeft16()}${backButtonText}</span
                  >
                </button>
              </li>
            `
          : undefined}
        <slot></slot>
      </ul>
    `;
  }

  /**
   * The name of the custom event fired after this side nav menu is toggled upon a user gesture.
   */
  static get eventToggle() {
    return `${c4dPrefix}-left-nav-menu-toggled`;
  }

  /**
   * A selector that will return the nav menus.
   */
  static get selectorNavMenu() {
    return `${c4dPrefix}-left-nav-menu`;
  }

  /**
   * A selector that will return the menu items.
   */
  static get selectorNavItem() {
    return `${c4dPrefix}-left-nav-menu-item`;
  }

  /**
   * A selector selecting tabbable nodes.
   */
  static get selectorTabbable() {
    return [
      selectorTabbable,
      `${c4dPrefix}-left-nav-menu`,
      `${c4dPrefix}-left-nav-menu-item`,
    ].join(',');
  }

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default C4DLeftNavMenuSection;
