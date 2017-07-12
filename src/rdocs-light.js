import './styles/main.scss';

(() => {
  const TOOLTIP_HEIGHT = 252;
  const TOOLTIP_WIDTH = 302;
  let tooltip;

  function insertTag(parent, element) {
    document.getElementsByTagName(parent)[0].appendChild(element);
  }

  function createTooltip() {
    const div = document.createElement('div');
    div.setAttribute('id', 'rdocs-light-tooltip');
    div.innerHTML = '<h3>Title</h3><p>Description</p>';
    insertTag('body', div);
    tooltip = document.getElementById('rdocs-light-tooltip');
  }

  function getCurrentVisibleHeightAndWidth() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const x = w.innerWidth || e.clientWidth || g.clientWidth;
    const y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { x, y };
  }

  function hideTooltip() {
    tooltip.style.visibility = 'hidden';
  }

  function showTooltip() {
    tooltip.style.visibility = 'visible';
  }

  function setToolTipPosition(box) {
    const body = document.getElementsByTagName('body')[0];
    const screenSize = getCurrentVisibleHeightAndWidth();

    // Seems necessairy
    screenSize.x -= 25;

    let top = box.top + body.scrollTop - TOOLTIP_HEIGHT;
    let left = box.left - body.scrollLeft;

    if (left + TOOLTIP_WIDTH > screenSize.x) {
      left = screenSize.x - TOOLTIP_WIDTH + body.scrollLeft;
      if (left < 0) {
        hideTooltip();
        return;
      }
    }

    if (top < body.scrollTop) {
      top = box.bottom + body.scrollTop;
      if (top + TOOLTIP_HEIGHT > screenSize.y + body.scrollTop) {
        hideTooltip();
        return;
      }
    }

    tooltip.style.top = top;
    tooltip.style.left = left;
  }

  function mouseOverListener(DOMElement) {
    const element = DOMElement;
    element.classList.add('rdocs-light-hovered');
    showTooltip();
    setToolTipPosition(element.getBoundingClientRect());
  }

  function mouseOutListener(DOMElement) {
    const element = DOMElement;
    element.classList.remove('rdocs-light-hovered');
    hideTooltip();
  }

  function findAllRDocLightDataAttributes() {
    const links = document.querySelectorAll('[data-mini-rdoc]');

    if (links.length === 0) {
      console.log('No RDocumentation links found.');
    }

    links.forEach(linkElement => linkElement.addEventListener('mouseover', () => mouseOverListener(linkElement)));
    links.forEach(linkElement => linkElement.addEventListener('mouseout', () => mouseOutListener(linkElement)));
  }

  function initRDocsLight() {
    createTooltip();
    findAllRDocLightDataAttributes();
  }

  function isAlreadyExecuted() {
    return (tooltip !== undefined);
  }

  if (!isAlreadyExecuted()) {
    if (document.readyState === 'complete' || document.readyState === 'loaded') {
      initRDocsLight();
    } else {
      document.addEventListener('DOMContentLoaded', initRDocsLight);
    }
  } else {
    console.log('Warning: tried to load RDocs Light multiple times.');
  }
})();
