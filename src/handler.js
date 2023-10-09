const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })

    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })

  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  /* const { name, reading, finished } = request.params

   if (name) {
    const searchBook = books.filter((book) => book.name.ignoreCase === name.ignoreCase)
    if (searchBook) {
      const byNameBooks = []
      searchBook.forEach((book) => {
        const { id, name, publisher } = book
        const allFoundBooks = { id, name, publisher }
        byNameBooks.push(allFoundBooks)
      })
      return {
        status: 'success',
        data: {
          books: byNameBooks
        }
      }
    }

  }

  if (reading === 0 || reading === 1) {
    if (reading === 0) {
      const unreadBooks = []
      const searchBook = books.filter((book) => book.reading === false)
      if (searchBook) {
        searchBook.forEach((book) => {
          const { id, name, publisher } = book
          const foundBooks = { id, name, publisher }
          unreadBooks.push(foundBooks)
        })
        return {
          status: 'success',
          data: {
            books: unreadBooks
          }
        }
      }

    }
  } */

  if (books.length === 0) {
    return {
      status: 'success',
      data: books
    }
  }

  const allBooks = []

  books.forEach((book) => {
    const { id, name, publisher } = book
    const newBook = { id, name, publisher }
    allBooks.push(newBook)
  })

  return {
    status: 'success',
    data: {
      books: allBooks
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const book = books.filter((book) => book.id === bookId)[0]
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)
  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
