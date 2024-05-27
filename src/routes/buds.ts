import { Express } from 'express';

import { CS571Route } from "@cs571/su24-api-framework/src/interfaces/route";
import BadgerBudDetail from '../model/bud-detail';

export class CS571BudsRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/rest/su24/hw5/buds';

    private readonly buds: BadgerBudDetail[];

    public constructor(buds: BadgerBudDetail[]) {
        this.buds = buds;
    }

    public addRoute(app: Express): void {
        app.get(CS571BudsRoute.ROUTE_NAME, (req, res) => {
            res.status(200).set('Cache-control', 'private, max-age=60').send(this.buds);
        })
    }

    public getRouteName(): string {
        return CS571BudsRoute.ROUTE_NAME;
    }
}