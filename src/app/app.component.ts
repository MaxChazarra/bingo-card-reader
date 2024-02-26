import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AzureOcrService } from './services/azure-ocr.service';
import { ReadResultOutput } from '@azure-rest/ai-vision-image-analysis';
import { FormsModule } from '@angular/forms';
import { Bag } from './models/bag.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  DEFAULT_REGEX = "\\d\\d{3}([a-zA-Z]{2})?\\d{6}";
  selectedFileUrl: String | undefined;
  selectedFile: File | undefined;
  originalResult: ReadResultOutput | undefined;
  bags: Bag[] = []; 
  regexPattern = this.DEFAULT_REGEX;  // Default regex pattern

  constructor(private azureOcrService: AzureOcrService) {}

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  async upload() {
    if (this.selectedFile) {
      (await this.azureOcrService.analyzeImage(this.selectedFile)).subscribe((data) => {
        this.originalResult = data;
        this.bags = this.filterResultsByRegexAndCreateBags(data);
      });
    }
  }

  addBag(){
    this.bags.push(new Bag());
  }

  private filterResultsByRegexAndCreateBags(readResult: ReadResultOutput): Bag[] {
    const bags: Bag[] = [];

    // Get a BigString of result, cleaned
    const cleanedReadResultString = this.readResultToString(readResult).replace(/[\s\W_]+/g, '');

    // Step 3: Find all matches
    const regexPattern = new RegExp(this.regexPattern, 'g');
    const matches = cleanedReadResultString.match(regexPattern);

    if (matches) {
      // Step 4: Perform an action for each match
      matches.forEach(match => {
        const bag = new Bag();
        bag.tagNumber = match;
        bags.push(bag);

      });
    }
    
    return bags;
  }

  private readResultToString(readResult: ReadResultOutput): string {
    let readResultString: string = '';

    readResult.blocks.forEach(block => {
      block.lines.forEach(line => {
        readResultString += line.text;
      })
    });

    return readResultString;
  }

  private resetResult() {
    if(this.originalResult) this.bags = this.filterResultsByRegexAndCreateBags(this.originalResult);
  }

  resetRegex() {
    this.regexPattern = this.DEFAULT_REGEX;  // Default regex pattern
    this.resetResult();
  }

  onRegexChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.regexPattern = input.value;
    this.resetResult();
  }

  sendBags() {
    // const url = 'YOUR_SPECIFIC_URL_HERE'; // Replace with your specific URL
    // this.http.post(url, { bags: this.bags }, {
    //   headers: { 'Content-Type': 'application/json' },
    // })
    // .subscribe({
    //   next: (response) => console.log('Success:', response),
    //   error: (error) => console.error('Error:', error)
    // });
  }
}
