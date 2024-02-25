import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Buffer } from 'buffer';
import createImageAnalysisClient, { ImageAnalysisClient, ReadResultOutput, isUnexpected } from '@azure-rest/ai-vision-image-analysis';
import { AzureKeyCredential } from '@azure/core-auth';

@Injectable({
  providedIn: 'root',
})
export class AzureOcrService {
  private endpoint = 'https://bingocardocrservice.cognitiveservices.azure.com/';
  private key = '2b56092b3259491983f4521eb0d900c6';
  private credential;
  private client: ImageAnalysisClient;
  private features: string[] = [
    'Read'
  ];

  constructor(private http: HttpClient) {
    this.credential = new AzureKeyCredential(this.key);
    this.client = createImageAnalysisClient(this.endpoint, this.credential);
  }

  analyzeImage(image: Blob): Observable<ReadResultOutput> {
    return from(image.arrayBuffer()).pipe(
      switchMap(arrayBuffer => {
        const buffer = Buffer.from(arrayBuffer);
  
        return from(this.client.path('/imageanalysis:analyze').post({
          body: buffer,
          queryParameters: { features: this.features },
          contentType: 'application/octet-stream'
        }));
      }),
      map(result => {
        if (isUnexpected(result)) {
          throw new Error(result.body.error?.message || 'Unknown error');
        }
  
        if (!result.body.readResult) {
          throw new Error('No read result');
        }
  
        return result.body.readResult;
      }),
      catchError(error => {
        console.error('Error in analyzeImage:', error);
        return throwError(() => new Error('Error processing image'));
      })
    );
  }

}
