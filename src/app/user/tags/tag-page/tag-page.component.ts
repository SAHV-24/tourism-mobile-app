import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tag-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonText
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar color="primary">
        <ion-title>Create a Tag (Publication)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="intro-text">
        <ion-text color="primary">
          <h2>📍 Create a Tag</h2>
        </ion-text>
        <p>
          A <b>tag</b> is a publication where a user can register an encounter or sighting of a famous person, including location, photo, and a comment.
        </p>
      </div>
      <ion-item>
        <ion-label position="floating">Famous Person ID</ion-label>
        <ion-input type="text" placeholder="Enter famous person ID"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Latitude</ion-label>
        <ion-input type="number" placeholder="Enter latitude"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Longitude</ion-label>
        <ion-input type="number" placeholder="Enter longitude"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Photo URL</ion-label>
        <ion-input type="url" placeholder="Paste a photo URL"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Comment</ion-label>
        <ion-textarea placeholder="Write your comment..."></ion-textarea>
      </ion-item>
      <div class="ion-text-center" style="margin-top:2em;">
        <ion-button color="primary" expand="block">Create Tag</ion-button>
      </div>
      <div class="info-text ion-text-center" style="margin-top:2em;">
        <ion-text color="medium">
          <small>All fields are required. The tag will be associated with your user account automatically.</small>
        </ion-text>
      </div>
    </ion-content>
  `,
  styles: [
    `
      .intro-text {
        text-align: center;
        margin-bottom: 1.5em;
      }
      ion-item {
        margin-bottom: 12px;
        border-radius: 12px;
        box-shadow: 0 1px 6px rgba(0,0,0,0.04);
      }
      .info-text {
        margin-top: 2em;
      }
    `
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TagPageComponent { }
