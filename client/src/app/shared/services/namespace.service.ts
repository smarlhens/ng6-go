import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import * as io from 'socket.io-client';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class NamespaceService {
    public socket;
    private defaultNS: string = '/';
    private currentNS: string;


    constructor(private router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setNamespace(this.getNSByRoute(event.url));
            }
        });
        this.setNamespace();
    }

    /**
     * @param route
     */
    private getNSByRoute(route): string {
        const routes = {
            'game': '^\\/game\\/[a-z0-9\\-]+$',
            'default': '^\\/$'
        };

        if (route.match(new RegExp(routes['game']))) {
            return route;
        } else if (route.match(new RegExp(routes['default']))) {
            return this.defaultNS;
        }
        return null;
    }

    /**
     * @param ns
     */
    private setNamespace(ns = this.defaultNS): void {
        if (null !== ns && ns !== this.currentNS) {
            if (typeof this.socket !== "undefined" && null !== this.socket && this.socket.connected) {
                this.socket.disconnect(true);
            }
            this.socket = io.connect(environment.server + ns, {
                query: {
                    ns: ns,
                    playerUuid: window.localStorage.getItem('uuid')
                },
                forceNew: true
            });
            this.currentNS = ns;
        }
    }
}
