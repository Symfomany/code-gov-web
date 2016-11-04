import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {LanguageIconPipe} from './language-icon'
import {PluralizePipe} from './pluralize'
import {TruncatePipe} from './truncate'
import {IsDefinedPipe} from './is-defined';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    IsDefinedPipe,
    LanguageIconPipe,
    PluralizePipe,
    TruncatePipe
  ],
  exports: [
    IsDefinedPipe,
    LanguageIconPipe,
    PluralizePipe,
    TruncatePipe
  ]
})
export class AppPipesModule {}
