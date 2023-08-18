const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
var methodOverride = require("method-override");

// to import our model
const Product = require("./models/product");

mongoose
	.connect("mongodb://localhost:27017/farmStand", {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("mongo connection open");
	})
	.catch((err) => {
		console.log("mongo connection error");
		console.log(err);
	});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

// set up the index
app.get("/products", async (req, res) => {
	const { category } = req.query;
	if (category) {
		const products = await Product.find({ category });
		res.render("products/index", { products, category });
	} else {
		const products = await Product.find({});
		res.render("products/index", { products, category: "All" });
	}
	// const products = await Product.find({});
	// console.log(products);
	// res.send("all products will be here");
	// res.render("products/index", { products });
});

//form to add new products
app.get("/products/new", (req, res) => {
	res.render("products/new", { categories });
});

// add product to list
app.post("/products", async (req, res) => {
	// console.log(req.body);
	const newProduct = new Product(req.body);
	await newProduct.save();
	// console.log(newProduct);
	// res.send("making your products");
	res.redirect(`/products/${newProduct._id}`);
});

// set up a details page
app.get("/products/:id", async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	// console.log(product);
	res.render("products/details", { product });
});

//form to edit product
app.get("/products/:id/edit", async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render("products/edit", { product, categories });
});

//update a product
app.put("/products/:id", async (req, res) => {
	const { id } = req.params;
	// console.log(req.body);
	const product = await Product.findByIdAndUpdate(id, req.body, {
		runValidators: true,
		new: true,
	});
	res.redirect(`/products/${product._id}`);
});

//delete product
app.delete("/products/:id", async (req, res) => {
	const { id } = req.params;
	const deletedProduct = await Product.findByIdAndDelete(id);
	res.redirect("/products");
});

app.listen(3000, () => {
	console.log("App is listening on port 3000");
});
