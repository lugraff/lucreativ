import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseStringSplitter',
  standalone: true,
})
export class UppercaseStringSplitterPipe implements PipeTransform {
  transform(value: string, insertString: string): string {
    for (let index = 1; index < value.length; index++) {
      const char = value[index];
      if (char.valueOf().toUpperCase() === char.valueOf()) {
        value = value.slice(0, index) + insertString + value.slice(index);
        index += insertString.length;
      }
    }
    return value;
  }
}
