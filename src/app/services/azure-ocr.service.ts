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
  private AZURE_AI_VISION_ENDPOINT = import.meta.env['NG_APP_AI_VISION_ENDPOINT'];
  private AZURE_AI_VISION_APIKEY = import.meta.env['NG_APP_AI_VISION_APIKEY'];
  private AZURE_AI_VISION_CLIENT: ImageAnalysisClient;
  private AZURE_AI_VISION_FEATURES: string[] = [
    'Read'
  ];

  constructor(private http: HttpClient) {
    this.AZURE_AI_VISION_CLIENT = createImageAnalysisClient(this.AZURE_AI_VISION_ENDPOINT, new AzureKeyCredential(this.AZURE_AI_VISION_APIKEY));
  }

  analyzeImage(image: Blob): Observable<ReadResultOutput> {
    return from(image.arrayBuffer()).pipe(
      switchMap(arrayBuffer => {
        const buffer = Buffer.from(arrayBuffer);
  
        return from(this.AZURE_AI_VISION_CLIENT.path('/imageanalysis:analyze').post({
          body: buffer,
          queryParameters: { features: this.AZURE_AI_VISION_FEATURES },
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
