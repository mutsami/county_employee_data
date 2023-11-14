import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form!: FormGroup;



  constructor(private _router: Router,public auth:AuthService) {

    this.form = new FormGroup({ 
      
      first_name: new FormControl(''), 
      
      surname: new FormControl(''),  
      
      other_name: new FormControl(''), 
       
      id: new FormControl(''), 
      gender: new FormControl(''), 
      email: new FormControl(''), 
      title: new FormControl(''), 
      nationality: new FormControl(''), 
      ethnicity: new FormControl(''), 
      county: new FormControl(''), 
      address: new FormControl(''), 
      postal_code: new FormControl(''),  

      town: new FormControl(''), 
      altcont: new FormControl(''), 
      altphone: new FormControl(''), 
      disability: new FormControl(''), 
      disabilityDetials: new FormControl(''), 
      disabilityReg: new FormControl(''),
      datepicker: new FormControl(''),
    });

   }

  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }


    
  submit(){   
    this.auth.createProfile(this.form.value).then(()=>{

      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
      this._router.onSameUrlNavigation = 'reload';
      this._router.navigate(['/']).then(()=>{ 
      
        alert("Saved!!Employee data has been created succefully.")
    })
    

    })
    
  }

}
