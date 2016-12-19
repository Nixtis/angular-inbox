declare var gapi: any

export class MainController {
    public isLogged: boolean = false

    private $mdSidenav

    constructor ($mdSidenav) {
        this.$mdSidenav = $mdSidenav
    }

    public setLogStatus (isLogged: boolean) {
        this.isLogged = isLogged
    }

    public toggleSideNav () {
        this.$mdSidenav('sidenav-left').toggle()
    }

    public logout () {
        gapi.auth.setToken(null)
        gapi.auth.signOut()

        this.isLogged = false

        this.$mdSidenav('sidenav-left').close()
    }
}
