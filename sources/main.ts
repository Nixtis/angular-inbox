import * as angular from 'angular'
import * as ngMaterial from 'angular-material'

import { MainController } from './shared/main.controller'

import { GLoginComponent } from './components/g-login/g-login.component'
import { GMailComponent } from './components/g-mail/g-mail.component'
import { GmailService } from './components/g-mail/g-mail.service'

angular
    .module('angular-inbox', [
        ngMaterial,
    ])
    .controller('MainController', MainController)
    .component('gLogin', GLoginComponent)
    .component('gMail', GMailComponent)
    .service('gmailService', GmailService)
