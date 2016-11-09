import {bootstrapWorkerUi, WORKER_UI_LOCATION_PROVIDERS} from '@angular/platform-webworker';

bootstrapWorkerUi('main_worker.bundle.js', WORKER_UI_LOCATION_PROVIDERS);