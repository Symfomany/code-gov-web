import { PlatformRef } from '@angular/core';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';
import { bootstrapWorkerUi, WORKER_UI_LOCATION_PROVIDERS, MessageBus } from '@angular/platform-webworker';
import { Title } from '@angular/platform-browser';

bootstrapWorkerUi('main_worker.bundle.js', WORKER_UI_LOCATION_PROVIDERS)
  .then((platform: PlatformRef) => {
    const DOM = getDOM();
    const headElement = DOM.query('head');
    const messageBus: MessageBus = platform.injector.get(MessageBus);
    const titleElement: HTMLElement = headElement.querySelector('title');
    const metaDescription = getOrCreateMetaElement('description');
    messageBus.initChannel('seo.service');
    const robots = getOrCreateMetaElement('robots');

    messageBus.from('seo.service').subscribe((instruction) => {
      console.log('instruction', instruction);
      switch(instruction.command) {
        case 'setTitle':
          setTitle(instruction.data.newTitle, instruction.data.baseTitle);
          break;
        case 'setMetaDescription':
          setMetaDescription(instruction.data.description);
          break;
        case 'setMetaRobots':
          setMetaRobots(instruction.data.content);
          break;
      }
    })

    function setMetaDescription(description: string) {
      metaDescription.setAttribute('content', description);
    }

    function setMetaRobots (content: string) {
      robots.setAttribute('content', content);
    }

    function setTitle(newTitle: string, baseTitle: boolean) {
      if (baseTitle === true)
        newTitle += ' · Code.gov';
      titleElement.textContent = newTitle;
    }

    function getOrCreateMetaElement(name: string): HTMLElement {
      let el: HTMLElement;
      el = DOM.query('meta[name=' + name + ']');
      if (el === null) {
        el = DOM.createElement('meta');
        el.setAttribute('name', name);
        headElement.appendChild(el);
      }
      return el;
    }
  });