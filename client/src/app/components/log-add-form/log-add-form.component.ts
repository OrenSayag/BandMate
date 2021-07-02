import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import ContentCategory from 'src/app/models/tinyModels/content-category.model';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-log-add-form',
  templateUrl: './log-add-form.component.html',
  styleUrls: ['./log-add-form.component.css']
})
export class LogAddFormComponent implements OnInit {

  public chosenInstruments:string[] = []
  public chosenCategories:ContentCategory[] = []
  public ratingStars:number = 0


  public chipInputTog:boolean = false;
  public successDivText:string = "";

  @Output()
  public successfulLog:EventEmitter<boolean> = new EventEmitter()
  
  constructor(
      public _fb:FormBuilder,
      public _users:UsersService,
      public _logs:LogsService,

    ) { }
    
    ngOnInit(): void {
    }
    
    public chosenInstrumentsListener(e:string[]):void{
      this.chosenInstruments = e
      // console.log("from log form add:")
      // console.log(this.chosenInstruments)
    }

    public myForm = this._fb.group({
      time: ["", [Validators.required]],
      title: ["", Validators.maxLength(10)],
      isPrivate: [false, Validators.required],
    })


    public addCategory(e:any){
      console.log(e.value)
      const colorArr = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

      this._logs.addLogCategory({name:e.value, color:colorArr[Math.floor(Math.random()*colorArr.length)]}, this._users.currUserOtBand._id)
      e.input.value = ""
    }

    public delCategory(catName:string){
    
      this._logs.delLogCategory(catName, this._users.currUserOtBand._id)
    }

    public handleClickCategory(category:ContentCategory):void{
      if(this.chosenCategories.some(c=>c===category)){
        this.chosenCategories = this.chosenCategories.filter(c=>c!==category)
      } else {
        this.chosenCategories.push(category)
      }
    }

    public handleRatingStar(star:number):void{
      this.ratingStars = star
    }

    public async postLog():Promise<void>{
        const res:boolean = await this._logs.postLog(
          this.myForm.controls.time.value,
          this.chosenInstruments,
          this.myForm.controls.isPrivate.value,
          this.myForm.controls.title.value,
          this.chosenCategories,
          this.ratingStars,
        )

        if(res){
          this.myForm.reset()
          this.ratingStars = 0
          this.chosenCategories = []
          this.chosenInstruments = []
          this.successDivText = "Log added"
          this.successfulLog.emit(true)
        }
        // console.log("dafuq?")
    }

    
}
