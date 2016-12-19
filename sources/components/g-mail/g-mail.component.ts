import * as angular from 'angular'

import { Component } from '../../component.decorator'
import { GmailService } from './g-mail.service'
import { InfiniteItems } from './infinite-items.model'
import { Message } from './message.model'

@Component({
    template: `<md-toolbar md-scroll-shrink>
        <div class="md-toolbar-tools">My messages</div>
    </md-toolbar>

    <md-content md-theme="altTheme">
        <md-virtual-repeat-container ng-style="$ctrl.getListHeight()" ng-if="$ctrl.messages !== null">
            <md-list layout-padding>
                <md-list-item class="md-3-line" md-on-demand md-virtual-repeat="message in $ctrl.messages" ng-click="$ctrl.showDetails($event, message)">
                    <img src="/avatar.png" class="md-avatar" alt="{{ message.from }}">
                    <div class="md-list-item-text" ng-if="message.from !== ''">
                        <h3>{{ message.subject !== '' ? message.subject : 'No subject' }}</h3>
                        <h4>{{ message.from !== '' ? message.from : 'Unknown sender' }} ({{ message.date | date: 'medium' }})</h4>
                        <p>
                            {{ message.snippet }}
                        </p>
                    </div>
                </md-list-item>
            </md-list>
        </md-virtual-repeat-container>
    </md-content>`,
})
export class GMailComponent {
    public messages: InfiniteItems = null

    public $inject: string[] = [ '$scope', '$mdDialog', '$filter', 'mailService' ]

    private $mdDialog
    private $filter
    private gmailService: GmailService

    constructor ($scope, $mdDialog, $filter, gmailService: GmailService) {
        this.$mdDialog = $mdDialog
        this.$filter = $filter
        this.gmailService = gmailService

        this.gmailService.initClient()
            .then(() => this.getMsgList())

        window.addEventListener('resize', () => $scope.$digest())
    }

    public getMsgList () {
        this.messages = new InfiniteItems()

        this.messages.callback = () => {
            return this.gmailService.getMsgList()
                .then((messages: Message[]) => {
                    this.messages.items = this.$filter('orderBy')([
                        ...this.messages.items,
                        ...messages,
                    ], 'date', true)

                    return true
                })
        }

        this.messages.callback()
    }

    public showDetails (ev, message) {
        this.$mdDialog.show({
            clickOutsideToClose: true,
            controller: ($scope, $mdDialog) => {
                $scope.message = message

                $scope.cancel = () => {
                    $mdDialog.cancel()
                }
            },
            fullscreen: false,
            parent: angular.element(document.body),
            targetEvent: ev,
            template: `<md-dialog aria-label="{{ message.subject }}">
                <md-toolbar>
                    <div class="md-toolbar-tools">
                        <h2>{{ message.subject }}</h2>
                        <span flex></span>
                        <md-button class="md-icon-button" ng-click="cancel()">
                            <i class="material-icons">close</i>
                        </md-button>
                    </div>
                </md-toolbar>

                <md-dialog-content>
                    <div class="md-dialog-content">
                        <iframe srcdoc="{{ message.body }}" style="width: 100%; height: 400px; border: none;"></iframe>
                    </div>
                </md-dialog-content>
            </md-dialog>`,
        })
    }

    public getListHeight () {
        return { height: '' + ( window.innerHeight - 72 ) + 'px' }
    }
}
