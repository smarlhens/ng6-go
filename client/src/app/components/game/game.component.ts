import {Component, OnInit} from '@angular/core';
import {GoService} from "../../shared/services/go.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerService} from "../../shared/services/player.service";
import {Title} from "@angular/platform-browser";
import {Player} from "../../shared/models/player";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {

    private player: Player;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private goService: GoService,
        private playerService: PlayerService,
        private titleService: Title
    ) {
    }

    ngOnInit(): void {
        this.playerService.player$.subscribe((player) => this.player = player);
        let uuid = this.route.snapshot.paramMap.get('uuid');
        if (null === uuid) {
            this.router.navigate(['/']);
        }
        this.titleService.setTitle('Game ' + uuid);
        const game = this.goService.createGame(uuid);
        this.goService.joinGame(game, this.player);
    }
}
