import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { isValidPhone } from 'src/helpers/utils/validators';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { countries } from 'src/domain/data/countries';
import { diallingCodes } from 'src/domain/data/dialling-code';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { Collection } from 'src/domain/remote-data-source/collection';
import { IPublisher } from 'src/domain/models/entities/ipublisher';
import { ICountry } from 'src/domain/models/icountry';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataFormComponent implements OnInit {
  @Input()
  userDataForm!: FormGroup;

  @Input()
  action!: string;

  @Input()
  lastUpdated: any;

  @Input()
  registeredDate: any;

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  countries: ICountry[] = countries;
  diallingCodes: ICountry[] = diallingCodes;
  dialingCodeByCountry? = countries[0].callingCode;
  isInvalidPhoneNum = false;

  firstNameFC!: FormControl;
  lastNameFC!: FormControl;
  genderFC!: FormControl;
  phoneFC!: FormControl;
  countryFC!: FormControl;

  constructor(
    @Inject(DATABASE_IJTOKEN) private database: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.firstNameFC = this.userDataForm.get('firstNameFC') as FormControl;
    this.lastNameFC = this.userDataForm.get('lastNameFC') as FormControl;
    this.countryFC = this.userDataForm.get('countryFC') as FormControl;
    this.genderFC = this.userDataForm.get('genderFC') as FormControl;
    this.phoneFC = this.userDataForm.get('phoneFC') as FormControl;
  }

  onDataUpdate(isSuccessful: boolean) {
    this.dataUpdatedEvent.emit(isSuccessful);
  }

  static getUserDataForm() {
    let validName = [Validators.required, Validators.minLength(2)];
    return new FormGroup({
      firstNameFC: new FormControl(undefined, validName),
      lastNameFC: new FormControl(undefined, validName),
      genderFC: new FormControl(undefined, [Validators.required]),
      phoneFC: new FormControl(undefined, [Validators.required]),
      countryFC: new FormControl(undefined, [Validators.required]),
    });
  }

  async submitFormData() {
    if (this.isValidPhoneNumber(this.phoneFC.value)) {
      Shield.standard('.form');

      this.isInvalidPhoneNum = false;

      let userId = this.userAuth.getPubId()!;
      let email = this.userAuth.getEmail()!;

      let user: IPublisher = {
        firstName: this.firstNameFC.value,
        lastName: this.lastNameFC.value,
        gender: this.genderFC.value,
        nationality: this.countryFC.value,
        phoneNumber: this.phoneFC.value,
        email: email,
        registeredDate: this.registeredDate,
        lastUpdated: this.lastUpdated,
      };
      try {
        await this.database.addDocData<IPublisher>(
          Collection.publishers,
          [userId],
          user
        );

        Shield.remove('.form');

        this.onDataUpdate(true);
      } catch (error: any) {
        Shield.remove('.form');
        Logger.error(this, 'submitFormData', error);
        this.onDataUpdate(false);
      }
    } else {
      this.isInvalidPhoneNum = true;
    }
  }

  onCountrySelectChanged(event: any) {
    let value = event.target.value;
    this.dialingCodeByCountry = this.countries.find((country) => {
      return country.name === value;
    })?.callingCode;
  }

  onDiallinCodeSelectedChanged(event: any) {
    this.dialingCodeByCountry = event.target.value;
  }

  private isValidPhoneNumber(phoneNumber: string) {
    let countryCode = this.countries.find((country) => {
      return country.callingCode === this.dialingCodeByCountry;
    })?.code;
    return isValidPhone(phoneNumber, countryCode!, this.dialingCodeByCountry!);
  }
}
