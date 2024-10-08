import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../Model/Product';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.css']
})
export class ProductDashboardComponent implements OnInit{
  showCreateProductForm: boolean = false;
  showProductDetails:boolean = false;
  http:HttpClient = inject(HttpClient)
  allProducts:Product[] = [];
  productService:ProductService = inject(ProductService);
  currentProductId:string = '';
  editMode:boolean = false;
  selectedProduct:Product;
  isLoading:boolean = false;
  currentProduct: Product | null = null;

  ngOnInit(): void {
    this.fetchAllProducts();
  }

  openCreateProductForm(){
    this.showCreateProductForm = true;
    this.editMode = false;
    this.selectedProduct = {
      productName:'',
      productType:'',
      productClass: '',
      productDateOfEntry:'',
      productExpiryDate:'',
      productStatus:'',
      productPriority:''
    }
  }

  showCurrentProductDetails(id:string | undefined) {
    this.showProductDetails = true;
    this.productService.getProductDetails(id).subscribe({next :(data:Product) => {
      this.currentProduct = data;
    }})
  }

  closeProductDetails(){
    this.showProductDetails = false
  }

  onEditProductClick(id:string | undefined){
    this.currentProductId = id;
    this.showCreateProductForm = true;
    this.editMode = true;

    this.selectedProduct = this.allProducts.find((product) => {
      return product.id === id
    })
  }

  CloseCreateProductForm(){
    this.showCreateProductForm = false;
  }

  createOrUpdateProduct(product:Product) {
    if (!this.editMode) {
        this.productService.createProduct(product).subscribe(() => {
        this.fetchAllProducts();
      });
    } else {
      this.productService.updateProduct(this.currentProductId, product).subscribe(() => {
        this.fetchAllProducts();
      })
    }
     
  }

  deleteProduct(id:string | undefined) {
    this.productService.deleteProduct(id).subscribe(() =>{
      this.fetchAllProducts();
    });
  }

  deleteAllproducts(){
    this.productService.deleteAllProducts().subscribe(() => {
      this.fetchAllProducts();
    });
  }

  getAllProducts(){
    this.productService.getAllproducts().subscribe((products) => {
      this.allProducts = products;
    })
  }

  private fetchAllProducts() {
    this.isLoading = true;
    this.productService.getAllproducts().subscribe((products) => {
      this.allProducts = products
      console.log(products);
      this.isLoading = false;
    })
  }
}
