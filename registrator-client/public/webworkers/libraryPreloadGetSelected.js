importScripts('libs/core.js','libs/md5.js')
self.addEventListener('message', function(e) {
    var out = {"books":[],"booksLines":[],"lines":[]}
    var preloadedTitles = JSON.parse(e.data.preloadedTitles)
    var preloadedBooks = JSON.parse(e.data.preloadedBooks)
    var lib_preload_view_id = JSON.parse(e.data.lib_preload_view_id)
     //console.log(preloadedBooks)
    preloadedTitles.forEach((books, index1) => {
      books.titles.forEach((title) => {
        if(title.selected==='yes'){
          
          var book_id = preloadedBooks.books[index1].id
          var booksLines=preloadedBooks.bookslines.filter(el => el.book_id===book_id&&el.lang_id===title.lang_id)
          var book_hash = ""
          booksLines.forEach((line)=>{
            book_hash = CryptoJS.MD5(book_hash+" "+line.l_id).toString()
          })
          out.books.push({
            lib_id:lib_preload_view_id,
            type:preloadedBooks.books[index1].type,
            author:"Bla 1",
            copyright:"",
            book_hash:book_hash,
            lang_id:title.lang_id
          })

          booksLines.forEach((line)=>{
            out.booksLines.push({
              book_id: book_hash,
              lang_id: line.lang_id,
              v_id: line.v_id?line.v_id:book_hash,
              c_line_id: line.c_line_id,
              l_id: line.l_id,
            })
            var lineText = preloadedBooks.lines.find(el => el._id===line.l_id)
            out.lines.findIndex(el => el._id===lineText._id) === -1 && out.lines.push({
              _id: lineText._id,
              lang_id:lineText.lang_id,
              t:decodeURIComponent(lineText.t),
              //words:[] ' todo add words split here
            })
          })
        }
      })
    })
    self.postMessage(out)
}, false)