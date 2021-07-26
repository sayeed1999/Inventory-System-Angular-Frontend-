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
    this.dataSourceCopy = this.dataSourceCopy.filter(c => c.name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(Id: number)
  {
    this.categoryService.DeleteCategoryById( Id ).subscribe(
      (res: Category) => {
        // success
        this.fetchAll();
      },
      error => {
        console.log(error);
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

    if(this.editScreen) 
    {
      var category = new Category(this.editId, this.categoryForm.value.name, this.categoryForm.value.description);
      this.categoryService.UpdateCategory(category).subscribe(
        (res: Category) => {
          this.fetchAll();
        }, error => console.log(error),
      );
      this.editScreen = false;
      this.categoryForm.reset();
      return;
    }

    this.categoryService.AddCategory(this.categoryForm.value.name, this.categoryForm.value.description).subscribe(
      (res: Category) => { // success
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
