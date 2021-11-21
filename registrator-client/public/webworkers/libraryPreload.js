self.addEventListener('message', function(e) {
    var arrTitles = []
    //console.log(e.data)
    e.data.books.forEach(function  callbackFn(book){
      var arrTitleLine = []
      book.langs.forEach( function  callbackFn(lang_id){
        var bookline = e.data.bookslines.find(x => x["book_id"] === book["id"]&&x["lang_id"] === lang_id)
        arrTitleLine.push( {
          lang_id:lang_id,
          title:decodeURIComponent(e.data.lines.find(x => x["_id"] === bookline["l_id"]).t),
          selected:'no'
        })
      })
      arrTitles.push({"book_id":book.id,"titles":arrTitleLine})
    })
    self.postMessage(arrTitles)
}, false)