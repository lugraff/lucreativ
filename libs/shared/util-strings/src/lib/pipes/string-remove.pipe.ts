import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeString',
  standalone: true,
})
export class RemoveString implements PipeTransform {
  transform(value: string, searchString: string): string {
    const start = value.indexOf(searchString);
    value = value.substring(0, start);
    return value;
  }
}
