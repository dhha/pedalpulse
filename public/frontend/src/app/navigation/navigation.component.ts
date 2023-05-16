import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  routerUrl: string = '';

  constructor(private router: ActivatedRoute){}

  ngOnInit() {
    console.log(this.router.url);
    // this.routerUrl = this.router.snapshot.url[];
  }
}
