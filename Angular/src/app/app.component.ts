import { Component, OnInit } from '@angular/core';
import Amplify, { Auth, Hub } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'myBot';

ngOnInit(){

}
}
