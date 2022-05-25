/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-len */
import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormError } from 'src/app/models/form-error.interface';
import { Game } from 'src/app/models/game.model';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent {
  @Output() submitGame: EventEmitter<Game> = new EventEmitter<Game>();
  dimensionMin = 2;
  dimensionMax = 10;
  matrixDimensionForm = new FormGroup({
    rowsCount: new FormControl(2, [
      Validators.required,
      Validators.min(this.dimensionMin),
      Validators.max(this.dimensionMax)
    ]),
    colsCount: new FormControl(2, [
      Validators.required,
      Validators.min(this.dimensionMin),
      Validators.max(this.dimensionMax)
    ])
  });

  gameForm = new FormGroup({
    gameTitle: new FormControl('Chick and dare', Validators.required),
    firstPlayerPayouts: new FormControl('4 1\n5 0', [
      Validators.required,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.matrixValidator(this.colsCount, this.rowsCount)
    ],),
    secondPlayerPayouts: new FormControl('4 5\n1 0', [
      Validators.required,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.matrixValidator(this.colsCount, this.rowsCount)
    ]),
  });

  get colsCount(): AbstractControl | null {
    return this.matrixDimensionForm.get('colsCount');
  }

  get rowsCount(): AbstractControl | null {
    return this.matrixDimensionForm.get('rowsCount');
  }

  errors: FormError = {
    gameTitle: {
      required: 'Tytuł gry jest wymagany.'
    },
    firstPlayerPayouts: {
      required: 'Należy podać wypłaty gracza.',
      matrix: 'Macierz ma nieprawidłowy rozmiar.'
    },
    secondPlayerPayouts: {
      required: 'Należy podać wypłaty gracza.',
      matrix: 'Macierz ma nieprawdiłowy rozmiar.'
    },
    rowsCount: {
      required: 'Należy podać liczbe strategii gracza.',
      min: `Liczba strategii musi być większa niż ${this.dimensionMin}.`,
      max: `Liczba strategii musi być mniejsza niż ${this.dimensionMax}.`
    },
    colsCount: {
      required: 'Należy podać liczbe strategii gracza.',
      min: `Liczba strategii musi być większa niż ${this.dimensionMin}.`,
      max: `Liczba strategii musi być mniejsza niż ${this.dimensionMax}.`
    }
  };

  getValidationMessageFor(controlName: string, form: FormGroup): string {
    const control = form.get(controlName);
    if (!control || !control.errors || !Object.prototype.hasOwnProperty.call(this.errors, controlName)) {
      return '';
    }

    const errors: string[] = [];
    for (let i = 0; i < Object.keys(control.errors).length; i++) {
      const element = Object.keys(control.errors)[i];
      if (Object.prototype.hasOwnProperty.call(control.errors, element)
        && Object.prototype.hasOwnProperty.call(this.errors[controlName], element)) {
        errors.push(this.errors[controlName][element]);
      }
    }

    return errors.join(', ');
  }

  // TODO: zabezpieczyć się przed wpisywaniem tekstu jakoś?
  // walidacja pod kątem nie alfanumerycznych znaków
  // TODO: Fix problem when i can submit two different matrixes (dimensions)
  matrixValidator(x: AbstractControl | null, y: AbstractControl | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && x?.value && y?.value) {
        const payouts: number[][] = this.getPayoutsFromString(control.value);
        let errorCounter = 0;
        for (let i = 0; i < y?.value; i++) {
          for (let j = 0; j < x?.value; j++) {
            if (!payouts[i] || payouts.length !== y.value || payouts[i].length !== x.value || Number.isNaN(payouts[i][j])) {
              errorCounter++;
            }
          }
        }

        return errorCounter > 0 ? { matrix: { value: control.value } } : null;
      }
      return null;
    };
  }

  onSubmit(): void {
    this.matrixDimensionForm.markAllAsTouched();
    if (this.matrixDimensionForm && this.gameForm.valid) {
      const firstPlayer: Player = {
        name: 'First player',
        payouts: this.getPayoutsFromString(this.gameForm.get('firstPlayerPayouts')?.value)
      };
      const secondPlayer: Player = {
        name: 'Second player',
        payouts: this.getPayoutsFromString(this.gameForm.get('secondPlayerPayouts')?.value)
      };
      const game: Game = {
        title: this.gameForm.get('gameTitle')?.value,
        firstPlayer,
        secondPlayer
      };
      this.submitGame.emit(game);
    } else {
      // TODO: Remove this?
      //this.validateAllFormsFields(this.matrixDimensionForm);
      //this.validateAllFormsFields(this.gameForm);
    }
  }

  getPayoutsFromString(playerPayouts: string): number[][] {
    const splittedPayouts: string[] = playerPayouts.trim().split('\n');

    if (splittedPayouts && splittedPayouts[0]) {
      const verticalDimension = splittedPayouts.length;
      const horizontalDimension = this.colsCount?.value ?? 0;
      const result: number[][] = GameFormComponent.intializeIntJaggedArray(verticalDimension);

      for (let i = 0; i < verticalDimension; i++) {
        const test = splittedPayouts[i].trim().split(' ');
        for (let j = 0; j < horizontalDimension; j++) {
          result[i][j] = parseInt(test[j], 10);
        }
      }

      return result;
    }

    return [];
  }

  static intializeIntJaggedArray(arraysCount: number): number[][] {
    const array: number[][] = [];
    for (let i = 0; i < arraysCount; i++) {
      array[i] = [];
    }

    return array;
  }

  validateAllFormsFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormsFields(control);
      }
    });
  }

  onClear() {
    this.matrixDimensionForm.reset();
    this.gameForm.reset();
  }
}
