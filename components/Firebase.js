import React from 'react';
import firebase from 'firebase'


  var firebaseConfig = {
    apiKey: "AIzaSyAP1l3oqUv2weQ_ff5mHRhkW3HIWMwKp_g",
    authDomain: "cloudbook-d7b7b.firebaseapp.com",
    databaseURL: "https://cloudbook-d7b7b-default-rtdb.firebaseio.com",
    projectId: "cloudbook-d7b7b",
    storageBucket: "cloudbook-d7b7b.appspot.com",
    messagingSenderId: "252002840151",
    appId: "1:252002840151:web:6383ff23394ddfca34fd12"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig); 

const db = firebase.firestore();
const  auth = firebase.auth();
export {auth,db } ;