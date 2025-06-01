import { Directive, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../services';
import { AuthService } from '../../services';

@Directive()
export abstract class BaseAdminComponent<T> implements OnInit {
  items: T[] = [];
  currentItem: T | null = null;
  form: FormGroup;
  isEditing = false;
  isLoading = false;

  constructor(
    protected service: BaseService<T>,
    protected fb: FormBuilder,
    protected alertController: AlertController,
    protected toastController: ToastController,
    protected authService: AuthService
  ) {
    this.form = this.buildForm();
  }

  /**
   * Check if the user has administrator role
   */
  isAdmin(): boolean {
    return this.authService.currentUserRole === 'Administrador';
  }

  ngOnInit() {
    this.loadItems();
  }

  /**
   * Load all items
   */
  loadItems() {
    try {
      this.isLoading = true;
      this.service.getAll().subscribe({
        next: (data) => {
          this.items = data || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading items', error);
          this.isLoading = false;
          this.items = []; // Ensure items is initialized even on error
          this.showToast('Error loading items: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');

          // Force UI update by triggering change detection
          setTimeout(() => {
            this.isLoading = false;
          }, 0);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (e) {
      console.error('Unexpected error in loadItems', e);
      this.isLoading = false;
      this.items = []; // Ensure items is initialized even on error
      this.showToast('Unexpected error loading items. Please try again.', 'danger');
    }
  }

  /**
   * Create new item
   */
  createItem() {
    if (this.form.invalid) {
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    if (!this.isAdmin()) {
      this.showToast('You do not have permission to create items', 'danger');
      return;
    }

    try {
      this.isLoading = true;
      this.service.create(this.form.value).subscribe({
        next: () => {
          this.loadItems();
          this.resetForm();
          this.showToast('Item created successfully', 'success');
        },
        error: (error) => {
          console.error('Error creating item', error);
          this.isLoading = false;
          this.showToast('Error creating item: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');

          // Force UI update by triggering change detection
          setTimeout(() => {
            this.isLoading = false;
          }, 0);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (e) {
      console.error('Unexpected error in createItem', e);
      this.isLoading = false;
      this.showToast('Unexpected error creating item. Please try again.', 'danger');
    }
  }

  /**
   * Update existing item
   */
  updateItem() {
    if (this.form.invalid || !this.currentItem) {
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    if (!this.isAdmin()) {
      this.showToast('You do not have permission to update items', 'danger');
      return;
    }

    try {
      const id = this.getItemId(this.currentItem);
      this.isLoading = true;
      this.service.update(id, this.form.value).subscribe({
        next: () => {
          this.loadItems();
          this.resetForm();
          this.isEditing = false;
          this.currentItem = null;
          this.showToast('Item updated successfully', 'success');
        },
        error: (error) => {
          console.error('Error updating item', error);
          this.isLoading = false;
          this.showToast('Error updating item: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
          // Don't reset form or change editing state on error to allow user to try again

          // Force UI update by triggering change detection
          setTimeout(() => {
            this.isLoading = false;
          }, 0);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (e) {
      console.error('Unexpected error in updateItem', e);
      this.isLoading = false;
      this.showToast('Unexpected error updating item. Please try again.', 'danger');
    }
  }

  /**
   * Delete item
   */
  async confirmDelete(item: T) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteItem(item);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Delete item
   */
  deleteItem(item: T) {
    if (!this.isAdmin()) {
      this.showToast('You do not have permission to delete items', 'danger');
      return;
    }

    try {
      const id = this.getItemId(item);
      this.isLoading = true;
      this.service.delete(id).subscribe({
        next: () => {
          this.loadItems();
          if (this.currentItem && this.getItemId(this.currentItem) === id) {
            this.resetForm();
            this.isEditing = false;
            this.currentItem = null;
          }
          this.showToast('Item deleted successfully', 'success');
        },
        error: (error) => {
          console.error('Error deleting item', error);
          this.isLoading = false;
          this.showToast('Error deleting item: ' + ((error as any).customMessage || error.message || 'Unknown error'), 'danger');
          // Continue with the application even if delete fails

          // Force UI update by triggering change detection
          setTimeout(() => {
            this.isLoading = false;
          }, 0);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } catch (e) {
      console.error('Unexpected error in deleteItem', e);
      this.isLoading = false;
      this.showToast('Unexpected error deleting item. Please try again.', 'danger');
    }
  }

  /**
   * Edit item
   */
  editItem(item: T) {
    if (!this.isAdmin()) {
      this.showToast('You do not have permission to edit items', 'danger');
      return;
    }

    this.currentItem = item;
    this.isEditing = true;
    this.populateForm(item);
  }

  /**
   * Cancel editing
   */
  cancelEdit() {
    this.resetForm();
    this.isEditing = false;
    this.currentItem = null;
  }

  /**
   * Show toast message
   */
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: color === 'danger' ? 3000 : 2000, // Show error messages longer but not too long
      color,
      position: 'bottom', // Bottom position to not block the UI
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  /**
   * Build form
   * This method should be implemented by child classes
   */
  protected abstract buildForm(): FormGroup;

  /**
   * Populate form with item data
   * This method should be implemented by child classes
   */
  protected abstract populateForm(item: T): void;

  /**
   * Reset form
   */
  protected resetForm() {
    this.form.reset();
  }

  /**
   * Get item id
   * This method should be implemented by child classes
   */
  protected abstract getItemId(item: T): number | string;
}

// Common imports for admin components
export const COMMON_IMPORTS = [
  CommonModule,
  IonicModule,
  ReactiveFormsModule
];
