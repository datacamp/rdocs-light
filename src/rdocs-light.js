import './styles/main.scss';

const css = require('./styles/shadow.scss').toString();

const packageView = require('./views/package.html');
const topicView = require('./views/topic.html');
const loaderView = require('./views/loader.html');
const notFoundView = require('./views/not-found.html');

(() => {
  const TOOLTIP_HEIGHT = 252;
  const TOOLTIP_WIDTH = 402;
  const API_BASE_URL = process.env.API_BASE_URL;
  let pageContainer;
  let shadowRoot;
  let tooltip;
  let onTooltip = false;
  let onLinkElement = false;
  let tooltipIsPinned = false;
  let visibleAnchorsAreHidden = false;


  let topOffset = 0;
  let autoPin = false;
  let pinOnClick = true;
  let findRDocLinks = false;
  let showTopicUsageSection = false;
  let showTopicArgumentsSection = false;

  function setAnchorsDisplay(display) {
    const anchors = shadowRoot.querySelector('#rdocs-light-tooltip-anchors');
    if (anchors !== null) {
      anchors.style.display = display;
    }
  }

  function getAnchorsDisplay() {
    const anchors = shadowRoot.querySelector('#rdocs-light-tooltip-anchors');
    if (anchors !== null) {
      return anchors.style.display;
    }
    return undefined;
  }

  function hideTooltip() {
    if (!tooltipIsPinned) {
      tooltip.style.visibility = 'hidden';
      if (getAnchorsDisplay() !== 'none') {
        setAnchorsDisplay('none');
        visibleAnchorsAreHidden = true;
      } else {
        visibleAnchorsAreHidden = false;
      }
    }
  }

  function showTooltip() {
    tooltip.style.visibility = 'visible';
    if (visibleAnchorsAreHidden) {
      setAnchorsDisplay('block');
    }
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
    // const div = document.createElement('div');
    // div.setAttribute('id', 'rdocs-light-tooltip');
    if (container !== undefined) {
      pageContainer = container;
    } else {
      pageContainer = document.getElementsByTagName('body')[0];
    }
    const containerDiv = document.createElement('div');
    containerDiv.setAttribute('id', 'rdocs-light-tooltip');
    pageContainer.appendChild(containerDiv);
    tooltip = document.querySelector('#rdocs-light-tooltip');
    shadowRoot = tooltip;
    if (document.head.attachShadow) {
      shadowRoot = tooltip.attachShadow({ mode: 'open' });
    }
    // shadowRoot.appendChild(div);
    // tooltip = shadowRoot.getElementById('rdocs-light-tooltip');
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

  function loadShadowStyle() {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerText = css;
    shadowRoot.appendChild(style);
  }

  function loadView(view) {
    const container = document.createElement('div');
    container.setAttribute('id', 'rdocs-light-tooltip-container');
    container.innerHTML = view;
    shadowRoot.innerHTML = '';
    shadowRoot.appendChild(container);
    loadShadowStyle();
  }

  function showLoader() {
    loadView(loaderView);
    showTooltip();
  }

  function showNotFound(text) {
    loadView(notFoundView);
    shadowRoot.querySelector('#rdocs-light-tooltip-title').innerText = text;
    showTooltip();
  }

  function setNavigation(url, anchors) {
    const arrows = Array.from(shadowRoot.querySelectorAll('.rdocs-light-arrow'));
    const nav = shadowRoot.querySelector('#rdocs-light-nav');
    nav.innerHTML = '';
    let addedElements = 0;
    anchors.forEach((anchor) => {
      if (!((anchor.title === 'usage' && showTopicUsageSection) || (anchor.title === 'arguments' && showTopicArgumentsSection))) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `${url}#${anchor.anchor}`;
        a.target = '_blank';
        a.innerText = anchor.title;
        li.appendChild(a);
        nav.appendChild(li);
        addedElements++;
      }
    });

    if (addedElements === 0) {
      setAnchorsDisplay('none');
    } else if (addedElements <= 4) {
      setAnchorsDisplay('block');
      arrows.forEach((arrow) => {
        arrow.style.visibility = 'hidden';
      });
    } else {
      setAnchorsDisplay('block');
      arrows[0].addEventListener('click', () => {
        nav.scrollLeft -= 75;
      });

      arrows[1].addEventListener('click', () => {
        nav.scrollLeft += 75;
      });
    }
  }

  function loadPackageData(data) {
    loadView(packageView);
    shadowRoot.querySelector('#rdocs-light-tooltip-title').innerHTML = data.title;
    shadowRoot.querySelector('#rdocs-light-tooltip-description').innerHTML = data.description || '';
    shadowRoot.querySelector('#rdocs-light-tooltip-link').href = data.uri;
    const packageVersion = shadowRoot.querySelector('#rdocs-light-tooltip-header-package');
    packageVersion.innerText = data.package_name;
    packageVersion.href = data.url;
    const version = shadowRoot.querySelector('#rdocs-light-tooltip-header-version');
    version.innerText = `v${data.version.version}`;
    version.href = data.version.url;

    setNavigation(data.url, data.anchors);
  }

  function createArgumentsList(topicArguments) {
    let html = '<dl>';
    topicArguments.forEach((argument) => {
      html += `<dt>${argument.name}</dt><dd>${argument.description}</dd>`;
    });
    html += '</dl>';

    return html;
  }

  function loadTopicData(data) {
    loadView(topicView);

    shadowRoot.querySelector('#rdocs-light-tooltip-title').innerHTML = data.title;
    shadowRoot.querySelector('#rdocs-light-tooltip-description').innerHTML = data.description || '';
    shadowRoot.querySelector('#rdocs-light-tooltip-link').href = data.url;
    const topic = shadowRoot.querySelector('#rdocs-light-tooltip-header-topic');
    topic.innerText = data.name;
    topic.href = data.url;
    const packageVersion = shadowRoot.querySelector('#rdocs-light-tooltip-header-package');
    packageVersion.innerText = `${data.package_version.package_name} v${data.package_version.version}`;
    packageVersion.href = data.package_version.url;

    const usageDiv = shadowRoot.querySelector('#rdocs-light-tooltip-usage');
    if (!showTopicUsageSection || !data.usage) {
      usageDiv.style.display = 'none';
    } else {
      const usageContentDiv = shadowRoot.querySelector('#rdocs-light-tooltip-usage-content');
      usageContentDiv.innerHTML = `<code>${data.usage}</code>`;
      usageDiv.style.display = 'block';
    }

    const argumentsDiv = shadowRoot.querySelector('#rdocs-light-tooltip-arguments');
    if (!showTopicArgumentsSection || data.arguments.length === 0) {
      argumentsDiv.style.display = 'none';
    } else {
      const argumentsContentDiv = shadowRoot.querySelector('#rdocs-light-tooltip-arguments-content');
      argumentsContentDiv.innerHTML = createArgumentsList(data.arguments);
      argumentsDiv.style.display = 'block';
    }

    setNavigation(data.url, data.anchors);
  }

  function parseVersions(part) {
    const versionRegex = new RegExp('(.*)/versions/(.*)', 'g');
    const versionMatch = versionRegex.exec(part);
    if (versionMatch === null) {
      return {
        package: decodeURIComponent(part),
      };
    }
    return {
      package: decodeURIComponent(versionMatch[1]),
      version: decodeURIComponent(versionMatch[2]),
    };
  }

  function parseTopicURL(url) {
    const urlRegexString = `${API_BASE_URL}/api/light/packages/(.*)/topics/(.*)`;
    const urlRegex = new RegExp(urlRegexString, 'g');
    const match = urlRegex.exec(url);
    if (match !== null) {
      const result = parseVersions(match[1]);
      result.topic = decodeURIComponent(match[2]);
      return result;
    }

    return undefined;
  }

  function parsePackageURL(url) {
    const urlRegexString = `${API_BASE_URL}/api/light/packages/(.*)`;
    const urlRegex = new RegExp(urlRegexString, 'g');
    const match = urlRegex.exec(url);
    if (match !== null) {
      return parseVersions(match[1]);
    }

    return undefined;
  }

  function parseRequestURL(url) {
    const result = parseTopicURL(url);
    if (result !== undefined) {
      return result;
    }
    return parsePackageURL(url);
  }

  function reqLoadListener() {
    const data = JSON.parse(this.responseText);
    const requestInfo = parseRequestURL(this.responseURL);

    if (data.title !== undefined) {
      if (requestInfo.topic === undefined) {
        loadPackageData(data);
      } else {
        loadTopicData(data);
      }
      showTooltip();
    } else {
      let text = `No documentation found for the package '${requestInfo.package}'`;
      if (requestInfo.version) {
        text += ` v${requestInfo.version}`;
      }
      if (requestInfo.topic) {
        text = `No documentation found for '${requestInfo.package}::${requestInfo.topic}'`;
        if (requestInfo.version) {
          text = `No documentation found for '${requestInfo.topic}' in ${requestInfo.package} v${requestInfo.version}`;
        }
      }
      showNotFound(text);
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

  function getLocation(href) {
    const l = document.createElement('a');
    l.href = href;
    return l;
  }

  const urlRegexes = [
    { url: '/packages/(.*)/versions/(.*)/topics/(.*)', fields: ['package', 'version', 'topic'] },
    { url: '/packages/(.*)/versions/(.*)', fields: ['package', 'version'] },
    { url: '/packages/(.*)/topics/(.*)', fields: ['package', 'topic'] },
    { url: '/packages/(.*)', fields: ['package'] },
  ];

  function parseRDocLink(url) {
    const l = getLocation(url);
    if (!(l.hostname === 'rdocumentation.org' || l.hostname === 'www.rdocumentation.org')) {
      return false;
    }

    let valid;
    urlRegexes.some((urlRegexObject) => {
      const urlRegex = new RegExp(urlRegexObject.url, 'g');
      const match = urlRegex.exec(l.pathname);
      if (match !== null) {
        valid = {};
        for (let i = 0; i < urlRegexObject.fields.length; i++) {
          valid[urlRegexObject.fields[i]] = match[i + 1];
        }
        return true;
      }
      return false;
    });

    return valid;
  }

  function sendRequest(data) {
    if (autoPin) {
      tooltipIsPinned = true;
    }
    showLoader();
    const oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqLoadListener);
    oReq.addEventListener('error', reqErrorListener, false);
    let url = `${API_BASE_URL}/api/light/packages/${data.package}`;
    if (data.version !== undefined) {
      url += `/versions/${data.version}`;
    }
    if (data.topic !== undefined) {
      url += `/topics/${data.topic}`;
    }
    oReq.open('get', url, true);
    oReq.send();
  }

  function linkElementMouseOverListener(DOMElement) {
    onLinkElement = true;
    const element = DOMElement;
    element.classList.add('rdocs-light-link-hovered');
    let data;
    if (element.hasAttribute('data-mini-rdoc')) {
      data = parseAttribute(element.getAttribute('data-mini-rdoc'));
      if (element.hasAttribute('data-mini-rdoc-version')) {
        data.version = element.getAttribute('data-mini-rdoc-version');
      }
    } else {
      data = parseRDocLink(element.href);
    }

    if (data !== undefined) {
      const visible = setToolTipPosition(element.getBoundingClientRect());
      if (visible) {
        sendRequest(data);
      } else {
        console.info('Not enough space, rdocs light widget not shown.');
      }
    } else {
      console.warn('Invalid attribute value.');
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
      console.info('No data-mini-rdoc attributes found.');
    }

    links.forEach(linkElement => linkElement.addEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
    links.forEach(linkElement => linkElement.addEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
  }

  function findAllRDocLinks() {
    if (findRDocLinks) {
      let links = Array.from(document.querySelectorAll('a'));
      if (links.length === 0) {
        console.info('No RDocumentation links found.');
      }
      links = links.filter(link => parseRDocLink(link.href) !== undefined);
      links = links.filter(link => !link.hasAttribute('data-mini-rdoc'));
      links.forEach(linkElement => linkElement.addEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
      links.forEach(linkElement => linkElement.addEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
    }
  }

  function removeLinksAllRDocLinks() {
    if (findRDocLinks) {
      let links = document.querySelectorAll('a');
      links = links.filter(link => !link.hasAttribute('data-mini-rdoc'));
      links.forEach(linkElement => linkElement.removeEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
      links.forEach(linkElement => linkElement.remvoeEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
    }
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

  function getLinkFromTag(attribute, versionAttribute) {
    const data = parseAttribute(attribute);
    if (versionAttribute) {
      data.version = versionAttribute;
    }
    if (data !== undefined) {
      let url = `https://rdocumentation.org/packages/${data.package}`;
      if (data.version !== undefined) {
        url += `/versions/${data.version}`;
      }
      if (data.topic !== undefined) {
        url += `/topics/${data.topic}`;
      }
      return url;
    }

    return undefined;
  }

  function wrap(toWrap, wrapper) {
    wrapper = wrapper || document.createElement('div');
    if (toWrap.nextSibling) {
      toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
    } else {
      toWrap.parentNode.appendChild(wrapper);
    }
    return wrapper.appendChild(toWrap);
  }

  function setWidgetsForRdocLinks(find) {
    if (find !== findRDocLinks) {
      findRDocLinks = find;
      if (findRDocLinks) {
        findAllRDocLinks();
      } else {
        removeLinksAllRDocLinks();
      }
    }
  }

  module.exports = {
    initRDocsLight: (options) => {
      if (options) {
        if (options.topOffset !== undefined) {
          topOffset = options.topOffset;
        }
        if (options.autoPin !== undefined) {
          autoPin = options.autoPin;
        }
        if (options.pinOnClick !== undefined) {
          pinOnClick = options.pinOnClick;
        }
        if (options.widgetForRDocsLinks !== undefined) {
          setWidgetsForRdocLinks(options.widgetForRDocsLinks);
        }
        if (options.showTopicUsageSection !== undefined) {
          showTopicUsageSection = options.showTopicUsageSection;
        }
        if (options.showTopicArgumentsSection !== undefined) {
          showTopicArgumentsSection = options.showTopicArgumentsSection;
        }
      }
      createTooltip((options) ? options.container : options);
      addBodyClickListener();
      findAllRDocLightDataAttributes();
    },
    autoLink: () => {
      const links = Array.from(document.querySelectorAll('[data-mini-rdoc]'));
      links.forEach((link) => {
        const attribute = link.getAttribute('data-mini-rdoc');
        const versionAttribute = link.getAttribute('data-mini-rdoc-version');
        const url = getLinkFromTag(attribute, versionAttribute);
        if (url !== undefined) {
          if (link.nodeName === 'A') {
            link.href = url;
          } else {
            const a = document.createElement('a');
            a.href = url;
            wrap(link, a);
          }
        }
      });
    },
  };
})();
