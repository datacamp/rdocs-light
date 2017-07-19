import 'core-js/fn/array/from';
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

  const selectors = {
    anchors: '#rdocs-light-tooltip-anchors',
    title: '#rdocs-light-tooltip-title',
    desc: '#rdocs-light-tooltip-description',
    h_topic: '#rdocs-light-tooltip-header-topic',
    h_package: '#rdocs-light-tooltip-header-package',
    h_version: '#rdocs-light-tooltip-header-version',
    tag: 'data-mini-rdoc',
    tagv: 'data-mini-rdoc-version',
    hover: 'rdocs-light-link-hovered',
    usage: '#rdocs-light-tooltip-usage',
    usagec: '#rdocs-light-tooltip-usage-content',
    args: '#rdocs-light-tooltip-arguments',
    argsc: '#rdocs-light-tooltip-arguments-content',
    tt: 'rdocs-light-tooltip',
    ttc: 'rdocs-light-tooltip-container',
    arrow: '.rdocs-light-arrow',
    nav: '#rdocs-light-nav',
  };

  let topOffset = 0;
  let autoPin = false;
  let pinOnClick = true;
  let findRDocLinks = false;
  let showTopicUsageSection = false;
  let showTopicArgumentsSection = false;

  function setAnchorsDisplay(display) {
    const anchors = shadowRoot.querySelector(selectors.anchors);
    if (anchors !== null) {
      anchors.style.display = display;
    }
  }

  function getAnchorsDisplay() {
    const anchors = shadowRoot.querySelector(selectors.anchors);
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
    containerDiv.setAttribute('id', selectors.tt);
    pageContainer.appendChild(containerDiv);
    tooltip = document.querySelector(`#${selectors.tt}`);
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

  function posTop() {
    if (typeof window.pageYOffset !== 'undefined') {
      return window.pageYOffset;
    } else if (document.documentElement.scrollTop) {
      return document.documentElement.scrollTop;
    } else if (document.body.scrollTop) {
      return document.body.scrollTop;
    }
    return 0;
  }

  function setToolTipPosition(box) {
    const scrollTop = posTop();
    const scrollLeft = document.body.scrollLeft;
    const screenSize = getCurrentVisibleHeightAndWidth();

    // Seems necessairy
    screenSize.x -= 25;

    let top = (box.top + topOffset) + scrollTop - TOOLTIP_HEIGHT;
    let left = box.left - scrollLeft;

    if (left + TOOLTIP_WIDTH > screenSize.x) {
      left = screenSize.x - TOOLTIP_WIDTH + scrollLeft;
      if (left < 0) {
        hideTooltip();
        return false;
      }
    }

    if (top < scrollTop) {
      top = box.bottom + scrollTop;
      if (top + TOOLTIP_HEIGHT > screenSize.y + scrollTop) {
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
    style.innerHTML = css;
    shadowRoot.appendChild(style);
  }

  function loadView(view) {
    const container = document.createElement('div');
    container.setAttribute('id', selectors.ttc);
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
    shadowRoot.querySelector(selectors.title).innerText = text;
    showTooltip();
  }

  function setNavigation(url, anchors) {
    const arrows = Array.from(shadowRoot.querySelectorAll(selectors.arrow));
    const nav = shadowRoot.querySelector(selectors.nav);
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
    shadowRoot.querySelector(selectors.title).innerHTML = data.title;
    shadowRoot.querySelector(selectors.desc).innerHTML = data.description || '';
    const packageVersion = shadowRoot.querySelector(selectors.h_package);
    packageVersion.innerText = data.package_name;
    packageVersion.href = data.url;
    const version = shadowRoot.querySelector(selectors.h_version);
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

    shadowRoot.querySelector(selectors.title).innerHTML = data.title;
    shadowRoot.querySelector(selectors.desc).innerHTML = data.description || '';
    const topic = shadowRoot.querySelector(selectors.h_topic);
    topic.innerText = data.name;
    topic.href = data.url;
    const packageVersion = shadowRoot.querySelector(selectors.h_package);
    packageVersion.innerText = `${data.package_version.package_name} v${data.package_version.version}`;
    packageVersion.href = data.package_version.url;

    const usageDiv = shadowRoot.querySelector(selectors.usage);
    if (!showTopicUsageSection || !data.usage) {
      usageDiv.style.display = 'none';
    } else {
      const usageContentDiv = shadowRoot.querySelector(selectors.usagec);
      usageContentDiv.innerHTML = `<code>${data.usage}</code>`;
      usageDiv.style.display = 'block';
    }

    const argumentsDiv = shadowRoot.querySelector(selectors.args);
    if (!showTopicArgumentsSection || data.arguments.length === 0) {
      argumentsDiv.style.display = 'none';
    } else {
      const argumentsContentDiv = shadowRoot.querySelector(selectors.argsc);
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

  function reqLoadListener(response, url) {
    const data = JSON.parse(response.responseText);
    const requestInfo = parseRequestURL(url);

    if (data.title !== undefined) {
      if (!requestInfo.topic) {
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
    let url = `${API_BASE_URL}/api/light/packages/${data.package}`;
    if (data.version !== undefined) {
      url += `/versions/${data.version}`;
    }
    if (data.topic !== undefined) {
      url += `/topics/${data.topic}`;
    }
    oReq.addEventListener('load', response => reqLoadListener(response.target, url));
    oReq.addEventListener('error', reqErrorListener, false);
    oReq.open('get', url, true);
    oReq.send();
  }

  function linkElementMouseOverListener(DOMElement) {
    onLinkElement = true;
    const element = DOMElement;
    element.classList.add(selectors.hover);
    let data;
    if (element.hasAttribute(selectors.tag)) {
      data = parseAttribute(element.getAttribute(selectors.tag));
      if (element.hasAttribute(selectors.tagv)) {
        data.version = element.getAttribute(selectors.tagv);
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
    element.classList.remove(selectors.hover);
    onLinkElement = false;
    if (!onTooltip) {
      hideTooltip();
    }
  }

  function findAllRDocLightDataAttributes() {
    const links = document.querySelectorAll(`[${selectors.tag}]`);

    if (links.length === 0) {
      console.info(`No ${selectors.tag} attributes found.`);
    }

    Array.from(links).forEach(linkElement => linkElement.addEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
    Array.from(links).forEach(linkElement => linkElement.addEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
  }

  function findAllRDocLinks() {
    if (findRDocLinks) {
      let links = Array.from(document.querySelectorAll('a'));
      if (links.length === 0) {
        console.info('No RDocumentation links found.');
      }
      links = Array.from(links).filter(link => parseRDocLink(link.href) !== undefined);
      links = Array.from(links).filter(link => !link.hasAttribute(selectors.tag));
      Array.from(links).forEach(linkElement => linkElement.addEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
      Array.from(links).forEach(linkElement => linkElement.addEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
    }
  }

  function removeLinksAllRDocLinks() {
    if (findRDocLinks) {
      let links = document.querySelectorAll('a');
      links = Array.from(links).filter(link => !link.hasAttribute(selectors.tag));
      Array.from(links).forEach(linkElement => linkElement.removeEventListener('mouseover', () => linkElementMouseOverListener(linkElement)));
      Array.from(links).forEach(linkElement => linkElement.remvoeEventListener('mouseout', () => linkElementMouseOutListener(linkElement)));
    }
  }

  function bodyClickListener(event) {
    if (tooltipIsPinned) {
      let e = event.target || event.toElement || event.relatedTarget;
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
      const links = Array.from(document.querySelectorAll(`[${selectors.tag}]`));
      Array.from(links).forEach((link) => {
        const attribute = link.getAttribute(selectors.tag);
        const versionAttribute = link.getAttribute(selectors.tagv);
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
