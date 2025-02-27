import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import html2canvas from 'html2canvas';

interface Creature {
  name: string;
  type: string;
  attack: number;
  defense: number;
  speed: number;
  vitality: number;
  level: number;
  faction: string;
  element: string;
  feature: string;
  place: string;
}

interface CreatureData {
  creatureNames: { name: string; type: string; masculino: number, element: string }[];
  creatureAdjectives: { adjectiveMasc: string; adjectiveFem: string; type: string, element: string }[];
  creatureFeatures: { name: string; }[];
  places: { name: string; masculino: number }[];
  placesSub: { nameMasc: string, nameFem: string }[];
}

@Component({
  selector: 'app-creature-generator',
  templateUrl: './creature-generator.page.html',
  styleUrls: ['./creature-generator.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class CreatureGeneratorPage implements OnInit {

  creature: Creature | null = null;
  creatureNames: { name: string; type: string; masculino: number, element: string }[] = [];
  creatureAdjectives: { adjectiveMasc: string; adjectiveFem: string; type: string, element: string }[] = [];
  creatureFeatures : {name: string}[] = [];
  places: { name: string, masculino: number }[] = [];
  placesSub: { nameMasc: string, nameFem: string }[] = [];
  imageData: string | null = null;
  factions: string[] = ['Luz', 'Indiferente', 'Oscuridad', 'Interesado'];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadCreatureData();
  }

  loadCreatureData() {
    this.http.get<CreatureData>('assets/data/creatures.json').subscribe(
      data => {
        this.creatureNames = data.creatureNames;
        this.creatureAdjectives = data.creatureAdjectives;
        this.creatureFeatures = data.creatureFeatures;
        this.places = data.places;
        this.placesSub = data.placesSub;
      },
      error => {
        console.error("Error loading creature data", error);
      }
    );
  }

  generateCreature() {
    if (
      !this.creatureNames.length ||
      !this.creatureAdjectives.length ||
      !this.creatureFeatures.length ||
      !this.places.length ||
      !this.placesSub.length
    ) {
      console.error("Creature data not loaded yet!");
      return;
    }
    const nameObj = this.creatureNames[Math.floor(Math.random() * this.creatureNames.length)];
    const adjObj = this.creatureAdjectives[Math.floor(Math.random() * this.creatureAdjectives.length)];
    const featObj = this.creatureFeatures[Math.floor(Math.random() * this.creatureFeatures.length)];

    const adjective = (nameObj.masculino === 1) ? adjObj.adjectiveMasc : adjObj.adjectiveFem;

    const media = this.getRandomInt(0, 15);
    const attack = this.randomizeStat(media, 3);
    const defense = this.randomizeStat(media, 3);
    const speed = this.randomizeStat(media, 3);

    const minVitality = (attack + defense + speed) / 2;
    const vitality = this.getRandomInt(minVitality, minVitality + 50);

    const total = attack + defense + speed + vitality;
    
    let level: number;
    if (total < 35) {
      level = 1;
    } else if (total < 50) {
      level = 2;
    } else if (total < 65) {
      level = 3;
    } else if (total < 80) {
      level = 4;
    } else {
      level = 5;
    }

    const faction = this.factions[Math.floor(Math.random() * this.factions.length)];

    const nameElement = nameObj.element;
    const adjElement = adjObj.element;

    let creatureElement: string;
  if (nameElement === "None" && adjElement === "None") {
    creatureElement = "Ninguno";
  } else if (nameElement === "None") {
    creatureElement = adjElement;
  } else if (adjElement === "None") {
    creatureElement = nameElement;
  } else {
    if (nameElement === adjElement) {
      creatureElement = nameElement + " puro";
    } else {
      creatureElement = nameElement + "/" + adjElement;
    }
  }

    const placeObj = this.places[Math.floor(Math.random() * this.places.length)];
    const subPlaceObj = this.placesSub[Math.floor(Math.random() * this.placesSub.length)];

    const placeSub = (placeObj.masculino === 1) ? subPlaceObj.nameMasc : subPlaceObj.nameFem;
    const place = placeObj.name + " " + placeSub;

    const creatureName = `${nameObj.name} ${adjective}`;
    const creatureType = `${nameObj.type} ${adjObj.type}`;

    this.creature = {
      name: creatureName,
      type: creatureType,
      attack,
      defense,
      speed,
      vitality,
      level,
      faction,
      element: creatureElement,
      feature: featObj.name,
      place: place
    };
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomizeStat(media: number, limit: number): number {
    let addNumber = this.getRandomInt(-limit, limit)
    let result = media + (addNumber)
    if (result < 0) { result = 0 }
    if (result > 15) { result = 15 }
    return result
  }

  async generateImage() {
    const captureElement = document.getElementById('creature-details');
    if (captureElement) {
      try {
        // Capturamos el elemento en un canvas
        const canvas = await html2canvas(captureElement);
        // Obtenemos la imagen en formato dataURL
        const imageData = canvas.toDataURL('image/png');
        // Convertimos el dataURL a Blob
        const blob = this.dataURLtoBlob(imageData);
        // Creamos un File a partir del Blob
        const file = new File([blob], 'imagen.png', { type: 'image/png' });

        // Verifica si la Web Share API soporta compartir archivos
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Comparte la imagen',
            text: 'Aquí está la imagen generada',
          });
          console.log('Imagen compartida con éxito');
        } else {
          // Si no es compatible, puedes mostrar un mensaje o abrir la imagen en una nueva ventana
          console.log('Web Share API no soportada o no se pueden compartir archivos');
          window.open(imageData, '_blank');
        }
      } catch (error) {
        console.error('Error al generar la imagen:', error);
      }
    }
  }

  // Función auxiliar para convertir dataURL a Blob
  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}
