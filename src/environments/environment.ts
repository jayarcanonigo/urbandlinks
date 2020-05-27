// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl : 'https://wsint.advisen.com/cybermetrix/',
  firebaseConfig : {
    apiKey: "AIzaSyCfWdth7o2BSNa-K2Etgf4FUAWQzFHnnek",
    authDomain: "ecq-express.firebaseapp.com",
    databaseURL: "https://ecq-express.firebaseio.com",
    projectId: "ecq-express",
    storageBucket: "ecq-express.appspot.com",
    messagingSenderId: "262564869989",
    appId: "1:262564869989:web:17a80867ac26f7e3a3538c",
    measurementId: "G-TLZV68GL02"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
