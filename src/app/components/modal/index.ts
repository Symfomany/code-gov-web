import { NgModule } from '@angular/core'
import { ModalComponent } from './modal.component';
import { CommonModule } from '@angular/common'
import { Angulartics2Module } from 'angulartics2';

@NgModule({
  imports: [
    CommonModule,
    Angulartics2Module.forChild()
  ],
  declarations: [
    ModalComponent
  ],
  exports: [
    ModalComponent
  ]
})
export class ModalModule {}
