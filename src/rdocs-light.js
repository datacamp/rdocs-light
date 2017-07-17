import './styles/main.scss';

const packageView = require('./views/package.html');
const topicView = require('./views/topic.html');

(() => {
  const TOOLTIP_HEIGHT = 252;
  const TOOLTIP_WIDTH = 402;
  const API_BASE_URL = process.env.API_BASE_URL;
  let pageContainer;
  let tooltip;
  let onTooltip = false;
  let onLinkElement = false;
  let tooltipIsPinned = false;


  let topOffset = 0;
  let autoPin = false;
  let pinOnClick = true;

  function setAnchorsDisplay(display) {
    const anchors = document.getElementById('rdocs-light-tooltip-anchors');
    if (anchors !== null) {
      anchors.style.display = display;
    }
  }

  function hideTooltip() {
    if (!tooltipIsPinned) {
      tooltip.style.visibility = 'hidden';
      setAnchorsDisplay('none');
    }
  }

  function showTooltip() {
    tooltip.style.visibility = 'visible';
    setAnchorsDisplay('block');
  }

  function onTooltipOverListener(event) {
    let e = event.fromElement || event.relatedTarget;
    if (e !== null) {
      do {
        if (e === this) {
          return;
        }
        e = e.parentNode;
      } while (e.parentNode !== null);
    }

    onTooltip = true;
    if (onTooltip && tooltip.style.visibility === 'hidden') {
      showTooltip();
    }
  }

  function onTooltipOutListener(event) {
    let e = event.toElement || event.relatedTarget;
    if (e === null) {
      return;
    }
    do {
      if (e === this) {
        return;
      }
      e = e.parentNode;
    } while (e.parentNode !== null);

    onTooltip = false;
    if (!onTooltip && !onLinkElement) {
      hideTooltip();
    }
  }

  function onTooltipClickListener() {
    if (pinOnClick) {
      tooltipIsPinned = true;
    }
  }

  function createTooltip(container) {
    const div = document.createElement('div');
    div.setAttribute('id', 'rdocs-light-tooltip');
    if (container !== undefined) {
      pageContainer = container;
    } else {
      pageContainer = document.getElementsByTagName('body')[0];
    }
    pageContainer.appendChild(div);
    tooltip = document.getElementById('rdocs-light-tooltip');
    tooltip.addEventListener('mouseover', event => onTooltipOverListener(event));
    tooltip.addEventListener('mouseout', event => onTooltipOutListener(event));
    tooltip.addEventListener('click', () => onTooltipClickListener());
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

  function setToolTipPosition(box) {
    const body = document.getElementsByTagName('body')[0];
    const screenSize = getCurrentVisibleHeightAndWidth();

    // Seems necessairy
    screenSize.x -= 25;

    let top = (box.top + topOffset) + body.scrollTop - TOOLTIP_HEIGHT;
    let left = box.left - body.scrollLeft;

    if (left + TOOLTIP_WIDTH > screenSize.x) {
      left = screenSize.x - TOOLTIP_WIDTH + body.scrollLeft;
      if (left < 0) {
        hideTooltip();
        return false;
      }
    }

    if (top < body.scrollTop) {
      top = box.bottom + body.scrollTop;
      if (top + TOOLTIP_HEIGHT > screenSize.y + body.scrollTop) {
        hideTooltip();
        return false;
      }
    }
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    return true;
  }

  function setNavigation(topicUrl, anchors) {
    const arrows = Array.from(document.getElementsByClassName('rdocs-light-arrow'));
    const nav = document.getElementById('rdocs-light-nav');
    nav.innerHTML = '';
    anchors.forEach((anchor) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `${topicUrl}#${anchor.anchor}`;
      a.target = '_blank';
      a.innerText = anchor.title;
      li.appendChild(a);
      nav.appendChild(li);
    });

    if (anchors.length <= 4) {
      arrows.forEach((arrow) => {
        arrow.style.visibility = 'hidden';
      });
    }
    arrows[0].addEventListener('click', () => {
      nav.scrollLeft -= 75;
    });

    arrows[1].addEventListener('click', () => {
      nav.scrollLeft += 75;
    });
  }

  function loadPackageData(data) {
    tooltip.innerHTML = packageView;
    document.getElementById('rdocs-light-tooltip-title').innerHTML = data.title;
    document.getElementById('rdocs-light-tooltip-description').innerHTML = data.description || '';
    document.getElementById('rdocs-light-tooltip-link').href = data.uri;
    const packageVersion = document.getElementById('rdocs-light-tooltip-header-package');
    packageVersion.innerText = data.package_name;
    packageVersion.href = data.url;
    const version = document.getElementById('rdocs-light-tooltip-header-version');
    version.innerText = `v${data.version.version}`;
    version.href = data.version.url;
  }

  function loadTopicData(data) {
    tooltip.innerHTML = topicView;
    document.getElementById('rdocs-light-tooltip-title').innerHTML = data.title;
    document.getElementById('rdocs-light-tooltip-description').innerHTML = data.description || '';
    document.getElementById('rdocs-light-tooltip-link').href = data.url;
    const topic = document.getElementById('rdocs-light-tooltip-header-topic');
    topic.innerText = data.name;
    topic.href = data.url;
    const packageVersion = document.getElementById('rdocs-light-tooltip-header-package');
    packageVersion.innerText = `${data.package_version.package_name} v${data.package_version.version}`;
    packageVersion.href = data.package_version.url;

    setNavigation(data.url, data.anchors);
  }

  function parseTopicURL(url) {
    const urlRegexString = `${API_BASE_URL}/api/light/packages/(.*)/topics/(.*)`;
    const urlRegex = new RegExp(urlRegexString, 'g');
    const match = urlRegex.exec(url);
    if (match !== null) {
      return {
        package: decodeURIComponent(match[1]),
        topic: decodeURIComponent(match[2]),
      };
    }

    return undefined;
  }

  function parsePackageURL(url) {
    const urlRegexString = `${API_BASE_URL}/api/light/packages/(.*)`;
    const urlRegex = new RegExp(urlRegexString, 'g');
    const match = urlRegex.exec(url);
    if (match !== null) {
      return {
        package: decodeURIComponent(match[1]),
      };
    }

    return undefined;
  }

  function parseURL(url) {
    const result = parseTopicURL(url);
    if (result !== undefined) {
      return result;
    }
    return parsePackageURL(url);
  }

  function reqLoadListener() {
    const data = JSON.parse(this.responseText);
    const requestInfo = parseURL(this.responseURL);

    if (data.title !== undefined) {
      if (requestInfo.topic === undefined) {
        loadPackageData(data);
      } else {
        loadTopicData(data);
      }
      if (autoPin) {
        tooltipIsPinned = true;
      }
      showTooltip();
    } else {
      let text = `No documentation found for the package '${requestInfo.package}'`;
      if (requestInfo.topic !== undefined) {
        text = `No documentation found for '${requestInfo.package}::${requestInfo.topic}'`;
      }
      console.log(text);
    }
  }

  function reqErrorListener() {
    console.error('Something went wrong when retrieving the data, hiding rdocs light widget.');
  }

  function parseAttribute(attribute) {
    const splitted = attribute.split('::');
    if (splitted.length === 1) {
      return {
        package: splitted[0],
      };
    } else if (splitted.length === 2) {
      return {
        package: splitted[0],
        topic: splitted[1],
      };
    }
    return undefined;
  }

  function sendRequest(attribute) {
    const data = parseAttribute(attribute);
    if (data !== undefined) {
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', reqLoadListener);
      oReq.addEventListener('error', reqErrorListener, false);
      let url = `${API_BASE_URL}/api/light/packages/${data.package}`;
      if (data.topic !== undefined) {
        url += `/topics/${data.topic}`;
      }
      oReq.open('get', url, true);
      oReq.send();
    } else {
      console.warn('Invalid attribute value.');
    }
  }

  function linkElementMouseOverListener(DOMElement) {
    onLinkElement = true;
    const element = DOMElement;
    element.classList.add('rdocs-light-link-hovered');
    const visible = setToolTipPosition(element.getBoundingClientRect());
    if (visible) {
      sendRequest(element.getAttribute('data-mini-rdoc'));
    } else {
      console.info('Not enough space, rdocs light widget not shown.');
    }
  }

  function linkElementMouseOutListener(DOMElement) {
    const element = DOMElement;
    element.classList.remove('rdocs-light-link-hovered');
    onLinkElement = false;
    if (!onTooltip) {
      hideTooltip();
    }
  }

  function findAllRDocLightDataAttributes() {
    const links = document.querySelectorAll('[data-mini-rdoc]');

    if (links.length === 0) {
      console.info('No RDocumentation links found.');
    }

    links.forEach(linkElement => linkElement.addEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
    links.forEach(linkElement => linkElement.addEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
  }

  function bodyClickListener(event) {
    if (tooltipIsPinned) {
      let e = event.toElement || event.relatedTarget;
      if (e !== null) {
        do {
          if (e === tooltip) {
            return;
          }
          e = e.parentNode;
        } while (e.parentNode !== null);
      }
      tooltipIsPinned = false;
      hideTooltip();
    }
  }

  function addBodyClickListener() {
    document.body.addEventListener('click', bodyClickListener, true);
  }

  module.exports = {
    initRDocsLight: (container) => {
      createTooltip(container);
      addBodyClickListener();
      findAllRDocLightDataAttributes();
    },
    setTopOffset: (offset) => {
      topOffset = offset;
    },
    setAutoPinning: (pin) => {
      autoPin = pin;
    },
    setPinOnClick: (pin) => {
      pinOnClick = pin;
    },
  };
})();
