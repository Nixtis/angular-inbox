declare var escape: any

export function utf8Decode (str: string): string {
    return decodeURIComponent(escape(str))
}
