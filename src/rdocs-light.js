(() => {
  function createContainer(DOMElement) {
    console.log(DOMElement);
  }

  function mouseOverListener(DOMElement) {
    createContainer(DOMElement);
  }

  function findAllRDocLightDataAttributes() {
    const links = document.querySelectorAll('[data-mini-rdoc]');

    if (links.length === 0) {
      console.log('No RDocumentation links found.');
    }

    links.forEach(linkElement => linkElement.addEventListener('mouseover', () => mouseOverListener(linkElement)));
  }

  function initRDocsLight() {
    findAllRDocLightDataAttributes();
  }

  function isAlreadyExecuted() {
    return (typeof (window.initRDocsLight) === 'function');
  }

  if (!isAlreadyExecuted()) {
    window.initRDocsLight = initRDocsLight;
    if (document.readyState === 'complete' || document.readyState === 'loaded') {
      initRDocsLight();
    } else {
      document.addEventListener('DOMContentLoaded', initRDocsLight);
    }
  } else {
    console.log('Warning: tried to load RDocs Light multiple times.');
  }
})();
