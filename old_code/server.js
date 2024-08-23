//khởi tạo server
const express = require('express'); //require express
// từ express 4.16, ko cần require body-parser
// var bodyParser = require('body-parser'); //require body-parser
const mysql = require('mysql'); //kết nối vs mysql
const multer = require('multer'); //upload file
const app = express();
const port = 3000;

//tạo kết nối với CSDL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wd18412'
})

//khai báo thông tin để upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const upload = multer({ storage: storage })

//khai báo sử dụng ejs
app.set('view engine', 'ejs'); //khai báo view engine là ejs
app.set('views', './views'); //khai báo thư mục chứ file giao diện
// app.use(bodyParser.urlencoded()); //từ express 4.16 trở xuống
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //từ express 4.16 trở lên
//router
app.get('/list', (req,res) => {
    let sql = 'SELECT * FROM products'; //khai báo câu truy vấn
    db.query(sql, function (err,data) { //thực thi câu truy vấn, lấy data
        if (err) throw err //xử lỷ lỗi (nếu có) 
        res.render('list', { products: data }) //truyền data sang hiển thị ở list.ejs
    })
})

app.get('/create', (req,res) => {
    res.render('create');
})

app.post('/save', upload.single('image'),  (req,res) => {
    // console.log(req.body, req.file);
    //lấy dữ liệu người dùng nhập từ form
    var newProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename
    }
    //thực thi câu truy vấn
    db.query('INSERT INTO products SET ?', newProduct, (err,data) => {
        if (err) throw err
        console.log('Create successfully');
        res.redirect('/list');
    })

    // let a = req.body.a;
    // let b = req.body.b;
    // let c = req.body.c;

    // if (a == 0) {
    //     if (b == 0) {
    //         if (c == 0) {
    //             console.log('Vô số nghiệm')
    //         } else {
    //             console.log('Vô nghiệm')
    //         }
    //     } else {
    //         console.log(`PT có 1 nghiệm x = ${-c/b}`)
    //     }
    // } else {
    //     var delta = b*b-4*a*c;
    //     if (delta < 0) {
    //         console.log('Vô nghiệm');
    //     } else if (delta == 0) {
    //         console.log(`PT có nghiệm kép x1=x2= ${-b/(2*a)}`);
    //     } else {
    //         var x1 = (-b - Math.sqrt(delta))/(2*a);
    //         var x2 = (-b + Math.sqrt(delta))/(2*a);

    //         console.log(`PT có 2 nghiệm phân biệt x1=${x1} và x2= ${x2}`);
    //     }
    // }
})

app.get('/edit/:id', (req,res) => {
    var id = req.params.id;
    db.query(`SELECT * FROM products WHERE id=${id}`, (err,data) => {
        if (err) throw err //nếu có lỗi
        res.render('edit', { product: data[0] });
    })
})

app.post('/update/:id', upload.single('image'), (req,res) => {
    //lấy id của sản phẩm cần update
    var id = req.params.id;
    //lấy dữ liệu gửi từ form
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var image = req.file.filename;

    db.query(
        'UPDATE products SET name=?,price=?,description=?,image=? WHERE id=?',
        [name,price,description,image,id],
        (err,data) => {
            if (err) throw err 
            console.log('Update success');
            res.redirect('/list');
        })

})

app.get('/danhmuc/:iddanhmuc/sanpham/:id', (req,res) => {
    console.log(req.query); //được đánh dấu bằng ?ten1=x&ten2=y trên url
    console.log(req.params); //nằm trong url /:id
    //params không được trùng tên nhau
    //nếu đặt trùng thì sẽ lấy giá trị của thằng sau cùng
    // res.send('<h1>Đây là trang chủ</h1>'); 
    res.render('detail', {
        id: req.params.id,
        iddanhmuc: req.params.iddanhmuc,
    });
});

app.listen(port, () => {
    console.log(`SV đang chạy ở port ${port}`);
})