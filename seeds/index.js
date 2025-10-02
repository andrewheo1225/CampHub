//This file deletes everything in the database and randomly populates it based on the seeds file


const express = require('express');
const app = express();
const cities = require('./cities')
const {descriptros,places, descriptors} = require('./seedhelper')
//connection to MongoDB through mongoose, error checking connection to db
const mongoose = require('mongoose')
const Campground = require('../models/campground');
const db = mongoose.connection


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database Connected!")
})
//in order to use POST etc
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//function that choose a random value from the array
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random100 = Math.floor((Math.random() * 1000))
        const camp =new Campground({
            location: `${cities[random100].city},${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }

}

seedDB().then(()=>{
    console.log("Seed Filed Completed")
    console.log("Database Closed")
    mongoose.connection.close()
})