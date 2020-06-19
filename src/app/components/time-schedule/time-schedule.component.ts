import { Component, OnInit, Input } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from '../../model/model';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.scss'],
})
export class TimeScheduleComponent implements OnInit {
  @Input() form: FormGroup;
  @Input('schedule') schedule: Schedule;
  daystime = [];

  timelist = [
    { name: "FROM8AMTO10AM", label: '8 AM - 10 AM', isSelected: false },
    { name: "FROM10AMTO12PM", label: '10 AM - 12 PM', isSelected: false },
    { name: "FROM12PMTO2PM", label: '12 PM - 2 PM', isSelected: false },
    { name: "FROM2PMTO4PM", label: '2 PM - 4 PM', isSelected: false },
    { name: "FROM4PMTO6PM", label: '4 PM - 6 PM', isSelected: false },
    { name: "FROM6PMTO8PM", label: '6 PM - 8 PM', isSelected: false },
    { name: "FROM8PMTO10PM", label: '8 PM - 10 PM', isSelected: false },
    { name: "FROM10PMTO12AM", label: '10 PM - 12 AM', isSelected: false }
  ];
  @Input('day') masterName: string;
  constructor(private scheduleService: ScheduleService) {

  }

  ngOnInit() {

    if (this.schedule) {
      this.daystime = this.schedule.day;
      //this.getDayTime(this.masterName);
      this.loadSchedule(this.masterName);
      this.scheduleService.setDays(this.daystime);
    }

  }

  loadSchedule(day) {
    for (let t of this.timelist) {
      this.updateTimelist(t, day);
    }

  }

  updateTimelist(data, day) {
    for (let timeSchedule of this.daystime.filter(h => h.name === day)) {
      if (timeSchedule.id === data.name) {
        data.isSelected = true;
        this.changeToggle(null, data);
      }
    }
  }


  getDayTime(day): void {
    this.daystime = this.daystime.filter(h => h.name === day);
  }

  changeCheckbox() {
    this.scheduleService.isTimeDirty = true;
    this.scheduleService.updateDay(this.masterName, this.timelist);
  }

  changeToggle(event, job?) {

    const checkArray: FormArray = this.form.get('timesGroup').get('timesArray') as FormArray;
    if (event == null) {
      checkArray.push(new FormControl(job));
    }
    else if (event.detail.checked) {
      // Add a new control in the arrayForm
      event.target.value.isSelected = true;
      this.changeCheckbox();
      checkArray.push(new FormControl(event.target.value));
    } else {
      event.target.value.isSelected = false;
      this.changeCheckbox();
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value.name == event.target.value.name) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }

    //  console.log('JobPartner ', this.scheduleService.getJobPartner());
    // this.scheduleService.isTimeDirty = true;
    //this.scheduleService.updateDay(this.masterName, this.timelist);
  }

  onCheckboxChange(event, job?) {
    console.log(event.target.value);

    const checkArray: FormArray = this.form.get('timesGroup').get('timesArray') as FormArray;
    if (event == null) {
      checkArray.push(new FormControl(job));
    }
    else if (event.target.checked) {
      // Add a new control in the arrayForm
      event.target.value.isSelected = true;
      //this.changeCheckbox();
      checkArray.push(new FormControl(event.target.value));
    } else {
      event.target.value.isSelected = false;
      // this.changeCheckbox();
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value.name == event.target.value.name) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }


}
