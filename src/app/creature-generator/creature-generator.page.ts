import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Creature {
  name: string;
  type: string;
  attack: number;
  defense: number;
  speed: number;
  vitality: number;
  level: number;
}

interface CreatureData {
  creatureNames: { name: string; type: string; masculino: number }[];
  creatureAdjectives: { adjectiveMasc: string; adjectiveFem: string; type: string }[];
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
  creatureNames: { name: string; type: string; masculino: number }[] = [];
  creatureAdjectives: { adjectiveMasc: string; adjectiveFem: string; type: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCreatureData();
  }

  loadCreatureData() {
    this.http.get<CreatureData>('assets/data/creatures.json').subscribe(
      data => {
        this.creatureNames = data.creatureNames;
        this.creatureAdjectives = data.creatureAdjectives;
      },
      error => {
        console.error("Error loading creature data", error);
      }
    );
  }

  generateCreature() {
    if (!this.creatureNames.length || !this.creatureAdjectives.length) {
      console.error("Creature data not loaded yet!");
      return;
    }

    const nameObj = this.creatureNames[Math.floor(Math.random() * this.creatureNames.length)];
    const adjObj = this.creatureAdjectives[Math.floor(Math.random() * this.creatureAdjectives.length)];

    const adjective = (nameObj.masculino === 1) ? adjObj.adjectiveMasc : adjObj.adjectiveFem;

    const media = this.getRandomInt(0, 15);
    const attack = this.randomizeStat(media, 3);
    const defense = this.randomizeStat(media, 3);
    const speed = this.randomizeStat(media, 3);

    const minVitality = (attack + defense + speed)/2;
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

    const creatureName = `${nameObj.name} ${adjective}`;

    const creatureType = `${nameObj.type} ${adjObj.type}`;

    this.creature = {
      name: creatureName,
      type: creatureType,
      attack,
      defense,
      speed,
      vitality,
      level
    };
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomizeStat(media: number, limit: number): number {
    let addNumber = this.getRandomInt(-limit , limit)
    let result = media + (addNumber)
    if (result < 0) {result = 0} 
    if (result > 15) {result = 15}
    return result
  }
}
