import { Component, Input, OnInit } from '@angular/core';

import { People } from '../model/people.model';

@Component({
  selector: 'app-people-item',
  templateUrl: './people-item.component.html',
  styleUrls: ['./people-item.component.scss'],
})
export class PeopleItemComponent implements OnInit {
  @Input() listPeople: People[] = [];

  constructor() {}

  ngOnInit(): void {}
}
