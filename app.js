const express = require('express');
const app = express();
const ejsMate = require('ejs-mate')

//sets the views directory as the render templates
const path = require('path');
app.set('view engine', 'ejs');
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname,'views'));

//connection to MongoDB through mongoose, error checking connection to db
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database Connected!")
})

//in order to use POST etc
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const Campground = require('./models/campground')


app.get("/", (req,res) => {
    res.render('home')
})

//shows all campgrounds
app.get("/campgrounds", async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})

})
//create a new campground
app.get("/campgrounds/new", (req,res) => {
    res.render('campgrounds/new')
})
app.post("/campgrounds", async (req,res) => {
    const campground = new Campground(req.body.campground) 
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

//shows specific campground. Must be after 'campground/new' to preserve isolation
app.get("/campgrounds/:id", async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})

})

//retrieves a campground and updates it
app.get("/campgrounds/:id/edit", async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})

})
app.put("/campgrounds/:id", async (req,res) => {
    const {id} = req.params
    //in edit.ejs, we use name campground[--] to create an object and sending it here to destructure when calling mongo
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

//delete a specific campground
app.delete("/campgrounds/:id", async (req,res) => {
    const {id} = req.params
    //in edit.ejs, we use name campground[--] to create an object and sending it here to destructure when calling mongo
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})


//triggers immediately
app.listen(3000, () => {
    console.log("Lisening on Port 3000!!")
})