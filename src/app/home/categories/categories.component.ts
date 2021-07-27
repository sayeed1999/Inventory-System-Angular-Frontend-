import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/models/Category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Name', 'Description', 'Edit', 'Remove'];
  dataSource: Category[] = [];
  dataSourceCopy: Category[] = []; // to be used in the UI
  searchKeyword: string = '';
  
  isModal: boolean = false;
  editScreen: boolean = false;
  editId: number = 0;
  
  categoryForm : FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
  });

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) { }

  fetchAll() {
    this.categoryService.GetAll().subscribe(
      (res: Category[]) => {
        this.dataSource = res;
        this.updateDataSource();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  searching() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(Id: number)
  {
    this.categoryService.DeleteById( Id ).subscribe(
      (res: Category) => { // success
        this.fetchAll();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
  }

  editClicked(index: number)
  {
    this.editScreen = true;
    this.editId = this.dataSourceCopy[index].id;
    this.categoryForm.controls.name.setValue(this.dataSourceCopy[index].name);
    this.categoryForm.controls.description.setValue(this.dataSourceCopy[index].description);
    this.isModal = true;
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  // Add/Update Category
  onFormSubmit() {
    this.isModal = false;

    let category = new Category(this.editId, this.categoryForm.value.name, this.categoryForm.value.description);
    if(this.editScreen) 
    {
      this.categoryService.Update(category).subscribe(
        (res: Category) => {
          this.fetchAll();
        }, error => this.openSnackBar(error.error.message),
      );
      this.editScreen = false;
      this.categoryForm.reset();
      return;
    }
    category.id = 0; // don't mess with id
    this.categoryService.Add(category).subscribe(
      (res: Category) => { // success
        this.fetchAll();
      },
      error => {
        this.openSnackBar(error.error.message);
      }
    );
    this.categoryForm.reset();
  }

  isValid() : boolean {
    return this.categoryForm?.status == "VALID";
  }

  openSnackBar(message: string) {
    if(message == undefined) message = "Unknown error has occured. Check your connection please.";
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
