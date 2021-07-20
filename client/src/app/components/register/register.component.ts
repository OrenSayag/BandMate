import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GenresService } from 'src/app/services/genres.service';
import { InstrumentsService } from 'src/app/services/instruments.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('profileImg') profileImg: any;
  @ViewChild('submit') submit: any;

  public errorMessage: string = '';

  public chosenGenres: string[] = [];
  public chosenInstruments: string[] = [];

  public fileToUpload: any;
  public fileSrc: string = '';

  constructor(
    private fb: FormBuilder,
    public _auth: AuthService,
    public _r: Router,
    public _genres: GenresService,
    public _instruments: InstrumentsService,
    public _http: HttpClient
  ) {}

  ngOnInit() {
    this._genres.getGenres();
    this._instruments.getInstruments();
    // console.log(this._genres.genresCatalog);
    // console.log(this._instruments.instrumentsCatalog);
  }

  public async register() {
    if (
      this.myForm.controls.userName.errors ||
      this.myForm.controls.password.errors ||
      this.myForm.controls.repeatPassword.errors ||
      this.myForm.controls.mail.errors
    ) {
      // console.log('running');
      this.errorMessage = 'Missing Some Info';
      return;
    }
    if (
      this.myForm.controls.password.value !== this.myForm.controls.repeatPassword.value
    ) {
      this.errorMessage = "Passwords don't match";
      return;
    }
    if (
      !this.myForm.controls.isBand.value &&
      (this.myForm.controls.fname.value.length === 0 ||
        this.myForm.controls.lname.value.length === 0)
    ) {
      this.errorMessage = 'Missing Some Info';
      return;
    }

    if (this.chosenInstruments.length === 0) {
      this.errorMessage = 'Missing Instruments';
      return;
    }
    if (this.chosenGenres.length === 0) {
      this.errorMessage = 'Missing Genres';
      return;
    }

    // console.log(this.chosenGenres.length)
    // console.log(this.chosenInstruments.length)

    // upload image and register
    // await this.uploadProfileImg()

    const file = new FormData();
    file.set('file', this.fileToUpload);
    // console.log(file);

    const response: any = await this._http
      // .post('http://localhost:666/api/auth/uploadProfilePicture', file)
      .post('/api/auth/uploadProfilePicture', file)
      .toPromise()
      .catch((err) => (this.fileSrc = ''));
    // console.log(response);
    this.fileSrc = response.fileId;

    // console.log(this.fileSrc);

    const res = await this._auth.register(
      this.myForm.controls.isBand.value,
      this.myForm.controls.fname.value,
      this.myForm.controls.lname.value,
      this.myForm.controls.userName.value,
      this.myForm.controls.mail.value,
      this.myForm.controls.password.value,
      this.chosenInstruments,
      this.chosenGenres,
      this.fileSrc
    );
    if (res) {
      if (res.ok) {
        this.errorMessage = 'Succesfuly registered! Redirecting to login';
      } else {
        this.errorMessage = res.error.taken;
      }
    }
  }

  public clickFileInput() {
    this.fileInput.nativeElement.click();
  }

  public handleFileInputChange(event: any): void {
    // saves the file obj to use when uploading (upon register)
    // and sets the img src on the form to be the picture uploaded.

    this.fileToUpload = this.fileInput.nativeElement.files[0];

    if (!this.validateFileIsImg()) {
      return;
    }

    const reader = new FileReader();

    this.profileImg.nativeElement.title = this.fileToUpload.name;

    reader.onload = (event) => {
      this.profileImg.nativeElement.src = event?.target?.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    // reader.readAsDataURL()

    // console.log(this.fileToUpload.name);
    // this.uploadFile()
  }

  public validateFileIsImg(): boolean {
    const fileType: string | undefined = this.fileToUpload.name
      .split('.')
      .pop();

    // console.log(fileType)

    const allowedFileTypes = ['jpg', 'jpeg', 'png'];
    if (!allowedFileTypes.some((t) => t === fileType)) {
      this.errorMessage =
        'Recieved wrong file type. Please upload mp4, jpg, jpeg, png';
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
      console.log('Only jpg, jpeg, png are allowed');
      return false;
    }
    return true;
  }

  public async uploadProfileImg() {
    // run it before registering , after validations

    const file = new FormData();
    file.set('file', this.fileToUpload);
    // console.log(file);
    const res: any = await this._http
      // .post('http://localhost:666/api/auth/uploadProfilePicture', file, {
      .post('/api/auth/uploadProfilePicture', file, {
        headers: { authorization: localStorage.token },
      })
      .toPromise()
      .catch((err) => (this.fileSrc = ''));
    // console.log(res);
    this.fileSrc = res.fileId;
    // console.log('running uploadProfileImg');
    // resolve()
  }

  myForm = this.fb.group({
    isBand: [false],
    fname: ['', [Validators.required]],
    lname: ['', [Validators.required]],
    userName: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=[a-zA-Z0-9._]{4,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/
        ),
      ],
    ],
    mail: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
      ],
    ],
    repeatPassword: [
      '',
      [
        Validators.required,
      ],
    ],
  });

  public handleInstrumentChange(id: string) {
    if (this.chosenInstruments.some((i) => i === id)) {
      this.chosenInstruments = this.chosenInstruments.filter((i) => i !== id);
      // console.log(this.chosenInstruments);
      return;
    }
    this.chosenInstruments.push(id);
    // console.log(this.chosenInstruments);
  }

  public handleGenreChange(id: string) {
    if (this.chosenGenres.some((i) => i === id)) {
      this.chosenGenres = this.chosenGenres.filter((i) => i !== id);
      // console.log(this.chosenGenres);
      return;
    }
    this.chosenGenres.push(id);
    // console.log(this.chosenGenres);
  }

  public clickTab(event: any) {
    if (event.index === 0) {
      this.myForm.patchValue({
        isBand: false,
      });
      return;
    }
    this.myForm.patchValue({
      isBand: true,
    });
  }

  public submitForm() {
    this.submit.nativeElement.click();
  }
}
