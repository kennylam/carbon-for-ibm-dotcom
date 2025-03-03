/**
 * @license
 *
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, render } from 'lit/html.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import MockResizeObserver from '../../../../tests/utils/mock-resize-observer';
import C4DCarousel from '../carousel';
// Above import is interface-only ref and thus code won't be brought into the build
import '../carousel';

const template = (props?) => {
  const { formatStatus, pageSize, start, children } = props ?? {};
  return html`
    <c4d-carousel
      .formatStatus="${ifDefined(formatStatus)}"
      page-size="${ifDefined(pageSize)}"
      start="${ifDefined(start)}">
      ${children}
    </c4d-carousel>
  `;
};

describe('c4d-carousel', function () {
  let pageSize = 3;
  const origComputedStyle = window.getComputedStyle;
  // TODO: Wait for `.d.ts` update to support `ResizeObserver`
  const origResizeObserver = (window as any).ResizeObserver;

  beforeAll(function () {
    window.getComputedStyle = function (elem) {
      const origResult = origComputedStyle.call(window, elem);
      return {
        getPropertyValue(name) {
          return name !== '--c4d-carousel-page-size'
            ? origResult.getPropertyValue(name)
            : pageSize;
        },
      };
    } as any;
    // TODO: Wait for `.d.ts` update to support `ResizeObserver`
    (window as any).ResizeObserver = MockResizeObserver;
  });

  describe('Rendering', function () {
    it('should render with minimum attributes', async function () {
      render(template(), document.body);
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      expect(document.body.querySelector('c4d-carousel')).toMatchSnapshot({
        mode: 'shadow',
      });
    });

    it('should set the scroll position', async function () {
      render(template({ pageSize: 2, start: 1 }), document.body);
      await Promise.resolve();
      const carousel = document.querySelector('c4d-carousel') as C4DCarousel;
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      (carousel as any)._contentsBaseWidth = 700;
      (carousel as any)._gap = 100;
      await Promise.resolve();
      expect(
        (
          carousel!.shadowRoot!.querySelector(
            '.cds--carousel__scroll-contents'
          ) as HTMLElement
        ).style.insetInlineStart
      ).toBe('-400px');
    });

    it('should enable/disable the previous button based on the starting position', async function () {
      render(template({ start: 0 }), document.body);
      await Promise.resolve();
      const carousel = document.querySelector('c4d-carousel') as C4DCarousel;
      expect(
        (
          carousel!.shadowRoot!.querySelector(
            'button[part="prev-button"]'
          ) as HTMLButtonElement
        ).disabled
      ).toBe(true);
      carousel.start = 1;
      await Promise.resolve();
      expect(
        (
          carousel!.shadowRoot!.querySelector(
            'button[part="prev-button"]'
          ) as HTMLButtonElement
        ).disabled
      ).toBe(false);
    });

    it('should enable/disable the next button based on the starting position', async function () {
      render(
        template({
          pageSize: 2,
          start: 2,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.querySelector('c4d-carousel') as C4DCarousel;
      expect(
        (
          carousel!.shadowRoot!.querySelector(
            'button[part="next-button"]'
          ) as HTMLButtonElement
        ).disabled
      ).toBe(false);
      carousel.start = 3;
      await Promise.resolve();
      expect(
        (
          carousel!.shadowRoot!.querySelector(
            'button[part="next-button"]'
          ) as HTMLButtonElement
        ).disabled
      ).toBe(true);
    });

    it('should adjust the displayed page size based on the starting position', async function () {
      render(
        template({
          pageSize: 3,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      const navigation = carousel!.shadowRoot!.querySelector(
        '.cds--carousel__navigation'
      );
      expect(navigation!.textContent!.trim()).toBe('1 / 2');
      carousel.start = 1;
      await Promise.resolve();
      expect(navigation!.textContent!.trim()).toBe('2 / 3');
      carousel.start = 3;
      await Promise.resolve();
      expect(navigation!.textContent!.trim()).toBe('2 / 2');
    });

    it('should support alternate format of showing current page', async function () {
      render(
        template({
          formatStatus: ({ currentPage, pages }) =>
            `${currentPage} in ${pages}`,
          pageSize: 3,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      const navigation = carousel!.shadowRoot!.querySelector(
        '.cds--carousel__navigation'
      );
      expect(navigation!.textContent!.trim()).toBe('1 in 2');
      carousel.start = 3;
      await Promise.resolve();
      expect(navigation!.textContent!.trim()).toBe('2 in 2');
    });
  });

  describe('Navigating', function () {
    it('should move the page with previous button', async function () {
      render(
        template({
          pageSize: 3,
          start: 5,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      (
        carousel!.shadowRoot!.querySelector(
          '[part="prev-button"]'
        ) as HTMLElement
      ).click();
      expect(carousel.start).toBe(2);
    });

    it('should handle overflow with previous button', async function () {
      render(
        template({
          pageSize: 3,
          start: 1,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      (
        carousel!.shadowRoot!.querySelector(
          '[part="prev-button"]'
        ) as HTMLElement
      ).click();
      expect(carousel.start).toBe(0);
    });

    it('should move the page with next button', async function () {
      render(
        template({
          pageSize: 3,
          start: 2,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      (
        carousel!.shadowRoot!.querySelector(
          '[part="next-button"]'
        ) as HTMLElement
      ).click();
      expect(carousel.start).toBe(5);
    });

    it('should handle overflow with next button', async function () {
      render(
        template({
          pageSize: 3,
          start: 3,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      (
        carousel!.shadowRoot!.querySelector(
          '[part="next-button"]'
        ) as HTMLElement
      ).click();
      expect(carousel.start).toBe(3);
    });

    it('should avoid moving the starting position at the last page', async function () {
      render(
        template({
          pageSize: 3,
          start: 5,
          children: html`
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          `,
        }),
        document.body
      );
      await Promise.resolve(); // Update cycle for `<c4d-carousel>`
      await Promise.resolve(); // The update cycle that fires `slotchange` event
      await Promise.resolve(); // The update cycle that updates content upon `slotchange` event
      const carousel = document.body.querySelector(
        'c4d-carousel'
      ) as C4DCarousel;
      (
        carousel!.shadowRoot!.querySelector(
          '[part="next-button"]'
        ) as HTMLElement
      ).click();
      expect(carousel.start).toBe(5);
    });
  });

  describe('Handling resizing', function () {
    it('should update page size upon resizing viewport', async function () {
      render(template(), document.body);
      await Promise.resolve();
      pageSize = 2;
      MockResizeObserver.run(document.documentElement, {});
      await Promise.resolve();
      expect(
        (document.body.querySelector('c4d-carousel') as C4DCarousel).pageSize
      ).toBe(2);
    });

    it('should update the widths of contents area and the gaps between cards', async function () {
      render(
        template({
          children: html`
            <div style="width:300px;height:100px;margin-right:16px"></div>
            <div style="width:300px;height:100px;margin-right:16px"></div>
            <div style="width:300px;height:100px;margin-right:16px"></div>
            <div style="width:300px;height:100px;margin-right:16px"></div>
          `,
        }),
        document.body
      );
      await Promise.resolve();
      const carousel = document.querySelector('c4d-carousel') as C4DCarousel;
      pageSize = 2;
      spyOnProperty(
        carousel.shadowRoot!.querySelector(
          '.cds--carousel__scroll-contents'
        ) as Element,
        'scrollWidth'
      ).and.returnValue(700);
      MockResizeObserver.run(document.documentElement, {});
      MockResizeObserver.run(
        carousel.shadowRoot!.querySelector('.cds--carousel__scroll-contents')!,
        { width: 700 }
      );
      await Promise.resolve();
      expect((carousel as any)._contentsBaseWidth).toBe(700);
      expect((carousel as any)._gap).toBe(16);
    });
  });

  afterEach(async function () {
    await render(undefined!, document.body);
    pageSize = 3;
  });

  afterAll(function () {
    // TODO: Wait for `.d.ts` update to support `ResizeObserver`
    (window as any).ResizeObserver = origResizeObserver;
    window.getComputedStyle = origComputedStyle;
  });
});
