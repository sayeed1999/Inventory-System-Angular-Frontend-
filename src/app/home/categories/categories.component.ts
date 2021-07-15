import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/Category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['Id', 'Name', 'Description', 'Remove'];
  dataSource: Category[] = [];
  searchKeyword: string = '';
  // to work with our shared-modal
  isModal: boolean = false;
  toDestroy1!: Subscription;

  categoryForm : FormGroup = new FormGroup({
    Name: new FormControl('', [Validators.required]),
    Description: new FormControl('', []),
  });

  constructor(
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.updateDataSource();
    this.toDestroy1 = this.categoryService.change.subscribe(() => {
      this.updateDataSource();
    });
  }

  ngOnDestroy() {
    this.toDestroy1.unsubscribe();
  }

  searching() {
    this.updateDataSource();
    this.dataSource = this.dataSource.filter(c => c.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) != -1 );
  }

  deleteClicked(index: number)
  {
    this.categoryService.DeleteCategoryById( this.dataSource[index].Id );
  }

  updateDataSource = () => this.dataSource = this.categoryService.GetAllCategories();

  onFormSubmit() {
    this.isModal = false;
    this.categoryService.AddCategory(this.categoryForm.value.Name, this.categoryForm.value.Description);
    this.categoryForm.reset();
  }

  isValid() : boolean {
    return this.categoryForm?.status == "VALID";
  }
}
