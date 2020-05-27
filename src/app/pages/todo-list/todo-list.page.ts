import { Component, OnInit } from '@angular/core';  
import { Observable } from 'rxjs';  
import { Todo, TodoService } from 'src/app/services/todo.service';  
  
@Component({  
  selector: 'app-todo-list',  
  templateUrl: './todo-list.page.html',  
  styleUrls: ['./todo-list.page.scss'],  
})  
export class TodoListPage implements OnInit {  
  public todos: Observable<Todo[]>;  
  constructor(private todoService: TodoService) { }  
  ngOnInit() {  
    this.todos = this.todoService.getTodos();  
  }  
}  