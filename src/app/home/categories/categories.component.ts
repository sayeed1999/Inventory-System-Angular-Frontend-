import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/Category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'Name', 'Description', 'Remove'];
  dataSource: Category[] = [];
  dataSourceCopy: Category[] = []; // to be used in the UI
  searchKeyword: string = '';
  
  isModal: boolean = false;
  
  categoryForm : FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl('', []),
  });

  constructor(
    private categoryService: CategoryService,
  ) { }

  fetchAll() {
    this.categoryService.GetAllCategories().subscribe(
      (res: Category[]) => {
        this.dataSource = res;
        this.updateDataSource();
      },
      error => {
        console.log(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAll();
  }


  searching() {
    this.updateDataSource();
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(index: number)
  {
    this.categoryService.DeleteCategoryById( this.dataSource[index].Id ).subscribe(
      (res: Category) => {
        // success
        this.fetchAll();
      },
      error => {
        console.log(error);
      }
    );
  }

  updateDataSource = () => this.dataSourceCopy = [ ...this.dataSource ];

  // Add Category
  onFormSubmit() {
    this.isModal = false;
    this.categoryService.AddCategory(this.categoryForm.value.Name, this.categoryForm.value.Description).subscribe(
      (res: Category) => {
        // success
        this.fetchAll();
      },
      error => {
        console.log("error occurred while adding to db");
      }
    );
    this.categoryForm.reset();
  }

  isValid() : boolean {
    return this.categoryForm?.status == "VALID";
  }
}
