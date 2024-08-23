//khởi tạo server
const bodyParser = require("body-parser"); //body-parser
const express = require("express"); //require express
const mysql = require("mysql"); //Ket noi data
const multer = require("multer"); // upload file

const app = express();
const port = 3000;

// Tao ket noi DATABASE
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "wd18412",
});

// Khai bao tai lieu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//khai báo sử dụng ejs
app.set("view engine", "ejs"); //khai báo view engine là ejs
app.set("views", "./views"); //khai báo thư mục chứ file giao diện
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//router

app.get("/list", (req, res) => {
  let sql = "SELECT * FROM products ";
  db.query(sql, function (err, data) {
    if (err) throw err;
    res.render("list", { products: data });
  });
});

app.delete("/delete-product/:id", (req, res) => {
  let sql = `DELETE FROM products WHERE id = ${req.params.id}`;
  db.query(sql, function (err, data) {
    if (err) throw err;
    res.redirect("/list");
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/save", upload.single("image"), (req, res) => {
  console.log(req.body, req.file);
  var newProduct = {
    name: req.body.name,
    price: req.body.price,
    image: req.file.filename,
  };
  db.query("INSERT INTO products SET ?", newProduct, (err, data) => {
    if (err) throw err;
    console.log("Thêm sản phẩm thành công");
    res.redirect("/list");
  });
});

app.get("/edit/:id", (req, res) => {
  var id = req.params.id;
  db.query("SELECT * FROM products WHERE id =?", [id], (err, data) => {
    console.log(typeof data);
    if (err) throw err; // Neu co loi
    res.render("edit", { product: data[0] });
  });
});
app.post("/update/:id", upload.single("image"), (req, res) => {
  // Lấy id của sản phẩm cần update
  var id = req.params.id;
  //Lấy dữ liệu gửi từ form
  var name = req.body.name;
  var price = req.body.price;
  var image = req.file.filename;
  db.query(
    "UPDATE products SET name = ?, price = ?, image = ? WHERE id = ?",
    [name, price, image, id],
    (err, data) => {
      if (err) throw err;
      console.log("Cập nhật sản phẩm thành công");
      res.redirect("/list");
    }
  );
});

app.get("/danhmuc/2/sanpham/1", (req, res) => {
  console.log(req.query); //được đánh dấu bằng ?ten1=x&ten2=y trên url
  console.log(req.params); //nằm trong url /:id
  //params không được trùng tên nhau
  //nếu đặt trùng thì sẽ lấy giá trị của thằng sau cùng
  //   res.send("<h1>Đây là trang chủ</h1>");
  res.render("detail", {
    id: req.params.id,
    iddanhmuc: req.params.iddanhmuc,
  });
});

app.listen(port, () => {
  console.log(`SV đang chạy ở port ${port}`);
});
