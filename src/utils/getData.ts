type GETDATA = (origin: string, path: string | undefined, query: string, method?: string) => Promise<any>

export const getData: GETDATA = (origin, path, query, method='GET') => {
    const url = `${origin}${path}?${query}`;
    return fetch(url, {method}).then(res => res.text());
}