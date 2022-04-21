import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ConditionalValidator';

  // Changing the checkbox does not trigger form validation

  // Only the validator for the changing imput is re-ran so the conditional validator will not re-run when the checkbox changes.
  // Can prove this by putting a validation on the checkbox, can see form validation is changing but conditional validator is not being called.

  // do the other conditional validators in the same form in P2 work? probably shouldn't

  myForm: FormGroup = this.fb.group({
    theCheckBox: [false, [Validators.requiredTrue]],
    theInputNumber: [0, [this.ConditionalValidator(() => this.theCheckValue, [Validators.required, Validators.min(1)])]]
  });

  get theCheckValue() {return this.myForm.get('theCheckBox')?.value;};

  constructor(private fb: FormBuilder){}

  revalidate(){
    this.myForm.updateValueAndValidity();
  }

  ConditionalValidator(predicate: Function, validator: any) {
    return (formControl: AbstractControl) => {
         console.log('conditional validator');
        if (!formControl.parent) 
          return null;

        if (predicate(formControl)) {
            if (Array.isArray(validator)) 
              return Validators.compose(validator)!(formControl);
            return validator(formControl);

        }
        return null;
    };
  }

}

// Suspected Problem
// 1. Forms starts as valid
// 2. On checkbox input control is added
//      Need to run validation here, and recalculate form validity
// 3. Change detection runs and form is rendered
// 4. Form validity is re-calculated including new input control and is now invalid, this change in validity has occured after the form is rendered.

// This will cause a bigger problem when we are not using an *ngIf in the template
