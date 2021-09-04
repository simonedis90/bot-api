
export function chunkArrayInGroups<T>(arr, size): Array<T[]> {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}

export interface LoginResponse {
    token: string;
    product: string;
    status: string;
    error: string;
}

export interface BetFairResponse<T> {
    jsonrpc: string;
    result: T;
    error: any;
}

export type bf<T> = BetFairResponse<T[]>[];
export type bfSingle<T> = BetFairResponse<T>;

export interface EventType {
    id: string;
    name: string;
}

export interface EventTypeResponse {
    eventType: EventType;
    marketCount: number;
}