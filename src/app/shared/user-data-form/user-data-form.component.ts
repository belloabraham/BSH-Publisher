import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { isValidPhone } from 'src/helpers/utils/validators';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { countries } from 'src/data/countries';
import { diallingCodes } from 'src/data/dialling-code';
import { IPublisher } from 'src/data/models/entities/ipublisher';
import { ICountry } from 'src/data/models/icountry';
import { PubDataViewModel } from 'src/app/welcome/pub-data.viewmodels';
import { SubSink } from 'subsink';
import { escapeJSONNewlineChars } from 'src/helpers/utils/string-util';
import { payingCurrencies } from 'src/data/paying-currencies';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataFormComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  @Input()
  userDataForm!: UntypedFormGroup;

  @Input()
  action!: string;

  @Input()
  lastUpdated: any;

  @Input()
  registeredDate: any;

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  countries: ICountry[] = countries;
  payingCurrencies = payingCurrencies;

  diallingCodes: ICountry[] = diallingCodes;
  isInvalidPhoneNum = false;

  firstNameFC!: UntypedFormControl;
  lastNameFC!: UntypedFormControl;
  genderFC!: UntypedFormControl;
  phoneFC!: UntypedFormControl;
  paymentCurrencyFC!: UntypedFormControl;
  dialingCodeFC!: UntypedFormControl;
  countryFC!: UntypedFormControl;

  constructor(
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private pubDataViewModel: PubDataViewModel
  ) {}

  ngOnInit(): void {
    this.firstNameFC = this.userDataForm.get(
      'firstNameFC'
    ) as UntypedFormControl;
    this.lastNameFC = this.userDataForm.get('lastNameFC') as UntypedFormControl;
    this.countryFC = this.userDataForm.get('countryFC') as UntypedFormControl;
    this.dialingCodeFC = this.userDataForm.get(
      'dialingCodeFC'
    ) as UntypedFormControl;
    this.genderFC = this.userDataForm.get('genderFC') as UntypedFormControl;
    this.phoneFC = this.userDataForm.get('phoneFC') as UntypedFormControl;
    this.paymentCurrencyFC = this.userDataForm.get(
      'paymentCurrencyFC'
    ) as UntypedFormControl;

    this.subscriptions.sink = this.pubDataViewModel
      .getPublisher$()
      .subscribe((pubData) => {
        this.firstNameFC.patchValue(pubData.firstName);
        this.lastNameFC.patchValue(pubData.lastName);
        this.countryFC.patchValue(pubData.nationality);
        this.genderFC.patchValue(pubData.gender);
        this.phoneFC.patchValue(pubData.phoneNumber);
        this.dialingCodeFC.patchValue(pubData.dialingCode);
        this.paymentCurrencyFC.patchValue(pubData.payingCurrency);
      });
  }

  onDataUpdate(isSuccessful: boolean) {
    this.dataUpdatedEvent.emit(isSuccessful);
  }

  static getUserDataForm() {
    let validName = [Validators.required, Validators.minLength(2)];
    return new UntypedFormGroup({
      firstNameFC: new UntypedFormControl(undefined, validName),
      lastNameFC: new UntypedFormControl(undefined, validName),
      genderFC: new UntypedFormControl(undefined, [Validators.required]),
      phoneFC: new UntypedFormControl(undefined, [Validators.required]),
      countryFC: new UntypedFormControl(undefined, [Validators.required]),
      diallingCodes: new UntypedFormControl(undefined, [Validators.required]),
      paymentCurrencyFC: new UntypedFormControl(undefined, [
        Validators.required,
      ]),
    });
  }

  async submitFormData() {
    if (this.isValidPhoneNumber(this.phoneFC.value, this.dialingCodeFC.value)) {
      Shield.standard('.form');

      this.isInvalidPhoneNum = false;

      const email = this.userAuth.getEmail()!;
      const pubId = this.userAuth.getPubId()!;

      const publisher: IPublisher = {
        firstName: escapeJSONNewlineChars(this.firstNameFC.value),
        lastName: escapeJSONNewlineChars(this.lastNameFC.value),
        gender: this.genderFC.value,
        nationality: this.countryFC.value,
        phoneNumber: this.phoneFC.value,
        dialingCode: this.dialingCodeFC.value,
        email: email,
        registeredDate: this.registeredDate,
        lastUpdated: this.lastUpdated,
        sellingCurrency: 'NGN',
        payingCurrency: this.paymentCurrencyFC.value,
      };
      try {
        await this.userAuth.updateDisplayName(publisher.firstName);
        await this.pubDataViewModel.updatePublisher(
          { pubData: publisher },
          pubId
        );
        Shield.remove('.form');
        this.onDataUpdate(true);
      } catch (error: any) {
        Shield.remove('.form');
        Logger.error(this, this.submitFormData.name, error);
        this.onDataUpdate(false);
      }
    } else {
      this.isInvalidPhoneNum = true;
    }
  }

  private isValidPhoneNumber(phoneNumber: string, dialingCode:string) {
    const countryCode = this.countries.find((country) => {
      return country.callingCode === dialingCode;
    })?.code;
    return isValidPhone(phoneNumber, countryCode!, dialingCode);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
