import { Injectable } from '@angular/core';
import { MessageBus } from '@angular/platform-webworker';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class SeoService {
  private workerChannel: Subject<any>;

  constructor(messageBus: MessageBus) {
    messageBus.initChannel('seo.service');
    this.workerChannel = messageBus.to('seo.service');
  }

  public setTitle(newTitle: string, baseTitle = false) {
    this.workerChannel.next({
      command: 'setTitle',
      data: { newTitle, baseTitle}
    });
  }

  public setMetaDescription(description: string) {
    this.workerChannel.next({
      command: 'setMetaDescription',
      data: { description }
    });
  }

  public setMetaRobots(content: string) {
    this.workerChannel.next({
      command: 'setMetaRobots',
      data: { content }
    });
  }
}
