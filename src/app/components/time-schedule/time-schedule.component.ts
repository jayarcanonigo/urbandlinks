import { Component, OnInit, Input } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from '../../model/model';

@Component({
  selector: 'app-time-schedule',
  templateUrl: './time-schedule.component.html',
  styleUrls: ['./time-schedule.component.scss'],
})
export class TimeScheduleComponent implements OnInit {

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
    this.scheduleService.getSchedule().subscribe(resp => {
      if (resp) { 
      this.daystime = resp.day;
      this.getDayTime(this.masterName);
      this.loadSchedule();
      this.scheduleService.setDays(this.daystime);
    }
    });
}

loadSchedule() {
  for (let t of this.timelist) {
    this.updateTimelist(t)
  }

}

updateTimelist(data) {
  for (let timeSchedule of this.daystime) {
    if (timeSchedule.id === data.name) {
      data.isSelected = true;
    }
  }
}


getDayTime(day): void {
  this.daystime = this.daystime.filter(h => h.name === day);
}

changeToggle(data) {
  console.log('JobPartner ', this.scheduleService.getJobPartner());
  
  this.scheduleService.updateDay(this.masterName, this.timelist);
}


}
