import { Component } from '../../component.decorator'

declare var gapi: any

@Component({
    bindings: {
        onLogStatusChange: '&',
    },
    template: `<md-content flex layout-padding ng-show="!$ctrl.loading">
        <p>Before you can use Angular Inbox, you need to sign in with your Google account</p>

        <div id="google-sign-in">
            <span id="sign-in-button"></span>
        </div>
    </md-content>

    <md-content flex  layout-padding ng-if="$ctrl.loading">
        <div layout="row" layout-sm="column" layout-align="center">
            <md-progress-circular md-mode="indeterminate"></md-progress-circular>
        </div>
    </md-content>`,
})
export class GLoginComponent {
    public $inject: string[] = ['$q', '$timeout', '$interval', '$rootScope']
    public logged: boolean = false
    public loading: boolean = true
    public onLogStatusChange
    public $rootScope

    private clientId: string = '221435633341-qrqreg5t1m96b9clbk2b9d522lj3f3nl.apps.googleusercontent.com'
    private $q
    private $timeout
    private $interval

    constructor ($q, $timeout, $interval, $rootScope) {
        this.$q = $q
        this.$timeout = $timeout
        this.$interval = $interval
        this.$rootScope = $rootScope

        this.loadGapi()
            .then((e) => {
                let interval = $interval(() => {
                    this.isGapiLoaded(interval)
                })
            })
    }

    public onGapiLoad (self: GLoginComponent) {
        return (authResult) => {
            if (authResult && !authResult.error) {
                self.onLogStatusChange({ $event: true })
                self.$rootScope.$digest()
            } else {
                self.loading = false
                gapi.signin.render('sign-in-button', {
                    callback: self.onGapiLoad(self),
                    clientid: self.clientId,
                    cookiepolicy: 'single_host_origin',
                    requestvisibleactions: 'http://schemas.google.com/AddActivity',
                    scope: 'https://www.googleapis.com/auth/gmail.readonly',
                })
            }
        }
    }

    public loadGapi () {
        let deferred = this.$q.defer()
        let po = document.createElement('script')
        po.type = 'text/javascript'
        po.async = true
        po.src = 'https://apis.google.com/js/client:plusone.js'
        po.onload =  (e) => {
            this.$timeout(() => {
                deferred.resolve(e)
            })
        }
        let s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(po, s)

        return deferred.promise
    }

    public isGapiLoaded (interval) {
        if (gapi.auth !== undefined) {
            this.$interval.cancel(interval)
            this.onGapiLoad(this)(null)
        }
    }
}
