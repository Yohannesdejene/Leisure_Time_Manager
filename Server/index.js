require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const app = express();
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
const { json } = require("express");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const { Op } = require("sequelize");
const multer = require("multer");

const { User, Place, Post, Product, Picture, Comment, CommentPost, Likes } =
  sequelize.models;

const PORT = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173"],

    credentials: true,
  })
);
app.use(cookieParser());

async function tableChange() {
  //  a function used to commit database changes just change name of model you want to update and call function

  await User.sync({ alter: true });
  await Place.sync({ alter: true });
  await Post.sync({ alter: true });
  await Product.sync({ alter: true });
  await Picture.sync({ alter: true });
  await Comment.sync({ alter: true });
  await CommentPost.sync({ alter: true });
  console.log("finished");
}
// tableChange();
const authCheck = async (req, res, next) => {
  console.log("cookies", req.cookies);
  console.log("headers", req.headers);
  console.log("checking");
  if (req.cookies.u) {
    console.log("in the first check");
    const token = req.cookies.u;
    if (token == null) {
      res.status(403).send("not logged in");
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      console.log("verifing");
      if (err) {
        console.log("Token error is ", err);
        res.status(403).send("not logged in");
      } else {
        req.user = user;
        console.log("req.user", req.user);
        next();
      }
    });
  } else if (req.headers.cookies) {
    console.log("in the second check");
    let contentincookie = req.headers.cookies;
    const token = contentincookie.slice(0);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      console.log("the request user is ", user);
      req.user = user;
      next();
    });
  } else {
    console.log("no cookie");
    res.sendStatus(403);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(jsonParser);
app.get("/images/:picid", (req, res) => {
  let id = req.params.picid;
  console.log("fetch image - ", id);
  return Picture.findOne({
    where: { id: id },
  })
    .then((data) => {
      console.log("image", data);
      // console.log("The data found is ", data);
      if (data) {
        return data.picPath;
      }
    })
    .then((data) => {
      if (data) {
        res.sendFile(__dirname + "/uploads/" + data);
      } else {
        res.status(404).send("Image not found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/personimages/:uid", (req, res) => {
  let id = req.params.uid;
  console.log("fetch image - ", id);
  return User.findOne({
    where: { id: id },
  })
    .then((data) => {
      console.log("user", data);
      // console.log("The data found is ", data);
      if (data) {
        return data.image;
      }
    })
    .then((data) => {
      if (data) {
        res.sendFile(__dirname + "/uploads/" + data);
      } else {
        res.status(404).send("Image not found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/productimage/:uid", (req, res) => {
  let id = req.params.uid;
  console.log("fetch image - ", id);
  return Product.findOne({
    where: { id: id },
  })
    .then((data) => {
      console.log("user", data);
      // console.log("The data found is ", data);
      if (data) {
        return data.image;
      }
    })
    .then((data) => {
      if (data) {
        res.sendFile(__dirname + "/uploads/" + data);
      } else {
        res.status(404).send("Image not found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
app.post("/signup", upload.single("image"), async (req, res) => {
  console.log("req.body", req.body);
  const { fname, lname, email, phonenumber, password, location } = req.body;
  const image = req.file.filename;
  console.log("req.file", req.file.filename);

  let user = await User.findOne({
    where: {
      [Op.or]: [{ phonenumber: phonenumber }, { email: email }],
    },
  });

  if (user) {
    console.log("user already exist");
    res.status(304).send("user already exist");
  } else {
    console.log("createing");

    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return User.create({
      id: "",
      fname: fname,
      lname: lname,
      password: hash,
      email: email,
      phonenumber: phonenumber,
      location: location,
      image: image,
    })
      .then(async (data) => {
        console.log("registration success", data);
        res.status(200).send("registration successful");
      })
      .catch((err) => {
        console.log("errro wholile sending", err);

        res.status(400).send("error in connecting");
      });
  }
});
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  console.log(req.body);
  let user = await User.findOne({ where: { email: email } });
  if (user) {
    const databasePass = user.password;

    const compare = await bcrypt.compare(password, databasePass);
    if (compare) {
      console.log("correct password");
      console.log(
        "process.env.REFRESH_TOKEN_SECRET",
        process.env.REFRESH_TOKEN_SECRET
      );
      const accessToken = jwt.sign(user.id, process.env.REFRESH_TOKEN_SECRET);

      console.log("accessToken", accessToken);
      res.cookie("u", accessToken, {
        httpOnly: true,
        // sameSite: "none",
        secure: true,
        maxAge: 7200000,
      });
      res.status(200).send("logged in");
    } else {
      res.status(404).send("password not correct");
    }
  } else {
    res.status(404).send("user not found");
  }
});
app.post("/enterplace", (req, res) => {
  const { name, location, placeType } = req.body;

  return Place.create({
    id: "",
    name: name,
    location: location,
    placeType: placeType,
  })
    .then(async (data) => {
      console.log("enetered", data);
      res.status(200).send("data entered");
    })
    .catch((err) => {
      console.log("err", err);

      res.status(400).send("error in connecting");
    });
});

app.post("/enterproduct", upload.single("image"), async (req, res) => {
  const { placeName, productName, price, description } = req.body;
  console.log("req.body", req.body);

  const image = req.file.filename;
  console.log("req.file", req.file.filename);
  const place = await Place.findOne({ where: { name: placeName } });
  if (place) {
    return Product.create({
      id: "",
      PlaceId: place.id,
      productName,
      price,
      description,
      image,
    })
      .then(async (data) => {
        console.log("enetered", data);
        res.status(200).send("data entered");
      })
      .catch((err) => {
        console.log("err", err);

        res.status(400).send("error in connecting");
      });
  } else {
    console.log("errro placename not fiund");
    res.status(404).send("Not found");
  }
});
//
app.post("/post", authCheck, upload.array("images"), async (req, res) => {
  let uid = req.user;
  const { text } = req.body;

  console.log("user", req.user);
  console.log("req.file", req.files);
  const post = await Post.create({
    id: "",
    text: text,
    UserId: uid,
    date: new Date().toISOString(),
    likes: 0,
  });
  if (post) {
    try {
      console.log("in the catch");
      // Create a new Image object for each uploaded file
      const images = req.files.map((file) => {
        return {
          id: "",
          picPath: file.filename,
          PostId: post.id,
        };
      });

      // Save the images to the database using Sequelize
      const savedImages = await Picture.bulkCreate(images);

      console.log("Saved images:", savedImages);

      res.status(200).send("Images uploaded successfully");
    } catch (error) {
      console.error("Error saving images:", error);
      res.status(500).send("Error saving images");
    }
  } else {
    res.status(404).send("Error while apploading");
  }
});
app.get("/posts/:page", async (req, res) => {
  let pageNo = req.params.page;
  const page = pageNo || 1;
  const pageSize = 10;

  try {
    // retrieve a subset of posts with associated images and user data
    const { count, rows } = await Post.findAndCountAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: Picture },
        { model: CommentPost },
        {
          model: User,
          attributes: [
            "id",
            "fname",
            "lname",
            "email",
            "phonenumber",
            "location",
            "image",
          ],
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // calculate metadata about the pagination
    const totalPages = Math.ceil(count / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    // send the paginated posts data back to the client
    res.set("X-Total-Count", count);
    res.set("X-Page", page);
    res.set("X-Page-Size", pageSize);
    res.set("X-Total-Pages", totalPages);
    if (hasNextPage) res.set("X-Next-Page", nextPage);
    if (hasPrevPage) res.set("X-Prev-Page", prevPage);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});

app.get("/personposts/:id", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  let postUserId = req.params.id;

  try {
    // retrieve a subset of posts with associated images and user data
    const { count, rows } = await Post.findAndCountAll({
      where: { UserId: postUserId },
      include: [
        { model: Picture },
        {
          model: User,
          attributes: [
            "id",
            "fname",
            "lname",
            "email",
            "phonenumber",
            "location",
            "image",
          ],
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // calculate metadata about the pagination
    const totalPages = Math.ceil(count / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;

    // send the paginated posts data back to the client
    res.set("X-Total-Count", count);
    res.set("X-Page", page);
    res.set("X-Page-Size", pageSize);
    res.set("X-Total-Pages", totalPages);
    if (hasNextPage) res.set("X-Next-Page", nextPage);
    if (hasPrevPage) res.set("X-Prev-Page", prevPage);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});
app.get("/profile", authCheck, async (req, res) => {
  try {
    const uid = req.user;
    const user = await User.findOne({
      where: { id: uid },
    });
    const { id, fname, lname, email, phonenumber, location, image } = user;

    console.log("user", {
      id,
      fname,
      lname,
      email,
      phonenumber,
      location,
      image,
    });
    res
      .status(200)
      .json({ id, fname, lname, email, phonenumber, location, image });
  } catch (error) {
    console.log("error", err);
    res.status(500).send("Error retraiving the profile");
  }
});

app.post("/recommend", async (req, res) => {
  //const budget = parseFloat(req.query.budget);
  const budget = parseFloat(req.body.money);
  try {
    // retrieve products that are within the user's budget and include seller information
    const products = await Product.findAll({
      where: {
        price: {
          [Op.lte]: budget,
        },
      },
      include: [
        {
          model: Place,
          attributes: ["id", "name", "placeType", "location"],
        },
      ],
      order: [sequelize.literal(`ABS(price - ${budget}) ASC`)],
    });

    // recommend the products to the user
    let remainingBudget = budget;
    let totalRecommendedPrice = 0;
    const recommendedProducts = [];
    const alreadyRecommendedProducts = [];

    for (const product of products) {
      if (
        remainingBudget >= product.price &&
        !alreadyRecommendedProducts.includes(product.id)
      ) {
        recommendedProducts.push(product);
        alreadyRecommendedProducts.push(product.id);
        remainingBudget -= product.price;
        totalRecommendedPrice += product.price;
      }
    }

    // check if there is any remaining budget
    if (remainingBudget > 0) {
      // retrieve additional products that are within the remaining budget and include seller information
      const additionalProducts = await Product.findAll({
        where: {
          price: {
            [Op.lte]: remainingBudget,
          },
        },
        include: [
          {
            model: Place,
            attributes: ["id", "name", "placeType", "location"],
          },
        ],
        order: [sequelize.literal(`ABS(price - ${remainingBudget}) ASC`)],
      });

      // add the additional products to the recommended products
      for (const product of additionalProducts) {
        if (!alreadyRecommendedProducts.includes(product.id)) {
          recommendedProducts.push(product);
          alreadyRecommendedProducts.push(product.id);
          remainingBudget -= product.price;
          totalRecommendedPrice += product.price;
        }
      }
    }

    // send the recommended products data back to the client, including seller information
    res.status(200).json({
      recommendedProducts: recommendedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        productName: product.productName,
        description: product.description,
        image: product.image,
        place: {
          id: product.Place.id,
          name: product.Place.name,
          placeType: product.Place.placeType,
          location: product.Place.location,
        },
      })),
      totalRecommendedPrice: totalRecommendedPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving recommended products");
  }
});

app.post("/comment", authCheck, async (req, res) => {
  // const { text, postId } = req.body;
  console.log("In the commetnaccepting page", req.body);
  const { text, postId } = req.body;
  const userId = req.user; // Assuming user ID is stored in a cookie

  try {
    const comment = await CommentPost.create({
      id: "",
      commentText: text,
      PostId: postId,
      UserId: userId,
      date: new Date().toISOString(),
    });
    console.log("commented", comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    console.log("errr in commenting");
    res.status(500).json({ message: "Failed to create comment" });
  }
});

app.get("/comments", async (req, res) => {
  const postId = req.query.postId;

  const { page = 1, limit = 30 } = req.query.page;
  console.log("req.body", req.body);
  try {
    const comments = await CommentPost.findAndCountAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      include: [
        {
          model: User,
          attributes: ["id", "fname", "lname", "email", "image"],
        },
      ],
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});
app.post("/like", async (req, res) => {
  const { action, postId } = req.body;

  try {
    // Find the post by ID
    const post = await Post.findByPk(postId);
    if (post) {
      // Increment or decrement the number of likes and save the post
      if (action === "like") {
        post.likes++;
      } else if (action === "unlike" && post.likes > 0) {
        post.likes--;
      }
      await post.save();

      res.json(post);
    } else {
      console.log("post not found");
    }
  } catch (err) {
    console.error("Error handling like:", err);
    res.status(500).json({ error: "Error handling like" });
  }
});

app.post("/commentonproduct", authCheck, async (req, res) => {
  // const { text, postId } = req.body;
  console.log("In the commetnaccepting page", req.body);
  const { text, productId } = req.body;
  const userId = req.user; // Assuming user ID is stored in a cookie

  try {
    const comment = await Comment.create({
      id: "",
      commentText: text,
      ProductId: productId,
      UserId: userId,
      date: new Date().toISOString(),
    });
    console.log("commented", comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    console.log("errr in commenting");
    res.status(500).json({ message: "Failed to create comment" });
  }
});

app.get("/commentonproduct", async (req, res) => {
  const productId = req.query.productId;
  const page = req.query.page || 1;
  const limit = 30;
  console.log("req.body", req.body);
  try {
    const comments = await Comment.findAndCountAll({
      where: { ProductId: productId },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      include: [
        {
          model: User,
          attributes: ["id", "fname", "lname", "email", "image"],
        },
      ],
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

app.get("/", authCheck, (req, res) => {
  console.log("donenennen");
  res.status(200);
  res.send("Welcome to root URL of Server");
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Successfully Running in post ", PORT);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
