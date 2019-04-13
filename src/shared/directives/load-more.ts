import { getStyle } from '../../config/mUtils';

export const loadMore: any = {
  bind: (el, binding) => {
    const windowHeight = window.screen.height;
    let height;
    let setTop;
    let paddingBottom;
    let marginBottom;
    let requestFram;
    let oldScrollTop;
    let scrollEl;
    let heightEl;
    const scrollType = el.attributes.type && el.attributes.type.value;
    const scrollReduce = 2;
    if (scrollType === 2) {
      scrollEl = el;
      heightEl = el.children[0];
    } else {
      scrollEl = document.body;
      heightEl = el;
    }

    const loadMoreInside = () => {
      if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
        binding.value();
      }
    };

    const moveEnd = () => {
      requestFram = requestAnimationFrame(() => {
        if (scrollEl.scrollTop !== oldScrollTop) {
          oldScrollTop = scrollEl.scrollTop;
          moveEnd();
        } else {
          cancelAnimationFrame(requestFram);
          height = heightEl.clientHeight;
          loadMoreInside();
        }
      });
    };

    el.addEventListener('touchstart', () => {
      height = heightEl.clientHeight;
      // if (scrollType === 2) {
      //   height = height;
      // }
      setTop = el.offsetTop;
      paddingBottom = getStyle(el, 'paddingBottom');
      marginBottom = getStyle(el, 'marginBottom');
    }, false);

    el.addEventListener('touchmove', () => {
      loadMoreInside();
    }, false);

    el.addEventListener('touchend', () => {
      oldScrollTop = scrollEl.scrollTop;
      moveEnd();
    }, false);
  }
};
