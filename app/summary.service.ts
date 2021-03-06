import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class SummaryService {

    private summaryUrl = '/rest/auth';
    private movesAuthUrl = '/rest/auth/moves';

    constructor(public http : Http) {
    }

    getSummary(authCode: string) {

        // Parameters obj-
        let params: URLSearchParams = new URLSearchParams();
        params.set('code', authCode);

        return this.http.get(this.summaryUrl, {search: params})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    authMoves(userId: string) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('user_id', userId);

        return this.http.get(this.movesAuthUrl, {search: params})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}