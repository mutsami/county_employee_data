import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  data!:any[];
  constructor(private _router: Router,public auth:AuthService) { }

  ngOnInit(): void {
    
    this.auth.getData().subscribe(e=>{
      this.data = e;
      console.log('e',e)
    })
  }

}
