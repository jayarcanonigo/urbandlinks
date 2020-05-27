import { Component, OnInit } from '@angular/core';  
import { ToastController } from '@ionic/angular';  
import { Router, ActivatedRoute } from '@angular/router';  
import { TodoService, Todo } from 'src/app/services/todo.service';  
  
@Component({  
  selector: 'app-todo-details',  
  templateUrl: './todo-details.page.html',  
  styleUrls: ['./todo-details.page.scss'],  
})  
export class TodoDetailsPage implements OnInit {  
  
  todo: Todo = {  
    name: '',  
    notes: ''  
  };  
  
  constructor(private activatedRoute: ActivatedRoute, private todoService: TodoService,  
              private toastCtrl: ToastController, private router: Router) { }  
  
  ngOnInit() { }  
  
  ionViewWillEnter() {  
    const id = this.activatedRoute.snapshot.paramMap.get('id');  
    if (id) {  
      this.todoService.getTodo(id).subscribe(todo => {  
        this.todo = todo;  
      });  
    }  
  }  
  
  addTodo() {  
    this.todoService.addTodo(this.todo).then(() => {  
      this.router.navigate(['home/todo-list']);  
      this.showToast('todo added');  
    }, err => {  
      this.showToast('There was a some problem in adding your todo :(');  
    });  
  }  
  
  deleteTodo() {  
    this.todoService.deleteTodo(this.todo.id).then(() => {  
      this.router.navigate(['home/todo-list']);  
      this.showToast('todo deleted');  
    }, err => {  
      this.showToast('There was a some problem in deleting your todo :(');  
    });  
  }  
  
  updateTodo() {  
    this.todoService.updateTodo(this.todo).then(() => {  
      this.router.navigate(['home/todo-list']); 
      this.showToast('todo updated');  
    }, err => {  
      this.showToast('There was a some problem in updating your todo :(');  
    });  
  }  
  
  showToast(msg) {  
    this.toastCtrl.create({  
      message: msg,  
      duration: 2000  
    }).then(toast => toast.present());  
  }  
  
}  