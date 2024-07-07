const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(
    'mongodb+srv://acharyadevang547:bsdUfjhulCDDbJQq@anytest.ulmpzz4.mongodb.net/assignment2?retryWrites=true&w=majority&appName=anytest',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    price: Number,
    quantity: Number,
});

const Product = mongoose.model("Product", productSchema);

// User Schema 
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    purchase_history: String,
    shipping_address: String,
  });
  
  const User = mongoose.model("User", userSchema);
// Review Schema 
const reviewSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: Number,
    images: [String],
    comment: String,
    createdAt: { type: Date, default: Date.now },
  });
  
  const Review = mongoose.model("Review", reviewSchema);
  
  module.exports = Review;
  
  //cart
  const cartSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  
  const Cart = mongoose.model("Cart", cartSchema);
  
  module.exports = Cart;

  // Order Schema and Model
const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [{
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    }],
    total_amount: Number,
    status: { type: String, enum: ["created", "processing", "completed", "pending"], default: "created" },
    created_at: { type: Date, default: Date.now }
  });
  
  const Order = mongoose.model("Order", orderSchema);
// Routes

// Create a new product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a product by ID
app.patch("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new user
app.post("/users", async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).send("User created successfully");
    } catch (error) {
      res.status(500).send("Error creating user");
    }
  });
  
  // Get all users
  app.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send("Error retrieving users");
    }
  });
  
  // Get a user by ID
  app.get("/users/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Error retrieving user");
    }
  });
  
  // Update a user by ID
  app.patch("/users/update/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User updated successfully");
    } catch (error) {
      res.status(500).send("Error updating user");
    }
  });
  
  // Delete a user by ID
  app.delete("/users/delete/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
    } catch (error) {
      res.status(500).send("Error deleting user");
    }
  });

 
// Create a review
app.post("/reviews", async (req, res) => {
    try {
      const { product_id, user_id, rating, images, comment } = req.body;
      const review = new Review({ product_id, user_id, rating, images, comment });
      await review.save();
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).send(`Error creating review: ${error.message}`);
    }
  });
  
  // Get all reviews
  app.get("/reviews", async (req, res) => {
    try {
      const reviews = await Review.find();
      res.json(reviews);
    } catch (error) {
      console.error("Error getting reviews:", error);
      res.status(500).send(`Error getting reviews: ${error.message}`);
    }
  });
  
  // Get a review by ID
  app.get("/reviews/:id", async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).send("Review not found");
      }
      res.json(review);
    } catch (error) {
      console.error("Error getting review:", error);
      res.status(500).send(`Error getting review: ${error.message}`);
    }
  });
  
  // Update a review by ID
  app.patch("/reviews/:id", async (req, res) => {
    try {
      const { product_id, user_id, rating, images, comment } = req.body;
      const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        { product_id, user_id, rating, images, comment },
        { new: true, runValidators: true }
      );
      if (!updatedReview) {
        return res.status(404).send("Review not found");
      }
      res.json(updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).send(`Error updating review: ${error.message}`);
    }
  });
  
  // Delete a review by ID
  app.delete("/reviews/:id", async (req, res) => {
    try {
      const deletedReview = await Review.findByIdAndDelete(req.params.id);
      if (!deletedReview) {
        return res.status(404).send("Review not found");
      }
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).send(`Error deleting review: ${error.message}`);
    }
  });
  
 // Create a cart item or update quantity if already exists
app.post("/carts", async (req, res) => {
    try {
      const { product_id, quantity, user_id } = req.body;
  
      // Check if a cart item already exists for the product_id and user_id
      let cartItem = await Cart.findOne({ product_id, user_id });
  
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cartItem = new Cart({ product_id, quantity, user_id });
      }
  
      await cartItem.save();
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error creating or updating cart item:", error);
      res.status(500).send(`Error creating or updating cart item: ${error.message}`);
    }
  });
  
  // Get all cart items
  app.get("/carts", async (req, res) => {
    try {
      const cartItems = await Cart.find();
      res.json(cartItems);
    } catch (error) {
      console.error("Error getting cart items:", error);
      res.status(500).send(`Error getting cart items: ${error.message}`);
    }
  });
  
  // Get a cart item by ID
  app.get("/carts/:id", async (req, res) => {
    try {
      const cartItem = await Cart.findById(req.params.id);
      if (!cartItem) {
        return res.status(404).send("Cart item not found");
      }
      res.json(cartItem);
    } catch (error) {
      console.error("Error getting cart item:", error);
      res.status(500).send(`Error getting cart item: ${error.message}`);
    }
  });
  
// Update quantity of a cart item
app.patch("/carts/:productId/:userId", async (req, res) => {
    const { productId, userId } = req.params;
    const { quantity } = req.body;
  
    try {
      // Find the cart item by product_id and user_id
      let cartItem = await Cart.findOne({ product_id: productId, user_id: userId });
  
      if (!cartItem) {
        return res.status(404).send("Cart item not found");
      }
      cartItem.quantity = quantity;
  
      await cartItem.save();
  
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).send(`Error updating cart item: ${error.message}`);
    }
  });
  // Delete a cart item by ID
  app.delete("/carts/:id", async (req, res) => {
    try {
      const deletedCartItem = await Cart.findByIdAndDelete(req.params.id);
      if (!deletedCartItem) {
        return res.status(404).send("Cart item not found");
      }
      res.json({ message: "Cart item deleted successfully" });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).send(`Error deleting cart item: ${error.message}`);
    }
  });

// Create an Order
app.post("/orders", async (req, res) => {
    try {
      const { user_id, products, total_amount, status } = req.body;
    
      const order = new Order({ user_id, products, total_amount, status });
      await order.save();
      
      const productIds = products.map(product => product.product_id);
      await Cart.deleteMany({ product_id: { $in: productIds }, user_id });
  
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send(`Error creating order: ${error.message}`);
    }
  });
  
  
  // Get All Orders
  app.get("/orders", async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).send(`Error getting orders: ${error.message}`);
    }
  });
  
  // Get an Order by ID
  app.get("/orders/:id", async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).send("Order not found");
      }
      res.json(order);
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).send(`Error getting order: ${error.message}`);
    }
  });
  
 // Update an Order by ID
app.patch("/orders/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const { user_id, products, total_amount, status } = req.body;
  
      // Fetch the existing order
      let order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).send("Order not found");
      }

      order.user_id = user_id;
      order.products = products;
      order.total_amount = total_amount;
      order.status = status;
  
      await order.save()
      const currentProductIds = products.map(product => product.product_id);
      const existingProductIds = order.products.map(product => product.product_id);
      const productsToRemove = existingProductIds.filter(id => !currentProductIds.includes(id));
      await Cart.deleteMany({ product_id: { $in: productsToRemove }, user_id });
  
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).send(`Error updating order: ${error.message}`);
    }
  });
  
  // Delete an Order by ID
  app.delete("/orders/:id", async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      if (!deletedOrder) {
        return res.status(404).send("Order not found");
      }
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
         console.error("Error deleting order:", error);
             res.status(500).send(`Error deleting order: ${error.message}`);
    }
  });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
