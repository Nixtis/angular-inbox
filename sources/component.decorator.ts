import * as angular from 'angular'

export function Component (params: IComponentParams) {
    return (controller: Object) => {
        angular.extend(controller, { controller }, params)
    }
}

interface IComponentParams {
    templateUrl?: string
    template?: string
    bindings?: any
    transclude?: boolean
    require?: Object
}
