import { Component, OnInit, ViewChild } from "@angular/core";
import { DeletePageComponent } from "src/app/component/delete-page/delete-page.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UnblockPopupComponent } from "../../../component/unblock-popup/unblock-popup.component";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { UtilService } from "../../../core/service/util/util.service";
import { HomesCommercialsService } from "../../../core/service/homes-commercials/homes-commercials.service";
import { EyeProsPagesService } from "../../../core/service/eye-pros-pages/eye-pros-pages.service";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { MouseEvent } from "@agm/core";
import { map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { apiInfo } from "../../../../environments/environment";
import { environment } from "../../../../environments/environment";
import { AmazingTimePickerService } from "amazing-time-picker";
import { Router } from "@angular/router";
import * as $ from "jquery";
import { PhotosService } from "src/app/core/service/photos/photos.service";
import { AddAddressComponent } from "src/app/pages/eyerne-profile/add-address/add-address.component";
import { AddSocialLinkComponent } from "src/app/pages/eyerne-profile/add-social-link/add-social-link.component";
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO
} from "ngx-intl-tel-input";

declare const google: any;
const hostname = environment.baseUrl;
const EyeProsPages = apiInfo.info.eyeProsPages;

@Component({
  selector: "app-pros-page-setting",
  templateUrl: "./pros-page-setting.component.html",
  styleUrls: ["./pros-page-setting.component.scss"]
})
export class ProsPageSettingComponent implements OnInit {
  backgroundColor: any = "#15d11b";
  modalReference: any;
  attachFileArr: any = [];
  addWithWhich: any = "";
  WebUrl: any = apiInfo.casInfo.service;
  updateSettingsForm: FormGroup;
  logoImg: any;
  selectedLogoFile: any;
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @ViewChild("addressRefID") addressRefID: GooglePlaceDirective;
  zoom = 6;
  logoImgMediaId: any;
  parkingTypes: any = [
    {
      display: "Street Parking",
      value: "STREET",
      checked: false
    },
    {
      display: "Parking Lot",
      value: "PARKING_LOT",
      checked: false
    },
    {
      display: "Valet",
      value: "VALLET",
      checked: false
    }
  ];
  crossPostingOptions: any = [
    {
      display: "VIDEO",
      value: "VIDEO",
      checked: false
    },
    {
      display: "VR",
      value: "VR",
      checked: false
    },
    {
      display: "360",
      value: "360",
      checked: false
    }
  ];
  openHoursArr: any = [
    {
      name: "Open on selected hours",
      value: "SELECT_HOURS"
    },
    {
      name: "Always open",
      value: "ALWAYS_OPEN"
    },
    {
      name: "No hours available",
      value: "NO_HOURS"
    },
    {
      name: "Permanently closed",
      value: "PERMANENTLY_CLOSED"
    }
  ];
  openHoursDayWiseArr: any = [
    {
      name: "Monday",
      value: "MONDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    },
    {
      name: "Tuesday",
      value: "TUESDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    },
    {
      name: "Wednesday",
      value: "WEDNESDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    },
    {
      name: "Thursday",
      value: "THURSDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    },
    {
      name: "Friday",
      value: "FRIDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    },
    {
      name: "Saturday",
      value: "SATURDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    },
    {
      name: "Sunday",
      value: "SUNDAY",
      checked: false,
      start: "00:00",
      end: "00:00"
    }
  ];
  negativeWords: any = [];
  ageArr: any = [];
  notificationSettingsArr: any = [
    {
      name: "New note",
      value: "NEW_NOTE",
      checked: true
    },
    {
      name: "Response to notes written by user",
      value: "RESPONSE_NOTE",
      checked: true
    },
    {
      name: "New members",
      value: "NEW_MEMBERS",
      checked: true
    },
    {
      name: "On fleek on user’s note",
      value: "ON_FLEEK_STICKIE",
      checked: true
    },
    {
      name: "On Fleek",
      value: "ON_FLEEK",
      checked: true
    },
    {
      name: "Shared stickie or note",
      value: "NEW_SHARES",
      checked: true
    }
  ];
  userPermissionsArr: any = [
    {
      name: "Add notes",
      value: "NOTES",
      checked: false
    },
    {
      name: "Photos",
      value: "PHOTO",
      checked: false
    },
    {
      name: "Videos",
      value: "VIDEOS",
      checked: false
    },
    {
      name: "Stickies",
      value: "STICKIE",
      checked: false
    },
    {
      name: "Adverts",
      value: "ADVERTS",
      checked: false
    }
  ];
  allActionButtonsArr: any = [
    {
      name: "Rent",
      value: "RENT",
      checked: false
    },
    {
      name: "Buy",
      value: "BUY",
      checked: false
    },
    {
      name: "Sell",
      value: "SELL",
      checked: false
    },
    {
      name: "Subscribe",
      value: "SUBSCRIBE",
      checked: false
    },
    {
      name: "Shop Now",
      value: "SHOP_NOW",
      checked: false
    },
    {
      name: "See Offers",
      value: "SEE_OFFERS",
      checked: false
    },
    {
      name: "Learn More",
      value: "LEARN_MORE",
      checked: false
    },
    {
      name: "Join",
      value: "JOIN",
      checked: false
    },
    {
      name: "Contact Us",
      value: "CONTACT_US",
      checked: false
    },
    {
      name: "Send Message",
      value: "SEND_MESSAGE",
      checked: false
    },
    {
      name: "Call Now",
      value: "CALL_NOW",
      checked: false
    },
    {
      name: "Sign Up",
      value: "SIGN_UP",
      checked: false
    },
    {
      name: "Book Now",
      value: "BOOK_NOW",
      checked: false
    }
  ];
  userData: any = {};
  prosPageId: any;
  settingsData: any = {};
  allCountryListData: any = [];
  memberListData: any = [];
  crossPageListData: any = [];
  isTypeApiRun = false;
  ifTypeExist = false;
  isKeywordApiRun = false;
  ifKeywordExist = false;
  isCountryApiRun = false;
  ifCountryExist = false;
  isCrossPostingApiRun = false;
  ifCrossPostingExist = false;
  regionCode: any = "";
  countryCode: any = "";
  userProfileData: any = {};
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  requestAutocompleteItemsForTypesData: any = [];

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private eyeProsPagesService: EyeProsPagesService,
    private http: HttpClient,
    private atp: AmazingTimePickerService,
    private router: Router,
    private homescommercialsService: HomesCommercialsService,
    private photosService: PhotosService
  ) {}

  ngOnInit() {
    this.ageArr = this.madeAgeListArr(13, 65);
    this.userData = this.utilService.getLocalStorageData("user_data");
    if (this.utilService.getLocalStorageData("selected_pros_page_data")) {
      let prosPageData = this.utilService.getLocalStorageData(
        "selected_pros_page_data"
      );
      this.prosPageId = prosPageData.pageId;
    }
    this.getProsPagesSettings();
    this.getAllCountryListData();
    this.getMembersListData();
    this.getProsPageCategorySearch("");

    if (this.utilService.getLocalStorageData("selected_pros_page_data")) {
      let prosPageInfo = this.utilService.getLocalStorageData(
        "selected_pros_page_data"
      );
      if (prosPageInfo.hasOwnProperty("addWithWhich")) {
        this.addWithWhich = prosPageInfo["addWithWhich"];
      }
    }

    $(".select-list .form-control").click(function() {
      $(".share-post-list").toggleClass("hide");
    });
  }

  public ngOnDestroy(): void {
    localStorage.removeItem('selectedProsPageType');
  }

  /**
   * For make age selection list
   * @param start
   * @param end
   */
  madeAgeListArr(start, end) {
    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }

  DeleteProsPage() {
    this.modalReference = this.modalService.open(DeletePageComponent, {
      windowClass: "popup-wrapper share-post-modal create-album-popup",
      size: "lg"
    });
    this.modalReference.componentInstance.title = "Delete";
    this.modalReference.componentInstance.message =
      "Are you sure want to delete this pro's page?";
    this.modalReference.result.then(
      (result: any) => {
        console.log("Closed with:", result);
        if (result === "delete") {
          let getObj = {
            userId: this.userData["userProfileId"],
            pageId: this.prosPageId
          };
          this.eyeProsPagesService
            .deleteProsPage(getObj)
            .then(res => {
              if (res["success"]) {
                this.utilService.deleteProsPage();
                this.utilService.successHandler(res["message"]);
                this.router.navigate(["/pros-page/pros-pages"]);
              } else {
                this.utilService.errorHandler(res);
              }
            })
            .catch(err => {
              if (err.hasOwnProperty("error")) {
                this.utilService.errorHandler(err.error);
              } else {
                this.utilService.errorHandler("");
              }
            });
        }
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  blockUser() {
    this.modalReference = this.modalService.open(DeletePageComponent, {
      windowClass: "popup-wrapper share-post-modal create-album-popup",
      size: "lg"
    });
    this.modalReference.result.then(
      (result: any) => {
        console.log("Closed with:", result);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  unblockUser() {
    this.modalReference = this.modalService.open(UnblockPopupComponent, {
      windowClass: "popup-wrapper add-website-modal add-place-modal",
      size: "lg"
    });
    this.modalReference.result.then(
      (result: any) => {
        console.log("Closed with:", result);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }

  /**
   * Create settings form
   */
  createForm(formData) {
    if (formData["pageTypes"] === null) {
      formData['pageTypes'] = [];
      const pageTypes = this.utilService.getLocalStorageData('selectedProsPageType');
      if (pageTypes !== null && pageTypes !== "" && pageTypes !== undefined) {
        formData['pageTypes'].push(pageTypes.name);
      }
    }
    this.updateSettingsForm = this.formBuilder.group({
      name: [formData["name"] ? formData["name"] : "", [Validators.required]],
      email: [
        formData["email"] ? formData["email"] : "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailPattern)
        ])
      ],
      phone: [formData["phone"] ? formData["phone"] : null, [Validators.required]],
      pageTypes: [
        formData["pageTypes"]
          ? this.convertFromArrToArrOfObj(
              formData["pageTypes"],
              "display",
              "value"
            )
          : []
      ],
      description: [formData["description"] ? formData["description"] : ""],
      fullAddress: [formData["fullAddress"], [Validators.required]],
      street: [formData["street"], [Validators.required]],
      city: [formData["city"], [Validators.required]],
      state: [formData["state"], [Validators.required]],
      country: [formData["country"], [Validators.required]],
      zipCode: [formData["zipCode"]],
      locationLat: [
        formData["locationLat"] ? formData["locationLat"] : 40.73061
      ],
      locationLon: [
        formData["locationLon"] ? formData["locationLon"] : -73.935242
      ],
      insideLocation: [
        formData["insideLocation"] ? formData["insideLocation"] : false
      ],
      insideLocationDetails: [formData["insideLocationDetails"]],
      publicTransitDetails: [formData["publicTransitDetails"]],
      openHours: [
        formData["openHours"] ? formData["openHours"] : "SELECT_HOURS"
      ],
      openHoursDayWise: new FormArray([]),
      keywords: [
        formData["keywords"]
          ? this.convertFromArrToArrOfObj(
              formData["keywords"],
              "display",
              "value"
            )
          : []
      ],
      impressum: [formData["impressum"] ? formData["impressum"] : ""],
      websiteUrl: [formData["websiteUrl"] ? formData["websiteUrl"] : ""],
      // pagePrivacy: [
      //   formData["pagePrivacy"] ? formData["pagePrivacy"] : "PUBLIC"
      // ],
      membershipApproval: [
        formData["membershipApproval"]
          ? formData["membershipApproval"]
          : "ANYONE"
      ],
      postingPermission: [
        formData["postingPermission"] ? formData["postingPermission"] : "ANYONE"
      ],
      pageVisibility: [
        formData["pageVisibility"] ? formData["pageVisibility"] : "PUBLISHED"
      ],
      disableUsers: [
        formData["disableUsers"]
          ? this.setArrayofValueForDisableAndBlockUser(
              formData["disableUsers"],
              this.memberListData
            )
          : []
      ],
      allowSharing: [
        formData["allowSharing"] ? formData["allowSharing"] : false
      ],
      allowTagging: [
        formData["allowTagging"] ? formData["allowTagging"] : false
      ],
      restrictionCountries: [
        formData["restrictionCountries"]
          ? this.convertFromArrToArrOfObj(
              formData["restrictionCountries"],
              "display",
              "value"
            )
          : []
      ],
      restrictionCriteria: [
        formData["restrictionCriteria"]
          ? formData["restrictionCriteria"]
          : "NONE"
      ],
      ageCriteria: [formData["ageCriteria"] ? formData["ageCriteria"] : "13"],
      negativeWordsText: [""],
      profanityFilter: [
        formData["profanityFilter"] ? formData["profanityFilter"] : "MODERATE"
      ],
      enableSimilarPages: [
        formData["enableSimilarPages"] ? formData["enableSimilarPages"] : false
      ],
      autoStickieUpdate: [
        formData["autoStickieUpdate"] ? formData["autoStickieUpdate"] : false
      ],
      allowAutoTranslate: [
        formData["allowAutoTranslate"] ? formData["allowAutoTranslate"] : false
      ],
      allowMultipleLanguages: [
        formData["allowMultipleLanguages"]
          ? formData["allowMultipleLanguages"]
          : false
      ],
      stickieRanking: [
        formData["stickieRanking"] ? formData["stickieRanking"] : "MOST_RECENT"
      ],
      allowContentDistribution: [
        formData["allowContentDistribution"] ? "true" : "false"
      ],
      stickiesPublishing: [
        formData["stickiesPublishing"]
          ? formData["stickiesPublishing"]
          : "AS_ME"
      ],
      notificationMedium: [
        formData["notificationMedium"] ? formData["notificationMedium"] : "PAGE"
      ],
      eyeChatSwitchAccount: [
        formData["eyeChatSwitchAccount"]
          ? formData["eyeChatSwitchAccount"]
          : "PAGE"
      ],
      eyeChatAutoReplyMsg: [formData["eyeChatAutoReplyMsg"]],
      blockUsers: [
        formData["blockUsers"]
          ? formData["blockUserData"].map(x => {
              return {
                display: x.firstName + ' ' + x.lastName,
                value: x.userId
              };
            })
          : []
      ],
      crossPostingPageIds: [
        formData["crossPostingSelected"]
          ? formData["crossPostingSelected"].map(x => {
              return {
                display: x.pageName,
                value: x.pageId
              };
            })
          : []
      ]
    });

    if (
      formData["openHours"] === "SELECT_HOURS" &&
      formData["openHoursDayWise"] &&
      Object.keys(formData["openHoursDayWise"]).length > 0
    ) {
      this.convertFromObjToArrForOpenHours(formData["openHoursDayWise"]);
    } else {
      this.patchOpenHoursDayWiseArr(this.openHoursDayWiseArr);
    }

    if (formData["negativeWords"] && formData["negativeWords"].length > 0) {
      this.negativeWords = formData["negativeWords"];
    }

    if (
      formData["notifications"] &&
      Object.keys(formData["notifications"]).length > 0
    ) {
      this.notificationSettingsArr = this.convertFromObjToArr(
        formData["notifications"],
        this.notificationSettingsArr
      );
    }

    if (
      formData["userPermissions"] &&
      Object.keys(formData["userPermissions"]).length > 0
    ) {
      this.userPermissionsArr = this.convertFromObjToArr(
        formData["userPermissions"],
        this.userPermissionsArr
      );
    }

    if (formData["parkingList"] && formData["parkingList"].length > 0) {
      this.parkingTypes = this.assignDefualtValueInArr(
        formData["parkingList"],
        this.parkingTypes
      );
    }

    if (
      formData["crossPostingOptions"] &&
      formData["crossPostingOptions"].length > 0
    ) {
      this.crossPostingOptions = this.assignDefualtValueInArr(
        formData["crossPostingOptions"],
        this.crossPostingOptions
      );
    }

    if (
      formData["actionButtonsAdded"] &&
      formData["actionButtonsAdded"].length > 0
    ) {
      this.allActionButtonsArr = this.assignDefualtValueInArr(
        formData["actionButtonsAdded"],
        this.allActionButtonsArr
      );
    }

    this.attachFileArr = [];

    if (
      formData["authorizationFileUrls"] &&
      formData["authorizationFileUrls"].length > 0
    ) {
      for (const x in Object.keys(formData["authorizationFileUrls"])) {
        let url = atob(formData["authorizationFileUrls"][x]["mediaUrl"]);
        this.attachFileArr.push({
          name: url.split("/").pop(),
          file: url,
          mediaId: formData["authorizationFileUrls"][x]["mediaId"]
        });
      }
    }
  }

  /**For get form feilds
   *
   */
  get f() {
    return this.updateSettingsForm.controls;
  }

  /**
   * For push all defualt array data
   */
  patchOpenHoursDayWiseArr(openHoursDayWiseArr) {
    const control = this.updateSettingsForm.get(
      "openHoursDayWise"
    ) as FormArray;
    openHoursDayWiseArr.forEach(x => {
      control.push(
        this.patchOpenHoursDayWiseArrValues(
          x.name,
          x.value,
          x.checked,
          x.start,
          x.end
        )
      );
    });
  }

  /**
   * For join array of object data in formControl
   * @param name
   * @param value
   * @param checked
   * @param start
   * @param end
   */
  patchOpenHoursDayWiseArrValues(name, value, checked, start, end) {
    return this.formBuilder.group({
      name: [name],
      value: [value],
      checked: [checked],
      start: [start],
      end: [end]
    });
  }

  /**
   * For add negative word
   */
  addNegativeWords(event: any) {
    if (this.negativeWords.indexOf(event.target.value) === -1) {
      this.negativeWords.push(event.target.value);
      this.updateSettingsForm.get("negativeWordsText").setValue("");
    }
  }

  /**
   * For remove negative word
   */
  deleteNegativeWords(idx: number) {
    this.negativeWords.splice(idx, 1);
  }

  /**
   * For save form inside changes
   * @param fromWhere
   */
  saveInsideForm(fromWhere,postData?:any) {
    const getObj = {
      userId: this.userData["userProfileId"],
      setting: fromWhere
    };
    let postObj = {};
    const formData = this.updateSettingsForm.value;
    if (fromWhere === "address") {
      postObj = {
        pageId: this.prosPageId,
        locationLat: formData["locationLat"],
        locationLon: formData["locationLon"],
        fullAddress: formData["fullAddress"],
        regionCode: this.regionCode,
        countryCode: this.countryCode,
        email: formData["email"],
        street: formData["street"],
        city: formData["city"],
        state: formData["state"],
        country: formData["country"],
        zipCode: formData["zipCode"]
      };
    } else if (fromWhere === "type") {
      postObj = {
        pageId: this.prosPageId,
        pageTypes: this.convertFormObjToArr(formData["pageTypes"], "display"),
        name: formData["name"],
        email: formData["email"]
      };
    } else if (fromWhere === "hours") {
      postObj = {
        pageId: this.prosPageId,
        openHours: formData["openHours"],
        openHoursDayWise: null,
        email: formData["email"]
      };
      if (formData["openHours"] === "SELECT_HOURS") {
        postObj["openHoursDayWise"] = this.convertFromArrToObjForOpenHours(
          formData["openHoursDayWise"],
          "value",
          "start",
          "end",
          "checked"
        );
      }
    } else if (fromWhere === "keywords") {
      postObj = {
        pageId: this.prosPageId,
        keywords: this.convertFormObjToArr(formData["keywords"], "display"),
        email: formData["email"]
      };
    } else if (fromWhere === "block-words") {
      postObj = {
        pageId: this.prosPageId,
        negativeWords: this.negativeWords,
        email: formData["email"]
      };
    } else if (fromWhere === "operational-addresses") {
      postObj = {
        pageId: this.prosPageId,
        addresses: postData,
        email: formData["email"]
      };
    } else if (fromWhere === 'policy') {
      postObj = {
        pageId: this.prosPageId,
        policyUrls: postData,
        email: formData["email"]
      };
    } else if (fromWhere === "blockUsers") {
      postObj = {
        pageId: this.prosPageId,
        blockUsers: this.convertFormObjToArr(formData["blockUsers"],"value"),
        email: formData["email"]
      };
    }
    this.updateIndividualProsPageSettings(postObj, getObj, fromWhere);
  }

  /**
   * For cancel button click
   * @param fromWhere
   */
  cancelInsideForm(fromWhere: string) {
    if (fromWhere === "type") {
      this.updateSettingsForm.get("pageTypes").setValue([]);
    } else if (fromWhere === "address") {
      this.updateSettingsForm.get("fullAddress").setValue(null);
      this.updateSettingsForm.get("street").setValue(null);
      this.updateSettingsForm.get("city").setValue(null);
      this.updateSettingsForm.get("state").setValue(null);
      this.updateSettingsForm.get("country").setValue(null);
      this.updateSettingsForm.get("zipCode").setValue(null);
      this.updateSettingsForm.get("locationLat").setValue(40.73061);
      this.updateSettingsForm.get("locationLon").setValue(-73.935242);

      setTimeout(() => {
        this.updateSettingsForm.get("fullAddress").markAsTouched();
        this.updateSettingsForm.get("street").markAsTouched();
        this.updateSettingsForm.get("city").markAsTouched();
        this.updateSettingsForm.get("state").markAsTouched();
        this.updateSettingsForm.get("country").markAsTouched();
      }, 500);
    } else if (fromWhere === "hours") {
      this.updateSettingsForm.setControl("openHoursDayWise", new FormArray([]));
      this.patchOpenHoursDayWiseArr(this.openHoursDayWiseArr);
    } else if (fromWhere === "keywords") {
      this.updateSettingsForm.get("keywords").setValue([]);
    } else if (fromWhere === "block-words") {
      this.negativeWords = [];
      this.updateSettingsForm.get("negativeWordsText").setValue("");
    } else if (fromWhere === "blockUsers") {
      this.updateSettingsForm.get("blockUsers").setValue([]);
    }
  }


  /**
   * Handle change google place api address
   * @param address
   */
  handleAddressChange(address: Address) {
    const locationObj = {};
    for (const i in address.address_components) {
      if (address.address_components[i]) {
        const item = address.address_components[i];
        locationObj["formatted_address"] = address.formatted_address;
        if (item["types"].indexOf("locality") > -1) {
          locationObj["locality"] = item["long_name"];
        } else if (item["types"].indexOf("administrative_area_level_1") > -1) {
          locationObj["admin_area_l1"] = item["long_name"];
          this.regionCode = item["short_name"];
        } else if (item["types"].indexOf("street_number") > -1) {
          locationObj["street_number"] = item["short_name"];
        } else if (item["types"].indexOf("route") > -1) {
          locationObj["route"] = item["long_name"];
        } else if (item["types"].indexOf("country") > -1) {
          locationObj["country"] = item["long_name"];
          this.countryCode = item["short_name"];
        } else if (item["types"].indexOf("postal_code") > -1) {
          locationObj["postal_code"] = item["short_name"];
        }
      }
    }
    if (typeof locationObj["formatted_address"] !== "undefined") {
      this.updateSettingsForm.controls.fullAddress.setValue(
        locationObj["formatted_address"] || ""
      );
    } else {
      this.updateSettingsForm.controls.fullAddress.reset();
    }
    if (typeof locationObj["route"] !== "undefined") {
      this.updateSettingsForm.controls.street.setValue(
        locationObj["route"] || ""
      );
    } else {
      this.updateSettingsForm.controls.street.reset();
    }
    if (typeof locationObj["locality"] !== "undefined") {
      this.updateSettingsForm.controls.city.setValue(
        locationObj["locality"] || ""
      );
    } else {
      this.updateSettingsForm.controls.city.reset();
    }
    if (typeof locationObj["admin_area_l1"] !== "undefined") {
      this.updateSettingsForm.controls.state.setValue(
        locationObj["admin_area_l1"] || ""
      );
    } else {
      this.updateSettingsForm.controls.state.reset();
    }
    if (typeof locationObj["country"] !== "undefined") {
      this.updateSettingsForm.controls.country.setValue(
        locationObj["country"] || ""
      );
    } else {
      this.updateSettingsForm.controls.country.reset();
    }
    if (typeof locationObj["postal_code"] !== "undefined") {
      this.updateSettingsForm.controls.zipCode.setValue(
        locationObj["postal_code"] || ""
      );
    } else {
      this.updateSettingsForm.controls.zipCode.reset();
    }
    if (typeof address.geometry.location.lat() !== "undefined") {
      this.updateSettingsForm.controls.locationLat.setValue(
        address.geometry.location.lat() || 0
      );
    } else {
      this.updateSettingsForm.controls.locationLat.reset();
    }
    if (typeof address.geometry.location.lng() !== "undefined") {
      this.updateSettingsForm.controls.locationLon.setValue(
        address.geometry.location.lng() || 0
      );
    } else {
      this.updateSettingsForm.controls.locationLon.reset();
    }
  }

  /**
   * marker drag end event
   */
  markerDragEnd($event: MouseEvent) {
    this.getAddress($event.coords.lat, $event.coords.lng);
  }

  /**
   * get address based on lat long
   */
  getAddress(latitude, longitude) {
    if (navigator.geolocation) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(latitude, longitude);
      const request = { latLng: latlng };
      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          if (result !== null) {
            this.handleAddressChange(result);
          }
        }
      });
    }
  }

  /**
   * For get auto complete list data for page types
   */
  public requestAutocompleteItemsForTypes = (text: string): Observable<any> => {
    setTimeout(() => {
      this.isTypeApiRun = true;
    }, 500);
    const url = hostname + EyeProsPages.categorySearch + `?param=${text}`;
    const tokenType = this.utilService.getLocalStorageData("token_type");
    return this.http
      .get<any>(url, {
        headers: new HttpHeaders({
          Authorization: `${tokenType} ${this.utilService.getToken()}`
        })
      })
      .pipe(
        map(items =>
          items.data.map((item1: any) => {
            const item = { display: item1.name, value: item1.name };
            this.ifTypeExist = true;
            return item;
          })
        )
      );
  };

  /**
   * check the enter char for type (settings for show no data found div)
   * @param event: any
   */
  checkEnterCharForType(event: any) {
    this.isTypeApiRun = false;
    this.ifTypeExist = false;
    console.log('this.pageTypes', this.updateSettingsForm.value);
  }

  /**
   * check the enter char for cross posting (settings for show no data found div)
   * @param event: any
   */
  checkEnterCharForCrossPosting(event: any) {
    this.isCrossPostingApiRun = false;
    this.ifCrossPostingExist = false;
  }

  /**
   * For get auto complete list data for page keywords search
   */
  public requestAutocompleteItemsForKeywords = (
    text: string
  ): Observable<any> => {
    setTimeout(() => {
      this.isKeywordApiRun = true;
    }, 500);
    const url = hostname + EyeProsPages.keywordSearch + `?param=${text}`;
    const tokenType = this.utilService.getLocalStorageData("token_type");
    return this.http
      .get<any>(url, {
        headers: new HttpHeaders({
          Authorization: `${tokenType} ${this.utilService.getToken()}`
        })
      })
      .pipe(
        map(items =>
          items.data.map((item1: any) => {
            this.ifKeywordExist = true;
            return item1;
          })
        )
      );
  };

  /**
   * For get auto complete list data for page cross posting search
   */
  public requestAutocompleteItemsForCrossPosting = (
    text: string
  ): Observable<any> => {
    setTimeout(() => {
      this.isCrossPostingApiRun = true;
    }, 500);
    const url =
      hostname +
      EyeProsPages.searchProsPage +
      `?pageName=${text}&userId=${this.userData["userProfileId"]}`;
    const tokenType = this.utilService.getLocalStorageData("token_type");
    return this.http
      .get<any>(url, {
        headers: new HttpHeaders({
          Authorization: `${tokenType} ${this.utilService.getToken()}`
        })
      })
      .pipe(
        map(items =>
          Object.keys(items.data).map((item1: any) => {
            const item = { display: items.data[item1], value: item1 };
            this.ifCrossPostingExist = true;
            return item;
          })
        )
      );
  };

  /**
   * check the enter char for keyword (settings for show no data found div)
   * @param event: any
   */
  checkEnterCharForKeyword(event: any) {
    this.isKeywordApiRun = false;
    this.ifKeywordExist = false;
  }

  /**
   * For get auto complete list data for countries search
   */
  public requestAutocompleteItemsForCountries = (
    text: string
  ): Observable<string[]> => {
    return of(this.allCountryListData);
  };

  /**
   * check the enter char for country (settings for show no data found div)
   * @param event: any
   */
  checkEnterCharForCountry(event: any) {
    this.isCountryApiRun = false;
    this.ifCountryExist = false;
  }

  /**
   * On change inside location feild
   * @param checked
   */
  onChangeInsideLocation(checked) {
    if (!checked) {
      this.updateSettingsForm.get("insideLocationDetails").reset();
    }
  }

  /**
   * For no space event
   * @param event
   */
  onSpaceEvent(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }

  /**
   * For change notification settings
   * @param index ]
   * @param checked
   */
  onChangeNotificationSettings(index: number, checked: boolean) {
    this.notificationSettingsArr[index]["checked"] = checked;
  }

  /**
   * For change user permissions
   * @param index
   * @param checked
   */
  onChangeUserPermissions(index: number, checked: boolean) {
    this.userPermissionsArr[index]["checked"] = checked;
  }

  /**
   * For change actions buttons
   * @param index
   * @param checked
   */
  onChangeActionButtons(index: number, checked: boolean) {
    this.allActionButtonsArr[index]["checked"] = checked;
  }

  /**
   * On change paring types
   * @param index
   * @param checked
   */
  onSelectParkingType(index, checked) {
    this.parkingTypes[index]["checked"] = checked;
  }

  /**
   * On change paring types
   * @param index
   * @param checked
   */
  onSelectCrossPostionType(index, checked) {
    this.crossPostingOptions[index]["checked"] = checked;
  }

  /**
   * For get pros page settings data
   */
  getProsPagesSettings() {
    const getObj = {
      pageId: this.prosPageId,
      userId: this.userData["userProfileId"]
    };
    this.eyeProsPagesService
      .getProsPageSettingsData(getObj)
      .then(res => {
        if (res["success"]) {
          this.settingsData = res["data"];
          this.createForm(res["data"]);
          res["data"]["pageName"] = res["data"]["name"];
          this.utilService.onSetProsPageFullData(this.settingsData);
          if (res["data"].logo) {
            this.logoImgMediaId = res["data"]["logo"];
          }
          if (res["data"].logoUrl) {
            this.logoImg = atob(res["data"].logoUrl);
          }
        } else {
          this.utilService.errorHandler(res);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }

  getAllCountryListData() {
    this.eyeProsPagesService
      .getAllCountryData(this.userData["userProfileId"])
      .then(res => {
        if (res["success"]) {
          this.allCountryListData = res["data"];
        } else {
          this.utilService.errorHandler(res);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }

  getProsPageCategorySearch(params) {
    this.requestAutocompleteItemsForTypesData=[];
    this.eyeProsPagesService
      .getProsPageCategorySearch(params)
      .then(res => {
        if (res["success"]) {
          console.log("Test",res);
          let items = res["data"];
          for (const key in items) {
            const item = { display: items[key]["name"], value: items[key]["id"] };
            this.requestAutocompleteItemsForTypesData.push(item);
          }
        } else {
          this.utilService.errorHandler(res);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }


  updateProsPageSetting() {
    const postObj = this.updateSettingsForm.value;
    postObj["pageId"] = this.prosPageId;
    postObj["backgroundColor"] = this.backgroundColor;
    postObj["pageTypes"] = this.convertFormObjToArr(
      postObj["pageTypes"],
      "display"
    );
    postObj["keywords"] = this.convertFormObjToArr(
      postObj["keywords"],
      "display"
    );
    postObj["disableUsers"] = this.convertFormObjToArr(
      postObj["disableUsers"],
      "value"
    );

    postObj["blockUsers"] = this.convertFormObjToArr(
      postObj["blockUsers"],
      "value"
    );

    postObj["crossPostingPageIds"] = this.convertFormObjToArr(
      postObj["crossPostingPageIds"],
      "value"
    );

    if (postObj["restrictionCriteria"] !== "NONE") {
      postObj["restrictionCountries"] = this.convertFormObjToArr(
        postObj["restrictionCountries"],
        "display"
      );
    } else {
      delete postObj["restrictionCountries"];
    }

    postObj["authorizationFileData"] = [];
    postObj["authorizationFiles"] = [];
    if (this.attachFileArr.length > 0) {
      let tmpAuthorizationFileData = this.attachFileArr.filter(
        x => x.mediaId === ""
      );
      let tmpAuthorizationFiles = this.attachFileArr.filter(
        x => x.mediaId !== ""
      );
      postObj["authorizationFileData"] = this.convertFormObjToArr(
        tmpAuthorizationFileData,
        "file"
      );
      postObj["authorizationFiles"] = this.convertFormObjToArr(
        tmpAuthorizationFiles,
        "mediaId"
      );
    }

    postObj["negativeWords"] = this.negativeWords;
    postObj["ageCriteria"] = parseInt(postObj["ageCriteria"]);

    if (postObj["openHours"] === "SELECT_HOURS") {
      postObj["openHoursDayWise"] = this.convertFromArrToObjForOpenHours(
        postObj["openHoursDayWise"],
        "value",
        "start",
        "end",
        "checked"
      );
    } else {
      delete postObj["openHoursDayWise"];
    }

    postObj["notifications"] = this.convertFromArrToObj(
      this.notificationSettingsArr,
      "value",
      "checked"
    );
    postObj["userPermissions"] = this.convertFromArrToObj(
      this.userPermissionsArr,
      "value",
      "checked"
    );

    postObj["actionButtonsAdded"] = this.convertFormObjToArrWithCheck(
      this.allActionButtonsArr,
      "value",
      "checked"
    );
    postObj["parkingList"] = this.convertFormObjToArrWithCheck(
      this.parkingTypes,
      "value",
      "checked"
    );

    postObj["crossPostingOptions"] = this.convertFormObjToArrWithCheck(
      this.crossPostingOptions,
      "value",
      "checked"
    );

    delete postObj["negativeWordsText"];

    const getObj = {
      userId: this.userData["userProfileId"]
    };

    if (this.logoImgMediaId) {
      postObj["logo"] = this.logoImgMediaId;
    }

    postObj["coverPhotoId"] = this.settingsData["coverPhotoId"];
    postObj["phone"] = postObj["phone"]["internationalNumber"];
    postObj["addresses"] = this.settingsData["addresses"];
    postObj["policyUrls"] = this.settingsData["policyUrls"];

    this.eyeProsPagesService
      .updateProsPageSettings(postObj, getObj)
      .then(res => {
        if (res["success"]) {
          let mainMsg = res["message"];
          let resData = res["data"];
          if (this.addWithWhich === "add_place") {
            let inPostObj = {
              placeType: "PRO's Services",
              headline: resData["name"],
              address: resData["fullAddress"],
              street: resData["street"],
              city: resData["city"],
              state: resData["state"],
              zipcode: resData["zipCode"],
              email: this.userData["email"],
              message: "",
              rating: 0,
              latitude: resData["locationLat"],
              longitude: resData["locationLon"],
              proPageId: resData["pageId"]
            };
            this.homescommercialsService
              .addPlaceDetailData(this.userData["userProfileId"], inPostObj)
              .then((res: any) => {
                if (res["success"]) {
                  this.utilService.successHandler(mainMsg);
                  this.router.navigate(["/pros-page/pros-pages"]);
                } else {
                  this.utilService.errorHandler(res);
                }
              })
              .catch((err: any) => {
                if (err.hasOwnProperty("error")) {
                  this.utilService.errorHandler(err.error);
                } else {
                  this.utilService.errorHandler("");
                }
              });
          } else {
            this.router.navigate(["/pros-page/pros-pages"]);
          }
        } else {
          this.utilService.errorHandler(res);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }

  /**
   * For update perticuler settings data
   * @param postObj
   * @param getObj
   */
  updateIndividualProsPageSettings(postObj: any, getObj: any, fromWhere?: any) {
    this.eyeProsPagesService
      .updateIndividualProsPageSettings(postObj, getObj)
      .then(res => {
        if (res["success"]) {
          this.utilService.successHandler(res["message"]);
          let data = res["data"];
          if (fromWhere === 'operational-addresses' || fromWhere === 'policy' ||  fromWhere === 'blockUsers') {
            this.getProsPagesSettings();
            // if (fromWhere === "blockUsers") {
            //   this.updateSettingsForm.get("blockUsers").setValue([]);
            //   this.memberListData = [];
            //   setTimeout(() => {
            //     this.getMembersListData();
            //   }, 1000);
            // }
          }
          if (fromWhere === "address") {
            let placeData = {
              placeType: "PRO's Services",
              headline: data["name"],
              address: data["fullAddress"],
              street: data["street"],
              city: data["city"],
              state: data["state"],
              zipcode: data["zipCode"],
              email: data["email"],
              message: "",
              rating: 0,
              latitude: data["locationLat"],
              longitude: data["locationLon"],
              proPageId: data["pageId"]
            };
            this.homescommercialsService
              .addPlaceDetailData(this.userData["userProfileId"], placeData)
              .then((res: any) => {
                if (res["success"]) {
                  this.utilService.successHandler(res["message"]);
                } else {
                  this.utilService.errorHandler(res);
                }
              })
              .catch((err: any) => {
                if (err.hasOwnProperty("error")) {
                  this.utilService.errorHandler(err.error);
                } else {
                  this.utilService.errorHandler("");
                }
              });
          }
        } else {
          this.utilService.errorHandler(res);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }

  /**
   * For check is one of the days are selected or not
   */
  isAnyDaySelectedOrNot() {
    const openHoursDayWise = this.updateSettingsForm.get("openHoursDayWise")
      .value;
    if (openHoursDayWise.some(e => e.checked)) {
      return true;
    }
    return false;
  }

  /**
   * For convert array to object for the seleced hours
   */
  convertFromArrToObjForOpenHours(
    arr: any,
    key1: any,
    key2: string,
    key3: string,
    key4: string
  ) {
    let obj = {};
    for (const x in Object.keys(arr)) {
      if (arr[x][key4]) {
        obj[arr[x][key1]] = arr[x][key2] + "-" + arr[x][key3];
      }
    }
    return obj;
  }

  /**
   * For convert array to object
   * @param arr
   * @param key1
   * @param key2
   */
  convertFromArrToObj(arr: any, key1: any, key2: string) {
    let obj = {};
    for (const x in Object.keys(arr)) {
      if (arr[x][key2]) {
        obj[arr[x][key1]] = arr[x][key2];
      }
    }
    return obj;
  }

  /**
   * For convert objcat to array for the selected hours
   * @param obj
   */
  convertFromObjToArrForOpenHours(obj: any) {
    const tmpArr = Object.assign([], this.openHoursDayWiseArr);
    Object.keys(obj).map(key => {
      for (const x in Object.keys(tmpArr)) {
        if (tmpArr[x]["value"] === key) {
          const startEndArr = obj[key].split("-");
          tmpArr[x]["checked"] = true;
          tmpArr[x]["start"] = startEndArr[0];
          tmpArr[x]["end"] = startEndArr[1];
        }
      }
    });
    this.patchOpenHoursDayWiseArr(tmpArr);
  }

  /**
   *
   * @param obj
   * @param arr
   */
  convertFromObjToArr(obj: any, arr: any) {
    const newArr = Object.assign([], arr);
    Object.keys(obj).map(key => {
      for (const x in Object.keys(newArr)) {
        if (newArr[x]["value"] === key) {
          newArr[x]["checked"] = obj[key];
        }
      }
    });
    return newArr;
  }

  /**
   * For convert array of object to array
   * @param arr
   * @param key
   */
  convertFormObjToArr(arr: any, key: string) {
    const result = arr.map(a => a[key]);
    return result;
  }

  /**
   * For convert array of object to array with check
   * @param arr
   * @param key1
   * @param key2
   */
  convertFormObjToArrWithCheck(arr: any, key1: string, key2: string) {
    const result = [];
    arr.map(a => {
      if (a[key2]) {
        result.push(a[key1]);
      }
    });
    return result;
  }

  /**
   * For convert array to array of object
   * @param arr
   * @param key1
   * @param key2
   */
  convertFromArrToArrOfObj(arr: any, key1: string, key2: string) {
    const result = arr.map(a => {
      return { [key1]: a, [key2]: a };
    });
    return result;
  }

  /**
   * For set array data for disable and block user
   */
  setArrayofValueForDisableAndBlockUser(IdArr: any, MyArr: any) {
    let newArr = [];
    IdArr.map(key => {
      for (const x in Object.keys(MyArr)) {
        if (MyArr[x]["value"] == key) {
          newArr.push(MyArr[x]);
        }
      }
    });
    return newArr;
  }

  /**
   * For assign array of object value
   * @param arr1
   * @param arr2
   */
  assignDefualtValueInArr(arr1: any, arr2: any) {
    const newArr = Object.assign([], arr2);
    arr1.map(key => {
      for (const x in Object.keys(newArr)) {
        if (newArr[x]["value"] === key) {
          newArr[x]["checked"] = true;
        }
      }
    });
    return newArr;
  }

  /**
   * Open time picker for pop up window
   * @param type
   * @param index
   */
  openSetTimePopUP(type: string, index: number) {
    let openHoursDayWise = this.updateSettingsForm.get(
      "openHoursDayWise"
    ) as FormArray;
    let startTime = openHoursDayWise.at(index).get("start").value;
    let endTime = openHoursDayWise.at(index).get("end").value;
    if (type === "startTime") {
      const amazingTimePicker = this.atp.open({ time: startTime });
      amazingTimePicker.afterClose().subscribe(time => {
        openHoursDayWise
          .at(index)
          .get("start")
          .setValue(time);
        if (time > endTime) {
          openHoursDayWise
            .at(index)
            .get("end")
            .setValue(time);
        }
      });
    } else if (type === "endTime") {
      const amazingTimePicker = this.atp.open({ time: endTime });
      amazingTimePicker.afterClose().subscribe(time => {
        openHoursDayWise
          .at(index)
          .get("end")
          .setValue(time);
        if (time < startTime) {
          openHoursDayWise
            .at(index)
            .get("start")
            .setValue(time);
        }
      });
    }
  }

  /**
   * Get member list data
  */
  getMembersListData() {
    let getObj = {
      pageId: this.prosPageId,
      userId: this.userData["userProfileId"]
    };
    this.eyeProsPagesService
      .getMembersListData(getObj)
      .then(res => {
        if (res["success"]) {
          this.memberListData = res["data"].map(item => {
            return {
              display: item.firstName + " " + item.lastName,
              value: item.userProfileId
            };
          });
        } else {
          this.utilService.errorHandler(res);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }

  /**
   * For select new file
   * @param event
   */
  onSelectFile(event) {
    if (event.target.files && event.target.files.length === 0) return;
    let selectedFile = event.target.files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = _event => {
      this.attachFileArr.push({
        name: selectedFile.name,
        file: reader.result,
        mediaId: ""
      });
    };
  }

  /**
   * For select logo file
   */
  onSelectLogo(event: any) {
    if (event.target.files && event.target.files.length === 0) return;
    this.selectedLogoFile = event.target.files[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = _event => {
      this.logoImg = reader.result;
    };
    if (this.selectedLogoFile) {
      const imageObj = {
        userProfileMySqlId: this.utilService.getCurrentLoginUserProfileId(),
        albumId: "22222222-2222-2222-2222-222222222222",
        media: this.selectedLogoFile,
        mediaFor: "PROPAGE",
        mediaType: "PHOTOS",
        compression: true
      };
      const imageData = new FormData();
      Object.keys(imageObj).map(x => {
        imageData.append(x, imageObj[x]);
      });
      this.photosService
        .addMediaFile(imageData)
        .then((res: any) => {
          if (res["success"]) {
            this.logoImgMediaId = res.data.mediaId;
          }
        })
        .catch(err => {
          if (err.hasOwnProperty("error")) {
            this.utilService.errorHandler(err.error);
          } else {
            this.utilService.errorHandler("");
          }
        });
    }
  }

  removeLogo() {
    const albumId = "22222222-2222-2222-2222-222222222222";
    const mediaIds = this.logoImgMediaId;
    const userId = this.utilService.getCurrentLoginUserProfileId();
    this.photosService
      .deleteMultipleAlbumPhotos(albumId, mediaIds, userId)
      .then((res: any) => {
        if (res["success"]) {
          this.logoImgMediaId = "";
          this.selectedLogoFile = "";
          this.logoImg = "";
        }
      })
      .catch(err => {
        if (err.hasOwnProperty("error")) {
          this.utilService.errorHandler(err.error);
        } else {
          this.utilService.errorHandler("");
        }
      });
  }

  /**
   * For remove selected file
   */
  removeSelectedFile(i: number) {
    this.attachFileArr.splice(i, 1);
  }

  /**
   * Call when focus out
   */
  whenFocusOut(type) {
    if (type === "type") {
      this.checkEnterCharForType("");
    } else if (type === "keyword") {
      this.checkEnterCharForKeyword("");
    } else if (type === "country") {
      this.checkEnterCharForCountry("");
    } else if (type === "crossPosting") {
      this.checkEnterCharForCrossPosting("");
    }
  }

  /**
   * Add edit address data by user
   * @param fromWhere
   * @param editAddressData
   */
  openAddAddressView(fromWhere: any, editAddressData?: any) {
    this.modalReference = this.modalService.open(AddAddressComponent, {
      windowClass: "popup-wrapper add-place-modal add-website-modal",
      size: "lg"
    });
    this.modalReference.componentInstance.fromWhere = fromWhere;
    this.modalReference.componentInstance.fromWhichModule = 'prosPageSettings';
    if (editAddressData) {
      this.modalReference.componentInstance.editAddressData = editAddressData;
      this.modalReference.componentInstance.prosPageId = this.prosPageId;
      this.modalReference.componentInstance.editAddressId = editAddressData["addressId"];
    }
    this.modalReference.result.then((result: any) => {
      if (typeof result === "object") {
        if (fromWhere === 'edit') {
          let index = this.settingsData.addresses.findIndex(
            x => x.addressId === result["addressId"]
          );
          if (index !== -1) {
            this.settingsData.addresses[index] = result
          }
        } else {
          this.settingsData.addresses.push(result);
        }
        this.saveInsideForm('operational-addresses',this.settingsData.addresses);
      }
    });
  }

  /**
   * Delete addres by user
   * @param fromWhere
   * @param addressData
   */
  deleteAddress(fromWhere: any, addressData: any) {
    this.modalReference = this.modalService.open(DeletePageComponent, {
      windowClass: "popup-wrapper share-post-modal create-album-popup",
      size: "lg"
    });
    this.modalReference.componentInstance.message = "Are you sure you want to delete this address?";
    this.modalReference.componentInstance.subMessage = '';
    this.modalReference.componentInstance.title = "Delete";
    this.modalReference.result.then((result: any) => {
      if (result === "delete") {
        let index = this.settingsData.addresses.findIndex(
          x => x.addressId === addressData["addressId"]
        );
        if (index !== -1) {
          this.settingsData.addresses.splice(index,1);
        }
        this.saveInsideForm('operational-addresses',this.settingsData.addresses);
      }
    });
  }

  /**
   * Add and update policy urls data
   * @param fromWhere
   * @param socialSite_data
   * @param index
   */
  openAddPolicyUrlsView(fromWhere: any, socialSiteData?: any, index?:any) {
    this.modalReference = this.modalService.open(AddSocialLinkComponent, {
      windowClass: "popup-wrapper add-place-modal add-website-modal",
      size: "lg"
    });
    this.modalReference.componentInstance.fromWhere = fromWhere;
    this.modalReference.componentInstance.fromWhichModule = 'prosPageSettings';
    if (socialSiteData) {
      this.modalReference.componentInstance.editWebsiteData = socialSiteData;
    }
    this.modalReference.result.then((result: any) => {
      if (typeof result === "string") {
        if (!this.settingsData.policyUrls) {
          this.settingsData.policyUrls = [];
        }
        if (fromWhere === 'edit') {
          this.settingsData.policyUrls[index] = result
        } else {
          this.settingsData.policyUrls.push(result);
        }
        this.saveInsideForm('policy',this.settingsData.policyUrls);
      }
    });
  }

  /**
   * Delete policy urls by user
   * @param fromWhere
   * @param index
   */
  deletePolicyUrls(fromWhere: any, index: any) {
    this.modalReference = this.modalService.open(DeletePageComponent, {
      windowClass: "popup-wrapper share-post-modal create-album-popup",
      size: "lg"
    });
    this.modalReference.componentInstance.message = "Are you sure you want to delete this address?";
    this.modalReference.componentInstance.subMessage = '';
    this.modalReference.componentInstance.title = "Delete";
    this.modalReference.result.then((result: any) => {
      if (result === "delete") {
        this.settingsData.policyUrls.splice(index,1);
        this.saveInsideForm('policy',this.settingsData.policyUrls);
      }
    });
  }

  displayOpenHoursName(value) {
    let name = '';
    this.openHoursArr.map(x => {
      if (x.value === value) {
        name = x.name;
        return;
      }
    });
    return name;
  }
}
