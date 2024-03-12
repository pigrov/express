const express = require(`express`);
const { v4: uuid } = require(`uuid`);

let books = [];

const Book = (data) => {
    console.log(data);
    let {
        id = uuid(),
        title = ``,
        description = ``,
        authors = ``,
        favorite = 0,
        fileCover = ``,
        fileName = ``,
    } = data;

    const book = {
        id,
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    };

    return book;
};

books.push(Book({ title: `book` }));
books.push(Book({ title: `book2` }));

const app = express();
app.use(express.json()).listen(process.env.PORT);
app.get(`/api/books`, (rq, rs) => {
    rs.json(books);
})
    .get(`/api/books/:id`, (rq, rs) => {
        const { id } = rq.params;
        const book = books.filter((x) => x.id == id)[0];

        !book && rs.status(404);
        rs.json(book || { result: "error", message: "book not found" });
    })
    .post(`/api/books`, (rq, rs) => {
        const book = Book(rq.body);
        books.push(book);

        rs.json(book);
    })
    .post(`/api/user/login`, (rq, rs) => {
        const book = Book(rq.body);
        books.push(book);

        rs.json({ id: 1, mail: "test@mail.ru" }).status(201);
    })

    .put(`/api/books/`, (rq, rs) => {
        rs.json({ result: "error", message: "id must set" });
    })
    .put(`/api/books/:id`, (rq, rs) => {
        const { id } = rq.params;
        const book = books.filter((x) => x.id == id)[0];

        book &&
            books
                .filter((x) => x.id == id)
                .map((o) => {
                    Object.keys(rq.body).map((p) => {
                        o[p] = rq.body[p];
                    });
                });

        !book && rs.status(404);
        rs.json({ result: book ? "updated" : "book not found" });
    })
    .delete(`/api/books/`, (rq, rs) => {
        rs.json({ result: "error", message: "id must set" });
    })
    .delete(`/api/books/:id`, (rq, rs) => {
        const { id } = rq.params;
        const book = books.filter((x) => x.id == id)[0];
        book && (books = books.filter((x) => x.id != id));

        !book && rs.status(404);
        rs.json({ result: book ? "success" : "book not found" });
    });
