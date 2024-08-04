export type useCanvasReturn = ReturnType<typeof useCanvas>;

export default function () {
  const mCanvas = ref<HTMLCanvasElement>();

  function getTextMetrics(text: string, font: string = getCanvasFont()) {
    // re-use canvas object for better performance
    const canvas =
      mCanvas.value || (mCanvas.value = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context!.font = font;
    const metrics = context!.measureText(text);
    return metrics;
  }

  function getTextWidthF(text: string, font: string = getCanvasFont()) {
    const metrics = getTextMetrics(text, font);

    // Might be better than metrics.width because of italic fonts and stuff
    // return metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    return metrics.width;
  }

  function getTextWidth(text: string, el: HTMLElement = document.body) {
    return getTextWidthF(text, getCanvasFont(el));
  }

  function getTextHeightF(text: string, font: string = getCanvasFont()) {
    const metrics = getTextMetrics(text, font);
    return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  }

  function getTextHeight(text: string, el: HTMLElement = document.body) {
    return getTextHeightF(text, getCanvasFont(el));
  }

  function getCssStyle(element: Element, prop: string) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  }

  function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  return {
    canvas: mCanvas,
    getTextWidthF,
    getTextWidth,
    getTextHeightF,
    getTextHeight,
    getCanvasFont,
  };
}
