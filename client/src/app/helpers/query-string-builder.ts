export class QueryStringBuilder {
    static build(params: URLSearchParams): string {
        return '?' + params.toString(); 
    }
}