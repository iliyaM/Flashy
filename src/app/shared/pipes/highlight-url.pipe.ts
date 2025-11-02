import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightUrl'
})
export class HighlightUrlPipe implements PipeTransform {

  transform(url: string): string {
    if (!url) return '';
    return url.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
}
