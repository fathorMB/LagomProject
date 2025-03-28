export function buildQueryString(params: URLSearchParams): string {
    return '?' + params.toString();
}